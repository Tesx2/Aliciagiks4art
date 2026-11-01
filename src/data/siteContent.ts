import { FEATURED_PROJECTS } from './portfolioData';

export type EditableSection = 'marquee' | 'work' | 'services' | 'about' | 'contact';

export interface SiteContent {
  profile: {
    name: string;
    handle: string;
    email: string;
    whatsapp: string;
    instagram: string;
    availability: string;
    logoSrc: string;
    logoAlt: string;
  };
  navigation: { work: string; services: string; about: string; contact: string; cta: string };
  hero: {
    eyebrow: string;
    headline: string;
    accent: string;
    ending: string;
    intro: string;
    specialties: string[];
    workCta: string;
    contactCta: string;
    portraitSrc: string;
    portraitAlt: string;
    reelSrc: string;
    reelLabel: string;
    reelTitle: string;
  };
  marquee: { items: string[] };
  work: {
    eyebrow: string;
    heading: string;
    intro: string;
    searchPlaceholder: string;
    categories: Array<{ id: string; label: string }>;
    featuredProjects: Array<{ id: string; title: string; category: string; categoryLabel: string; alt: string; year: string; brief: string; visible: boolean }>;
  };
  about: {
    eyebrow: string;
    heading: string;
    lead: string;
    paragraphs: string[];
    location: string;
    disciplines: string;
    highlights: Array<{ title: string; description: string }>;
  };
  services: { eyebrow: string; heading: string; intro: string; items: Array<{ id: string; title: string; description: string }> };
  contact: {
    eyebrow: string;
    heading: string;
    intro: string;
    formHeading: string;
    formIntro: string;
    serviceOptions: string[];
    timelineOptions: string[];
  };
  footer: { tagline: string };
  seo: { title: string; description: string };
  page: { sectionOrder: EditableSection[]; hiddenSections: EditableSection[] };
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  profile: {
    name: 'Mary Alicia',
    handle: 'Aliciagiks4art',
    email: 'aliciagiks@gmail.com',
    whatsapp: '+254768795272',
    instagram: 'geeks4drisony',
    availability: 'Commissions open',
    logoSrc: '',
    logoAlt: 'Mary Alicia portfolio logo',
  },
  navigation: { work: 'Work', services: 'Services', about: 'About', contact: 'Contact', cta: 'Get in touch' },
  hero: {
    eyebrow: 'Graphic designer · Animator · Artist',
    headline: 'Creative ideas, made visible in',
    accent: 'motion',
    ending: 'and print.',
    intro: 'I create graphic design, animation, motion work, and digital experiences with a focus on clear ideas and memorable visuals.',
    specialties: ['Graphic Design', 'Branding & Identity', 'Animation', 'Illustration', 'Digital Experiences'],
    workCta: 'View selected work',
    contactCta: 'Start a project',
    portraitSrc: 'assets/profile-image/mary-alicia.jpg',
    portraitAlt: 'Mary Alicia, graphic designer and motion artist',
    reelSrc: 'geeks4drisony/motion graphic/inspiration.mp4',
    reelLabel: 'Featured motion reel',
    reelTitle: 'Inspiration & Brand Motion',
  },
  marquee: { items: ['Graphic Design', 'Motion Graphics', 'Animation', 'Illustration', 'Digital Experiences'] },
  work: {
    eyebrow: 'Selected works',
    heading: 'Work across image, print, and motion',
    intro: 'Explore graphic design, animation, illustration, photography, and digital art. Open a project to see it up close.',
    searchPlaceholder: 'Search projects...',
    categories: [
      { id: 'all', label: 'All works' },
      { id: 'motion graphic', label: 'Motion graphics' },
      { id: 'logo design', label: 'Brand & logo' },
      { id: 'posters', label: 'Posters & print' },
      { id: 'drawing', label: 'Drawing & art' },
      { id: 'photography', label: 'Photography' },
      { id: '3D', label: '3D art' },
    ],
    featuredProjects: FEATURED_PROJECTS.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      categoryLabel: item.categoryLabel,
      alt: item.alt || item.title,
      year: item.year ? String(item.year) : '',
      brief: item.brief || '',
      visible: true,
    })),
  },
  about: {
    eyebrow: 'Artist & storyteller',
    heading: 'About Mary Alicia',
    lead: 'I bring ideas to life through image, type, and motion.',
    paragraphs: [
      'I’m Mary Alicia, a graphic designer, animator, and artist. This portfolio brings together selected design work, animation, motion pieces, illustration, and digital experiments.',
      'I enjoy taking a project from its first idea to a finished visual, making work that feels thoughtful, distinctive, and easy to connect with.',
    ],
    location: 'Remote',
    disciplines: 'Visual storytelling & motion',
    highlights: [
      { title: 'Motion & animation', description: 'Logo animation, short-form motion, and moving-image experiments.' },
      { title: 'Graphic design', description: 'Visual identities, campaign graphics, posters, and print pieces.' },
    ],
  },
  services: {
    eyebrow: 'Disciplines & capabilities',
    heading: 'What I can help with',
    intro: 'Graphic design, animation, motion design, and visual direction for digital experiences.',
    items: [
      { id: 'branding', title: 'Branding & Visual Identity', description: 'Visual identity and graphic design for brands, from the first concept through a cohesive visual direction.' },
      { id: 'motion', title: 'Motion Graphics & Animation', description: 'Moving-image work and animation for visual stories, brand moments, and digital content.' },
      { id: 'graphic-design', title: 'Graphic & Campaign Design', description: 'Graphic design for campaigns, promotional artwork, and print.' },
      { id: 'digital', title: 'Digital Experiences', description: 'Visual design and motion-led ideas for websites and digital experiences.' },
    ],
  },
  contact: {
    eyebrow: 'Get in touch',
    heading: 'Let’s build something bold',
    intro: 'Tell me about your project, campaign, or motion vision. The form prepares an email for you to review and send.',
    formHeading: 'Project inquiry',
    formIntro: 'Share a few details and your email app will open with a ready-to-send project brief.',
    serviceOptions: ['Motion Graphics & Animation', 'Branding & Visual Identity', 'Graphic & Campaign Design', 'Digital Experiences'],
    timelineOptions: ['Urgent (under 2 weeks)', 'Within 2–4 weeks', 'Next 1–2 months', 'Flexible / Ongoing'],
  },
  footer: { tagline: 'Visual storytelling & motion design.' },
  seo: {
    title: 'Mary Alicia — Visual Storyteller & Creative Portfolio',
    description: 'Mary Alicia (Aliciagiks4art) — Graphic design, animation, motion work, and digital experiences.',
  },
  page: {
    sectionOrder: ['marquee', 'work', 'services', 'about', 'contact'],
    hiddenSections: [],
  },
};

