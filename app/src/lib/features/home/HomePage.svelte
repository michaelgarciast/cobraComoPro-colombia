<script lang="ts">
	import { HeroSection, LaborInfoSection, OfferingsSection} from '$lib/features/home/ui';
	import { offerings } from '$lib/features/home';
</script>

<div class="bg-slate-950">
	<HeroSection />
	<LaborInfoSection />
	<OfferingsSection {offerings} />

</div>
