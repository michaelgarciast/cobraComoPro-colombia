#!/usr/bin/env python3
"""
Descarga los meses faltantes de la GEIH desde el catálogo de microdatos
del DANE y opcionalmente regenera las tarifas.

El captcha del portal solo se valida en el navegador; la URL de descarga
es directa, por lo que basta una petición HTTP para obtener el ZIP.

Uso:
  python descargar_mes.py
  python descargar_mes.py --carpeta datos_2026 --anio 2026 --generar
"""
import argparse
import re
import subprocess
import sys
import zipfile
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
URL_CATALOGO = "https://microdatos.dane.gov.co/index.php/catalog/{catalogo}/get-microdata"
PATRON_DESCARGA = re.compile(
    r"mostrarModal\('([^']+\.zip)'\s*,\s*'(https://[^']+)'", re.IGNORECASE
)
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
)


def descargar(url):
    # Se usa curl porque el Python del sistema (LibreSSL) no negocia TLS
    # con el servidor del DANE; el curl de macOS sí lo hace.
    resultado = subprocess.run(
        ["curl", "-sfL", "-A", USER_AGENT, url],
        capture_output=True,
        check=True,
    )
    return resultado.stdout


def meses_disponibles(catalogo):
    html = descargar(URL_CATALOGO.format(catalogo=catalogo)).decode(
        "utf-8", errors="replace"
    )
    return {
        nombre[:-4].strip(): url.strip()
        for nombre, url in PATRON_DESCARGA.findall(html)
    }


def nombre_zip_correcto(nombre):
    # Algunos ZIPs del DANE guardan los nombres en cp437 en vez de UTF-8.
    try:
        return nombre.encode("cp437").decode("utf-8")
    except (UnicodeEncodeError, UnicodeDecodeError):
        return nombre


def extraer_csv(zip_bytes, destino):
    import io

    extraidos = 0
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as archivo:
        for info in archivo.infolist():
            nombre = nombre_zip_correcto(info.filename)
            stem = Path(nombre).stem.lower()
            if info.is_dir() or not nombre.lower().startswith("csv/"):
                continue
            # Solo se conservan los archivos que usa el flujo, igual que
            # en los meses descargados a mano.
            if stem != "ocupados" and "características generales" not in stem:
                continue
            ruta = destino / nombre
            ruta.parent.mkdir(parents=True, exist_ok=True)
            ruta.write_bytes(archivo.read(info))
            extraidos += 1
    return extraidos


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--carpeta", type=Path, default=BASE_DIR / "datos_2026")
    parser.add_argument("--anio", default="2026")
    parser.add_argument("--catalogo", default="900")
    parser.add_argument("--salida", default=None)
    parser.add_argument(
        "--generar",
        action="store_true",
        help="Ejecuta generar_tarifas.py al finalizar",
    )
    args = parser.parse_args()

    disponibles = meses_disponibles(args.catalogo)
    del_catalogo = {
        mes: url for mes, url in disponibles.items() if mes.endswith(args.anio)
    }
    if not del_catalogo:
        sys.exit(f"No encontré meses de {args.anio} en el catálogo")

    args.carpeta.mkdir(parents=True, exist_ok=True)
    existentes = {carpeta.name for carpeta in args.carpeta.iterdir() if carpeta.is_dir()}
    faltantes = sorted(del_catalogo.keys() - existentes)
    print(f"Catálogo: {sorted(del_catalogo)}")
    print(f"Ya tienes: {sorted(existentes)}")

    if not faltantes:
        print("No faltan meses.")
    else:
        print(f"Descargando: {faltantes}")
        for mes in faltantes:
            print(f"  {mes}...", end=" ", flush=True)
            zip_bytes = descargar(del_catalogo[mes])
            n = extraer_csv(zip_bytes, args.carpeta / mes)
            print(f"{n} archivos CSV ({len(zip_bytes) / 1e6:.0f} MB)")

    if args.generar and faltantes:
        salida = args.salida or BASE_DIR / f"tarifas-{args.anio}.json"
        subprocess.run(
            [
                sys.executable,
                str(BASE_DIR / "generar_tarifas.py"),
                "--carpeta",
                str(args.carpeta),
                "--anio",
                args.anio,
                "--salida",
                str(salida),
            ],
            check=True,
        )


if __name__ == "__main__":
    main()