export function mergeSiteContent(value: unknown): SiteContent {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return DEFAULT_SITE_CONTENT;
  const input = value as Partial<SiteContent>;
  const mergeObject = <T extends object>(defaults: T, candidate: unknown): T =>
    candidate && typeof candidate === 'object' && !Array.isArray(candidate)
      ? { ...defaults, ...(candidate as Partial<T>) }
      : defaults;
  const merged = {
    ...DEFAULT_SITE_CONTENT,
    profile: mergeObject(DEFAULT_SITE_CONTENT.profile, input.profile),
    navigation: mergeObject(DEFAULT_SITE_CONTENT.navigation, input.navigation),
    hero: mergeObject(DEFAULT_SITE_CONTENT.hero, input.hero),
    marquee: mergeObject(DEFAULT_SITE_CONTENT.marquee, input.marquee),
    work: mergeObject(DEFAULT_SITE_CONTENT.work, input.work),
    about: mergeObject(DEFAULT_SITE_CONTENT.about, input.about),
    services: mergeObject(DEFAULT_SITE_CONTENT.services, input.services),
    contact: mergeObject(DEFAULT_SITE_CONTENT.contact, input.contact),
    footer: mergeObject(DEFAULT_SITE_CONTENT.footer, input.footer),
    seo: mergeObject(DEFAULT_SITE_CONTENT.seo, input.seo),
    page: mergeObject(DEFAULT_SITE_CONTENT.page, input.page),
  };
  return {
    ...merged,
    hero: {
      ...merged.hero,
      specialties: Array.isArray(merged.hero.specialties) ? merged.hero.specialties : DEFAULT_SITE_CONTENT.hero.specialties,
    },
    marquee: {
      ...merged.marquee,
      items: Array.isArray(merged.marquee.items) ? merged.marquee.items : DEFAULT_SITE_CONTENT.marquee.items,
    },
    work: {
      ...merged.work,
      categories: Array.isArray(merged.work.categories) ? merged.work.categories : DEFAULT_SITE_CONTENT.work.categories,
      featuredProjects: Array.isArray(merged.work.featuredProjects) ? merged.work.featuredProjects : DEFAULT_SITE_CONTENT.work.featuredProjects,
    },
    about: {
      ...merged.about,
      paragraphs: Array.isArray(merged.about.paragraphs) ? merged.about.paragraphs : DEFAULT_SITE_CONTENT.about.paragraphs,
      highlights: Array.isArray(merged.about.highlights) ? merged.about.highlights : DEFAULT_SITE_CONTENT.about.highlights,
    },
    services: {
      ...merged.services,
      items: Array.isArray(merged.services.items) ? merged.services.items : DEFAULT_SITE_CONTENT.services.items,
    },
    contact: {
      ...merged.contact,
      serviceOptions: Array.isArray(merged.contact.serviceOptions) ? merged.contact.serviceOptions : DEFAULT_SITE_CONTENT.contact.serviceOptions,
      timelineOptions: Array.isArray(merged.contact.timelineOptions) ? merged.contact.timelineOptions : DEFAULT_SITE_CONTENT.contact.timelineOptions,
    },
    page: {
      sectionOrder: Array.isArray(merged.page.sectionOrder) ? merged.page.sectionOrder : DEFAULT_SITE_CONTENT.page.sectionOrder,
      hiddenSections: Array.isArray(merged.page.hiddenSections) ? merged.page.hiddenSections : DEFAULT_SITE_CONTENT.page.hiddenSections,
    },
  };
}
