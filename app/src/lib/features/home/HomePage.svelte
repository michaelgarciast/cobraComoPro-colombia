<script lang="ts">
	import { HeroSection, LaborInfoSection, OfferingsSection, SocialSecurityTeaser } from '$lib/features/home/ui';
	import { offerings } from '$lib/features/home';
</script>

<div>
	<HeroSection />
	<LaborInfoSection />
	<SocialSecurityTeaser />
	<OfferingsSection {offerings} />
</div>
