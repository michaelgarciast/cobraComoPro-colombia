<script lang="ts">
	import {
		HeroSection,
		LaborInfoSection,
		OfferingsSection,
		SocialSecurityTeaser,
		FinalCtaSection
	} from '$lib/features/home/ui';
	import { offerings } from '$lib/features/home';
	import { TricolorBar } from '$lib/shared/ui/components';
</script>

<div>
	<HeroSection />
	<LaborInfoSection />
	<TricolorBar class="h-px opacity-30" />
	<OfferingsSection {offerings} />
	<TricolorBar class="h-px opacity-30" />
	<SocialSecurityTeaser />
	<FinalCtaSection />
</div>
