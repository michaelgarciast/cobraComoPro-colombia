<script lang="ts">
	import { Button } from '$lib/shared/ui/components';

	function handleDownload() {
		window.print();
	}
</script>

<Button as="button" variant="primary" size="md" class="w-full print:hidden" onclick={handleDownload}>
	Descargar / Imprimir cotización
</Button>
