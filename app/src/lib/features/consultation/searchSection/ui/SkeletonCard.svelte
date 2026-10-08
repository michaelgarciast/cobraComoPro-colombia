<script lang="ts">
	import Card from '$lib/shared/ui/components/Card.svelte';
</script>

<Card variant="skeleton" padding="sm">
	<div class="mb-4 flex items-start justify-between gap-3">
		<div class="flex-1">
			<div class="mb-2 h-6 w-20 rounded-full bg-[#191c1e]"></div>
			<div class="h-3 w-24 rounded bg-[#191c1e]"></div>
		</div>
	</div>
	<div class="mb-2 h-5 w-full rounded bg-[#191c1e]"></div>
	<div class="mb-4 h-4 w-3/4 rounded bg-[#191c1e]"></div>
	<div class="my-4 h-px bg-[#191c1e]"></div>
	<div class="space-y-3">
		<div class="flex justify-between">
			<div class="h-3 w-20 rounded bg-[#191c1e]"></div>
			<div class="h-4 w-24 rounded bg-[#191c1e]"></div>
		</div>
		<div class="flex justify-between">
			<div class="h-3 w-16 rounded bg-[#191c1e]"></div>
			<div class="h-3 w-16 rounded bg-[#191c1e]"></div>
		</div>
	</div>
</Card>
