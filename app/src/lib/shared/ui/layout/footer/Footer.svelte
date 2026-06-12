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
		<div class="mt-8 border-t border-white/10 pt-8 text-center text-sm">
			<p class="text-[#999077]">{currentYear} CobraComoPro. Todos los derechos reservados.</p>
		</div>
	</div>
</footer>
