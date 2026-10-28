<script lang="ts">
	interface Props {
		class?: string;
		animated?: boolean;
	}

	let { class: className = '', animated = false }: Props = $props();
</script>

<!-- Franja tricolor de la bandera de Colombia: amarillo 50%, azul 25%, rojo 25% -->
<div
	aria-hidden="true"
	class="tricolor-bar pointer-events-none {animated ? 'tricolor-animated' : ''} {className}"
></div>

<style>
	.tricolor-bar {
		background: linear-gradient(
			90deg,
			#ffd200 0%,
			#ecc200 25%,
			#ffd200 50%,
			#1e4fc2 50%,
			#003893 62.5%,
			#1e4fc2 75%,
			#d2010f 75%,
			#8b010a 87.5%,
			#d2010f 100%
		);
		background-size: 200% 100%;
	}

	.tricolor-animated {
		animation: tricolor-flow 14s linear infinite;
	}

	@keyframes tricolor-flow {
		0% {
			background-position: 0% 0;
		}
		100% {
			background-position: 200% 0;
		}
	}
</style>
