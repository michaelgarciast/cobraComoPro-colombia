export type KnownRoute = '/' | '/consultar' | '/calculadora-freelance' | '/cotizar-aportes';

export type NavItem = {
	label: string;
	href: KnownRoute;
	icon: 'home' | 'search' | 'calculator' | 'shield';
};
