#!/usr/bin/env python3
"""
Genera tarifas por ocupación CIUO-08 A.C. y actividad económica CIIU desde
los archivos mensuales de Ocupados de GEIH.

Uso:
  python generar_tarifas.py --carpeta datos --salida tarifas.json
  python generar_tarifas.py --carpeta datos/2026 --anio 2026 --salida tarifas-2026.json

Las descripciones ocupacionales proceden de referencias_geih.json. Allí se
documenta que las denominaciones CUOC 2025 se asocian por coincidencia del
código de cuatro dígitos; no es una tabla oficial de concordancia CIUO-CUOC.
Se aceptan los meses disponibles del año. Al agregar archivos mensuales, se
debe volver a ejecutar el script con la carpeta anual completa.
"""
import argparse
import json
import sys
from datetime import date
from pathlib import Path

import numpy as np
import pandas as pd

SEMANAS_POR_MES = 52 / 12
MESES_VALIDOS = {f"{mes:02d}" for mes in range(1, 13)}
NOMBRES_MESES = (
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
)
COLS = [
    "PERIODO",
    "MES",
    "P6430",
    "INGLABO",
    "P6800",
    "OFICIO_C8",
    "RAMA2D_R4",
    "FEX_C18",
]


def num(serie):
    return pd.to_numeric(
        serie.astype(str).str.replace(",", ".", regex=False), errors="coerce"
    )


def percentil_ponderado(x, w, q):
    x = np.asarray(x, dtype=float)
    w = np.asarray(w, dtype=float)
    orden = np.argsort(x)
    x, w = x[orden], w[orden]
    posiciones = (np.cumsum(w) - 0.5 * w) / w.sum()
    return float(np.interp(q, posiciones, x))


def redondear(valor, base):
    return int(round(valor / base) * base)


def describir_periodo(meses, anio):
    numeros = [int(mes) for mes in meses]
    nombres = [NOMBRES_MESES[numero - 1].capitalize() for numero in numeros]
    if numeros == list(range(numeros[0], numeros[-1] + 1)):
        return f"{nombres[0]}–{nombres[-1]} {anio}"
    return f"{', '.join(nombres)} {anio}"


def leer_ocupados(carpeta, anio):
    archivos = sorted(
        ruta
        for ruta in carpeta.rglob("*")
        if ruta.suffix.lower() == ".csv" and ruta.stem.lower() == "ocupados"
    )
    if not archivos:
        sys.exit(f"No encontré archivos de Ocupados en {carpeta}")

    partes = []
    meses_por_archivo = []
    for ruta in archivos:
        df = pd.read_csv(
            ruta,
            sep=";",
            dtype=str,
            encoding="latin-1",
            usecols=lambda columna: columna in COLS,
            low_memory=False,
        )
        faltan = [columna for columna in COLS if columna not in df.columns]
        if faltan:
            sys.exit(f"{ruta}: faltan columnas {faltan}")
        meses = set(df["MES"].dropna().str.strip())
        meses_por_archivo.append((ruta, meses))
        print(f"  {ruta.name}: {len(df):,} filas")
        partes.append(df)

    df = pd.concat(partes, ignore_index=True)
    df["MES"] = df["MES"].fillna("").str.strip()
    df["PERIODO"] = df["PERIODO"].fillna("").str.strip()
    meses = set(df["MES"])
    invalidos = sorted(mes for mes in meses if mes not in MESES_VALIDOS)
    if invalidos:
        sys.exit(f"Valores MES no válidos: {invalidos}")
    if not meses:
        sys.exit("Los archivos no contienen ningún mes válido")

    anios = set(df["PERIODO"].str[:4]) - {""}
    if anios != {str(anio)}:
        sys.exit(f"PERIODO contiene años {sorted(anios)}, se esperaba {anio}")
    periodo_mensual = df["PERIODO"].str[:6]
    esperado_mensual = str(anio) + df["MES"]
    filas_inconsistentes = periodo_mensual.ne(esperado_mensual)
    if filas_inconsistentes.any():
        ejemplos = df.loc[filas_inconsistentes, ["PERIODO", "MES"]].head(5)
        sys.exit(
            "PERIODO no corresponde al año/mes de la fila: "
            f"{ejemplos.to_dict(orient='records')}"
        )

    fuentes_por_mes = {}
    for ruta, meses_archivo in meses_por_archivo:
        for mes in meses_archivo:
            fuentes_por_mes.setdefault(mes, []).append(ruta)
    duplicados = {
        mes: rutas for mes, rutas in fuentes_por_mes.items() if len(rutas) > 1
    }
    if duplicados:
        detalle = "; ".join(
            f"{mes}: {[ruta.as_posix() for ruta in rutas]}"
            for mes, rutas in sorted(duplicados.items())
        )
        sys.exit(f"Hay varios archivos de Ocupados para el mismo mes: {detalle}")

    meses_ordenados = sorted(meses)
    print(f"Meses presentes: {meses_ordenados}")
    return df, meses_ordenados


