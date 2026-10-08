<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<a href={resolve('/')} class="group flex items-center gap-3 transition-opacity hover:opacity-90">
	<div class="relative">
		<div
			class="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffd200] text-sm font-black tracking-wider text-[#3b2f00] uppercase shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
		>
			CC
		</div>
		<span
			class="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-[#ffd200]/40 bg-[#ffd200]/40 blur-sm"
		></span>
	</div>
	<div class="flex flex-col">
		<span class="font-[Montserrat] text-lg font-semibold text-white">CobraComoPro</span>
		<span class="text-[11px] font-medium tracking-[0.3em] text-[#999077] uppercase">
			Freelance Ops · CO
		</span>
	</div>
</a>
