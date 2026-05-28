<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/shared/ui/components';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
	<div class="mb-8 text-9xl font-bold text-[#ffd200] font-[Montserrat]">
		{page.status}
	</div>

	<h1 class="mb-4 text-3xl font-bold text-white">
		{page.error?.message || 'Algo salió mal'}
	</h1>

	<p class="mb-8 max-w-md text-lg text-[#e0e3e5]/70">
		{page.status === 404
			? 'La página que buscas no existe.'
			: 'Lo sentimos, ha ocurrido un error inesperado.'}
	</p>

	<Button href="/" variant="primary" size="lg">
		Volver al inicio
	</Button>
</div>
