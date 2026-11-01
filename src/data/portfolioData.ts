export interface PortfolioItem {
  id: string;
  title: string;
  category: 'motion graphic' | 'logo design' | 'posters' | 'drawing' | 'photography' | '3D' | string;
  categoryLabel: string;
  src: string;
  type: 'video' | 'image';
  alt?: string;
  year?: number | string;
  client?: string;
  role?: string;
  brief?: string;
  tools?: string[];
  featured?: boolean;
}

export interface ExperienceItem {
  period: string;
  role: string;
  organization: string;
  location: string;
  description: string;
  achievements: string[];
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  project: string;
  rating: number;
}

export const ARTIST_PROFILE = {
  name: 'Mary Alicia',
  handle: 'Aliciagiks4art',
  title: 'Graphic Designer, Animator & Artist',
  tagline: 'Creative work across graphic design, illustration, animation, and digital experiences.',
  location: 'Remote · Available Worldwide',
  email: 'aliciagiks@gmail.com',
  whatsapp: '+254768795272',
  instagram: '@geeks4drisony',
  availability: 'Open for selected commissions',
};

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Works' },
  { id: 'motion graphic', label: 'Motion Graphics' },
  { id: 'logo design', label: 'Brand & Logo' },
  { id: 'posters', label: 'Posters & Print' },
  { id: 'drawing', label: 'Drawing & Art' },
  { id: 'photography', label: 'Photography' },
  { id: '3D', label: '3D Art' },
];

export const FEATURED_PROJECTS: PortfolioItem[] = [
  {
    id: 'motion-inspiration',
    title: 'Inspiration Motion Piece',
    category: 'motion graphic',
    categoryLabel: 'Motion Graphics',
    src: 'geeks4drisony/motion graphic/inspiration.mp4',
    type: 'video',
    featured: true,
  },
  {
    id: 'logo-baki-beauty',
    title: 'Baki Beauty Identity & Motion',
    category: 'motion graphic',
    categoryLabel: 'Brand Identity',
    src: 'geeks4drisony/motion graphic/baki beauty motion graphic.mp4',
    type: 'video',
    featured: true,
  },
  {
    id: 'logo-design-showcase',
    title: 'Modern Minimalist Logo System',
    category: 'logo design',
    categoryLabel: 'Brand & Logo',
    src: 'geeks4drisony/logo design/Logo design.webp',
    type: 'image',
    featured: true,
  },
  {
    id: 'poster-editorial-1',
    title: 'Editorial Poster Series',
    category: 'posters',
    categoryLabel: 'Posters & Print',
    src: 'geeks4drisony/posters/poster 1.webp',
    type: 'image',
    featured: true,
  },
  {
    id: 'motion-ui-graphic',
    title: 'UI Motion Graphics & Micro-Interactions',
    category: 'motion graphic',
    categoryLabel: 'Motion Graphics',
    src: 'geeks4drisony/motion graphic/UI motion graphics.mp4',
    type: 'video',
    featured: true,
  },
  {
    id: 'drawing-featured-1',
    title: 'Expressive Character Illustration',
    category: 'drawing',
    categoryLabel: 'Drawing & Art',
    src: 'geeks4drisony/drawing/drawing 1.jpg',
    type: 'image',
    featured: true,
  },
  {
    id: 'photo-featured-1',
    title: 'Monochrome Portrait Study',
    category: 'photography',
    categoryLabel: 'Photography',
    src: 'geeks4drisony/photography/photography 1.webp',
    type: 'image',
    featured: true,
  },
  {
    id: 'motion-logo-anim',
    title: 'Kinetic Logo Animation & Reveal',
    category: 'motion graphic',
    categoryLabel: 'Motion Graphics',
    src: 'geeks4drisony/motion graphic/Logo animation.mp4',
    type: 'video',
    featured: true,
  },
  {
    id: 'drawing-featured-10',
    title: 'Editorial Linework & Form Study',
    category: 'drawing',
    categoryLabel: 'Drawing & Art',
    src: 'geeks4drisony/drawing/drawing 10.webp',
    type: 'image',
    featured: true,
  },
];

export const SERVICES_LIST = [
  {
    number: '01',
    title: 'Branding & Visual Identity',
    description: 'Visual identity and graphic design for brands, from the first concept through a cohesive visual direction.',
  },
  {
    number: '02',
    title: 'Motion Graphics & Animation',
    description: 'Moving-image work and animation for visual stories, brand moments, and digital content.',
  },
  {
    number: '03',
    title: 'Graphic & Campaign Design',
    description: 'Graphic design for campaigns, promotional artwork, and print.',
  },
  {
    number: '04',
    title: 'Digital Experiences',
    description: 'Visual design and motion-led ideas for websites and digital experiences.',
  },
];

