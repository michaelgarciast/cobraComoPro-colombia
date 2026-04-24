<script lang="ts">
	interface Props {
		label?: string;
		amount: string;
		currency?: string;
		details?: string;
	}

	let {
		label = 'Tarifa sugerida',
		amount,
		currency = 'COP',
		details
	}: Props = $props();
</script>

<div class="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
	<p class="text-sm text-slate-300">{label}</p>
	<div class="mt-1 flex items-baseline gap-2">
		<span class="text-4xl font-semibold text-yellow-300">{amount}</span>
		<span class="text-xs text-slate-400">{currency}{#if details} · {details}{/if}</span>
	</div>
</div>
