<script lang="ts">
	import { resolve } from '$app/paths';

	const currentYear = new Date().getFullYear();
</script>

<footer class="border-t border-white/10 bg-[#101415]">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Brand Section -->
			<div class="space-y-4">
				<a href={resolve('/')} class="inline-flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd200] text-sm font-bold text-[#3b2f00]">
						CC
					</div>
					<div>
						<p class="text-base font-bold text-white font-[Montserrat]">CobraComoPro</p>
						<p class="text-xs font-medium uppercase tracking-wider text-[#999077]">
							Colombia
						</p>
					</div>
				</a>
				<p class="max-w-md text-sm leading-relaxed text-[#e0e3e5]/70">
					Herramienta profesional para freelancers en Colombia. Calcula tarifas justas y gestiona tus cobros con confianza.
				</p>
			</div>

			<!-- Links Section -->
			<div class="flex flex-col gap-6 lg:items-end">
				</div>
		</div>

		<!-- Bottom Section -->
		<div class="mt-8 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
			<p class="text-[#999077]"> {currentYear} CobraComoPro. Todos los derechos reservados.</p>
			<div class="flex flex-wrap items-center gap-4">
				<a href="mailto:hola@cobracomopro.com" class="text-[#e0e3e5]/70 transition-colors hover:text-white">Contacto</a>
				<span class="text-[#4d4632]">|</span>
				<button type="button" class="text-[#e0e3e5]/70 transition-colors hover:text-white">Términos</button>
				<span class="text-[#4d4632]">|</span>
				<button type="button" class="text-[#e0e3e5]/70 transition-colors hover:text-white">Privacidad</button>
			</div>
		</div>
	</div>
</footer>