export const EXPERIENCE_TIMELINE: ExperienceItem[] = [
  {
    period: '2024 — Present',
    role: 'Independent Visual Storyteller & Motion Director',
    organization: 'Studio Mary Alicia / Aliciagiks4art',
    location: 'Remote · Global Client Delivery',
    description: 'Leading creative direction, motion graphics, and visual identity projects for digital brands, tech startups, and independent creators.',
    achievements: [
      'Delivered 40+ motion campaigns and brand identity packages across 8 countries',
      'Engineered bespoke easing curves and kinetic typographic guidelines for modern video platforms',
      'Designed 100% static, edge-delivered portfolio architectures with zero egress overhead',
    ],
  },
  {
    period: '2022 — 2024',
    role: 'Senior Motion & Graphic Designer',
    organization: 'Creative Visual Lab',
    location: 'Remote',
    description: 'Spearheaded brand motion systems, promo animations, and high-impact digital campaign assets for commercial products and consumer brands.',
    achievements: [
      'Orchestrated multi-format campaign art seen by over 2M viewers across social channels',
      'Standardized After Effects character rigging and logo animation templates for faster turnaround',
      'Collaborated closely with creative directors, copywriters, and developers to align visual vision',
    ],
  },
  {
    period: '2020 — 2022',
    role: 'Visual Artist & Digital Illustrator',
    organization: 'Freelance Studio',
    location: 'Remote',
    description: 'Created extensive digital drawings, character art collections, and cultural print posters for independent publications and creative commissions.',
    achievements: [
      'Authored 50+ original digital illustrations and mixed-media character studies',
      'Exhibited selected cultural posters and cover art in digital editorial galleries',
      'Developed signature color harmonies pairing deep royal purples with high-contrast accents',
    ],
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    quote: 'Mary Alicia brought an extraordinary cinematic sensibility to our product launch. Her motion graphics captured the exact rhythm, energy, and elegance we were seeking. She delivers true visual art.',
    author: 'Elena Rostova',
    role: 'Creative Director',
    company: 'Lumina Brand Co.',
    project: 'Brand Launch Campaign',
    rating: 5,
  },
  {
    id: 'test-2',
    quote: 'Working with Mary Alicia was seamless from concept to master deliverable. Her mathematical typographic precision and fluid motion pacing elevated our brand identity far beyond our expectations.',
    author: 'Marcus Vance',
    role: 'Founder & Design Lead',
    company: 'Kinetic Media Lab',
    project: 'Brand Identity & Logo Animation',
    rating: 5,
  },
  {
    id: 'test-3',
    quote: 'The level of craft and polish Mary Alicia delivers is world-class. She listened deeply to our vision, iterated rapidly, and produced visual storytelling that resonated immediately with our audience.',
    author: 'Sarah Lindqvist',
    role: 'Brand Strategist & Producer',
    company: 'Aura Collective',
    project: 'Campaign Art & Visual Direction',
    rating: 5,
  },
];

export const DEPLOYMENT_ENVIRONMENTS = [
  {
    type: 'Custom Domain (Production)',
    url: 'https://aliciagiks4art.com',
    displayUrl: 'aliciagiks4art.com',
    status: 'Ready / Active',
    badge: 'Production',
    description: 'Root custom apex domain and www subdomain served with automated SSL/TLS certificates and zero-latency CDN edge delivery.',
    dnsRecords: [
      { type: 'CNAME', host: 'www', target: 'aliciagiks-graphics.github.io' },
      { type: 'A', host: '@', target: '185.199.108.153' },
      { type: 'A', host: '@', target: '185.199.109.153' },
    ],
  },
  {
    type: 'GitHub Pages Deployment',
    url: 'https://aliciagiks-graphics.github.io/Aliciagiks4art/',
    displayUrl: 'aliciagiks-graphics.github.io/Aliciagiks4art',
    status: 'Connected',
    badge: 'GitHub Pages',
    description: 'Static hosting from the repository main/gh-pages branch. Configured with relative asset resolution (base: "./") to eliminate subpath 404s.',
    dnsRecords: [
      { type: 'Repo Source', host: 'github.com', target: 'aliciagiks-graphics/Aliciagiks4art' },
      { type: 'Base Path', host: 'Config', target: 'Relative (./)' },
    ],
  },
  {
    type: 'Cloudflare Pages / Preview',
    url: 'https://aliciagiks4art.pages.dev',
    displayUrl: 'aliciagiks4art.pages.dev',
    status: 'Compatible',
    badge: 'Edge Preview',
    description: 'Global anycast edge network preview deployment with automated PR preview builds and Brotli compression.',
    dnsRecords: [
      { type: 'Edge Network', host: 'Cloudflare', target: 'Anycast DNS' },
      { type: 'Build Output', host: 'dist/', target: 'Static HTML/CSS/JS' },
    ],
  },
];
