<script lang="ts">
	interface Props {
		label: string;
		value: string;
	}

	let { label, value }: Props = $props();
</script>

<div class="glow-ring rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-dark-sm transition-transform duration-300 hover:-translate-y-1">
	<dt class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{label}</dt>
	<dd class="mt-3 text-3xl font-semibold text-white">{value}</dd>
</div>