def cargar_referencias(ruta):
    referencias = json.loads(ruta.read_text(encoding="utf-8"))
    requeridas = {
        "grupos_ciuo",
        "ocupaciones_por_codigo",
        "actividades_ciiu",
        "meta",
    }
    faltan = requeridas - referencias.keys()
    if faltan:
        sys.exit(f"{ruta}: faltan secciones de referencia {sorted(faltan)}")
    return referencias


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--carpeta", default="datos")
    parser.add_argument("--referencias", default="referencias_geih.json")
    parser.add_argument("--salida", default="tarifas.json")
    parser.add_argument("--min-n", type=int, default=30)
    parser.add_argument("--horas-dia", type=float, default=8)
    parser.add_argument("--dias-mes", type=float, default=20)
    parser.add_argument("--smmlv", type=int, default=1423500)
    parser.add_argument("--anio", type=int, default=2025)
    args = parser.parse_args()

    if args.min_n < 1:
        parser.error("--min-n debe ser al menos 1")
    if not 0 < args.horas_dia <= 24:
        parser.error("--horas-dia debe estar entre 0 y 24")
    if not 0 < args.dias_mes <= 31:
        parser.error("--dias-mes debe estar entre 0 y 31")

    referencias = cargar_referencias(Path(args.referencias))
    df, meses_incluidos = leer_ocupados(Path(args.carpeta), args.anio)
    periodo_completo = meses_incluidos == sorted(MESES_VALIDOS)
    etiqueta_periodo = describir_periodo(meses_incluidos, args.anio)
    df["OFICIO_C8"] = df["OFICIO_C8"].fillna("").str.strip().replace("", "0000")
    df["RAMA2D_R4"] = df["RAMA2D_R4"].fillna("").str.strip().replace("", "00")
    df["ing"] = num(df["INGLABO"])
    df["hs"] = num(df["P6800"])
    df["w"] = num(df["FEX_C18"])

    cuenta_propia = df[df["P6430"] == "4"].copy()
    valido = (
        np.isfinite(cuenta_propia["ing"])
        & np.isfinite(cuenta_propia["hs"])
        & np.isfinite(cuenta_propia["w"])
        & (cuenta_propia["ing"] > 0)
        & (cuenta_propia["hs"] > 0)
        & (cuenta_propia["w"] > 0)
    )
    cuenta_propia["valido"] = valido
    validos = cuenta_propia[cuenta_propia["valido"]].copy()
    validos["hora_sin_redondear"] = validos["ing"] / (
        validos["hs"] * SEMANAS_POR_MES
    )
    print(
        "Cuenta propia con ingreso, horas y factor válidos: "
        f"{len(validos):,}"
    )

    cuenta_por_ocupacion = cuenta_propia.groupby("OFICIO_C8", sort=True)
    cuenta_clasificada = cuenta_propia[cuenta_propia["OFICIO_C8"] != "0000"]
    grupos_cuenta = cuenta_clasificada.groupby(
        cuenta_clasificada["OFICIO_C8"].str[0], sort=True
    )
    actividades_cuenta = cuenta_propia.groupby("RAMA2D_R4", sort=True)
    grupos_validos = validos.groupby(["OFICIO_C8", "RAMA2D_R4"], sort=True)
    validos["seccion_ciiu"] = validos["RAMA2D_R4"].map(
        {
            codigo: (
                referencias["actividades_ciiu"].get(codigo, {}).get("seccion_ciiu")
                or "00"
            )
            for codigo in validos["RAMA2D_R4"].unique()
        }
    )
    validos_clasificados = validos[validos["OFICIO_C8"] != "0000"].assign(
        gran_grupo=lambda registros: registros["OFICIO_C8"].str[0]
    )
    grupos_validos_por_ocupacion = validos.groupby("OFICIO_C8", sort=True)
    grupos_validos_por_gran_grupo_sector = validos_clasificados.groupby(
        ["gran_grupo", "seccion_ciiu"], sort=True
    )
    combinaciones = cuenta_propia.groupby(
        ["OFICIO_C8", "RAMA2D_R4"], sort=True
    )

    fecha = date.today().isoformat()
    grupos_ocupacionales = []
    for codigo in sorted(set(cuenta_clasificada["OFICIO_C8"].str[0]) - {""}):
        grupos_ocupacionales.append(
            {
                "id": f"ciuo-grupo-{codigo}",
                "codigo": codigo,
                "nombre": referencias["grupos_ciuo"].get(
                    codigo, f"Gran grupo CIUO {codigo}"
                ),
                "fuente_nombre": (
                    "CUOC 2025, nivel de gran grupo; etiqueta por código "
                    "coincidente, concordancia CIUO-CUOC no verificada"
                ),
                "n_registros_cuenta_propia": int(len(grupos_cuenta.get_group(codigo))),
            }
        )
    if "0000" in cuenta_por_ocupacion.groups:
        grupos_ocupacionales.append(
            {
                "id": "ciuo-no-clasificado",
                "codigo": "0000",
                "nombre": "Ocupación no clasificada",
                "fuente_nombre": "Código no clasificable",
                "n_registros_cuenta_propia": int(
                    len(cuenta_por_ocupacion.get_group("0000"))
                )
                if "0000" in cuenta_por_ocupacion.groups
                else 0,
            }
        )

    sectores_por_codigo = {}
    for codigo in cuenta_propia["RAMA2D_R4"].unique():
        actividad = referencias["actividades_ciiu"].get(
            codigo,
            {
                "nombre": f"Actividad CIIU {codigo} sin etiqueta de referencia",
                "seccion_ciiu": None,
                "sector_economico": "Sin clasificar",
            },
        )
        section_id = actividad["seccion_ciiu"] or "00"
        sectores_por_codigo[section_id] = actividad["sector_economico"]

    sectores_economicos = [
        {
            "id": f"ciiu-seccion-{codigo.lower()}",
            "codigo_ciiu_seccion": codigo,
            "nombre": nombre,
        }
        for codigo, nombre in sorted(sectores_por_codigo.items())
    ]
    actividades_economicas = []
    for codigo in sorted(actividades_cuenta.groups):
        referencia = referencias["actividades_ciiu"].get(
            codigo,
            {
                "nombre": f"Actividad CIIU {codigo} sin etiqueta de referencia",
                "seccion_ciiu": None,
                "sector_economico": "Sin clasificar",
            },
        )
        actividades_economicas.append(
            {
                "id": f"ciiu-{codigo}",
                "codigo_ciiu": codigo,
                "nombre": referencia["nombre"],
                "seccion_ciiu": referencia["seccion_ciiu"] or "00",
                "sector_economico_id": (
                    f"ciiu-seccion-{(referencia['seccion_ciiu'] or '00').lower()}"
                ),
                "n_registros_cuenta_propia": int(
                    len(actividades_cuenta.get_group(codigo))
                ),
                "n_registros_validos": int(
                    len(validos[validos["RAMA2D_R4"] == codigo])
                ),
            }
        )

    ocupaciones = []
    for codigo in sorted(cuenta_por_ocupacion.groups):
        gran_grupo = codigo[0] if codigo != "0000" else "0"
        nombre = referencias["ocupaciones_por_codigo"].get(codigo)
        no_clasificada = codigo == "0000"
        if no_clasificada:
            nombre = "Ocupación no clasificada"
        elif nombre is None:
            nombre = f"Ocupación CIUO-08 A.C. {codigo} (nombre por verificar)"
        ocupaciones.append(
            {
                "id": f"ciuo-{codigo}",
                "codigo_ciuo08_ac": codigo,
                "nombre": nombre,
                "grupo_ciuo_id": (
                    "ciuo-no-clasificado"
                    if no_clasificada
                    else f"ciuo-grupo-{gran_grupo}"
                ),
                "fuente_nombre": (
                    "Código no clasificable"
                    if no_clasificada
                    else (
                        "CUOC 2025, código coincidente; concordancia CIUO-CUOC "
                        "no verificada"
                        if codigo in referencias["ocupaciones_por_codigo"]
                        else "Denominación pendiente de verificar"
                    )
                ),
                "n_registros_cuenta_propia": int(
                    len(cuenta_por_ocupacion.get_group(codigo))
                ),
                "n_registros_validos": int(
                    len(validos[validos["OFICIO_C8"] == codigo])
                ),
                "estado": "pendiente" if no_clasificada or codigo not in referencias[
                    "ocupaciones_por_codigo"
                ] else "referencia",
            }
        )

    tarifas = []
    reporte_estados = {"disponible": 0, "muestra_insuficiente": 0, "sin_clasificar": 0}
    for (codigo_ocupacion, codigo_actividad), registros in combinaciones:
        n = int(registros["valido"].sum())
        no_clasificada = codigo_ocupacion == "0000"
        tarifa = {
            "id": f"ciuo-{codigo_ocupacion}-ciiu-{codigo_actividad}-{args.anio}",
            "ocupacion_id": f"ciuo-{codigo_ocupacion}",
            "actividad_economica_id": f"ciiu-{codigo_actividad}",
            "n_muestra": n,
            "hora": None,
            "dia": None,
            "mes": None,
            "fuente": {
                "tipo": "geih_cuenta_propia",
                "periodo": str(args.anio),
                "meses_incluidos": meses_incluidos,
                "metodo": (
                    "Percentiles ponderados por FEX_C18 del ingreso laboral "
                    "por hora; hora = INGLABO / (P6800 x 52/12); dia y mes "
                    "derivados de horas_dia y dias_facturables_mes."
                ),
                "verificado_en": fecha,
            },
        }
        if no_clasificada:
            tarifa["estado"] = "sin_clasificar"
        elif n < args.min_n:
            tarifa["estado"] = "muestra_insuficiente"
        else:
            observaciones = grupos_validos.get_group(
                (codigo_ocupacion, codigo_actividad)
            )
            percentiles = {
                q: percentil_ponderado(
                    observaciones["hora_sin_redondear"], observaciones["w"], q
                )
                for q in (0.25, 0.50, 0.75)
            }
            tarifa["hora"] = {
                campo: redondear(percentiles[q], 100)
                for campo, q in (("p25", 0.25), ("p50", 0.50), ("p75", 0.75))
            }
            tarifa["dia"] = {
                campo: redondear(percentiles[q] * args.horas_dia, 1000)
                for campo, q in (("p25", 0.25), ("p50", 0.50), ("p75", 0.75))
            }
            tarifa["mes"] = {
                campo: redondear(
                    percentiles[q] * args.horas_dia * args.dias_mes, 10000
                )
                for campo, q in (("p25", 0.25), ("p50", 0.50), ("p75", 0.75))
            }
            tarifa["estado"] = "disponible"
        reporte_estados[tarifa["estado"]] += 1
        tarifas.append(tarifa)

    out = {
        "$schema": "./schema.json",
        "meta": {
            "version": date.today().strftime("%Y-%m"),
            "generado_en": fecha,
            "moneda": "COP",
            "anio_datos": int(args.anio),
            "periodo_cubierto": {
                "descripcion": etiqueta_periodo,
                "meses_incluidos": meses_incluidos,
                "completo": periodo_completo,
                "estado": "completo" if periodo_completo else "provisional",
            },
            "clasificacion_ocupacional": "CIUO-08 A.C. (OFICIO_C8, GEIH)",
            "clasificacion_actividad": (
                "CIIU Rev. 4 A.C., división de dos dígitos (RAMA2D_R4)"
            ),
            "referencia_nombres_ocupacionales": referencias["meta"][
                "ocupaciones_fuente"
            ],
            "categorias_tarifa": {
                "p25": "Tarifa baja observada (percentil 25)",
                "p50": "Tarifa de referencia (mediana, percentil 50)",
                "p75": "Tarifa alta observada (percentil 75)",
                "nota": (
                    "Son puntos de la distribución de tarifas, no niveles "
                    "junior, medio o senior."
                ),
            },
            "parametros": {
                "smmlv": args.smmlv,
                "anio_smmlv": int(args.anio),
                "horas_dia": args.horas_dia,
                "dias_facturables_mes": args.dias_mes,
                "min_n_sin_ponderar": args.min_n,
                "nota_smmlv": "Se guarda como metadata; no interviene en las tarifas.",
            },
        },
        "sectores_economicos": sectores_economicos,
        "actividades_economicas": actividades_economicas,
        "grupos_ocupacionales": grupos_ocupacionales,
        "ocupaciones": ocupaciones,
        "tarifas": tarifas,
    }
    Path(args.salida).write_text(
        json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print("\nResumen:")
    print(
        f"  periodo: {etiqueta_periodo} "
        f"({'completo' if periodo_completo else 'provisional'})"
    )
    print(
        f"  sectores económicos: {len(sectores_economicos)}; "
        f"actividades CIIU: {len(actividades_economicas)}"
    )
    print(
        f"  grupos ocupacionales: {len(grupos_ocupacionales)}; "
        f"ocupaciones observadas: {len(ocupaciones)}"
    )
    print(
        f"  combinaciones ocupación-actividad: {len(tarifas)} "
        f"({reporte_estados['disponible']} con tarifa, "
        f"{reporte_estados['muestra_insuficiente']} con muestra insuficiente, "
        f"{reporte_estados['sin_clasificar']} sin clasificar)"
    )
    print(f"\nEscrito {args.salida}.")


if __name__ == "__main__":
    main()
