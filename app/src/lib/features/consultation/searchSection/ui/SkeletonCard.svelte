<script lang="ts">
	import Card from '$lib/shared/ui/components/Card.svelte';
</script>

<Card variant="skeleton" padding="sm">
	<div class="flex items-start justify-between gap-3 mb-4">
		<div class="flex-1">
			<div class="h-6 w-20 bg-[#191c1e] rounded-full mb-2"></div>
			<div class="h-3 w-24 bg-[#191c1e] rounded"></div>
		</div>
	</div>
	<div class="h-5 w-full bg-[#191c1e] rounded mb-2"></div>
	<div class="h-4 w-3/4 bg-[#191c1e] rounded mb-4"></div>
	<div class="h-px bg-[#191c1e] my-4"></div>
	<div class="space-y-3">
		<div class="flex justify-between">
			<div class="h-3 w-20 bg-[#191c1e] rounded"></div>
			<div class="h-4 w-24 bg-[#191c1e] rounded"></div>
		</div>
		<div class="flex justify-between">
			<div class="h-3 w-16 bg-[#191c1e] rounded"></div>
			<div class="h-3 w-16 bg-[#191c1e] rounded"></div>
		</div>
	</div>
</Card>
