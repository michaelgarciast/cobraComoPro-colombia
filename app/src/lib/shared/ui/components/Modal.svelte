<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		open = false,
		title = '',
		className = '',
		onclose,
		children
	}: {
		open?: boolean;
		title?: string;
		className?: string;
		onclose: () => void;
		children: Snippet;
	} = $props();

	let dialogRef: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (open && dialogRef && !dialogRef.open) {
			dialogRef.showModal();
		} else if (!open && dialogRef && dialogRef.open) {
			dialogRef.close();
		}
	});

	function handleClose() {
		onclose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === dialogRef) {
			dialogRef?.close();
			onclose();
		}
	}
</script>

<dialog
	bind:this={dialogRef}
	class="w-full rounded-2xl border border-white/10 bg-[#1d2022] shadow-2xl p-0 {className || 'max-w-lg'}"
	onclose={handleClose}
	onclick={handleBackdropClick}
>
	<div class="p-6">
		<div class="flex items-center justify-between mb-5">
			{#if title}
				<h3 class="text-lg font-semibold text-white font-[Montserrat]">{title}</h3>
			{:else}
				<div></div>
			{/if}
			<button
				type="button"
				onclick={() => dialogRef?.close()}
				class="text-[#999077] hover:text-white transition-colors"
				aria-label="Cerrar modal"
			>
				<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
		</div>
		{@render children()}
	</div>
</dialog>

<style>
	dialog {
		margin: auto;
		position: fixed;
		inset: 0;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.6);
		backdrop-filter: blur(4px);
	}
	dialog[open] {
		animation: fade-in 0.2s ease-out;
	}
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
