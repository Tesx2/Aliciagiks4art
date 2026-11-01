import { DEFAULT_SITE_CONTENT, EditableSection, mergeSiteContent, SiteContent } from '../../src/data/siteContent';
import { R2Bucket } from './types';

export const SITE_CONTENT_KEY = 'site/content.json';
export const SITE_MEDIA_PREFIX = 'site-media/';
const sectionIds: EditableSection[] = ['marquee', 'work', 'services', 'about', 'contact'];

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function text(value: unknown, fallback: string, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : fallback;
}

function textList(value: unknown, fallback: string[], maxCount = 20, maxLength = 160): string[] {
  if (!Array.isArray(value)) return fallback;
  return value.slice(0, maxCount).map((item) => typeof item === 'string' ? item.trim().slice(0, maxLength) : '').filter(Boolean);
}

function rows(value: unknown, fallback: Array<{ id?: string; title: string; description: string }>, maxCount = 12) {
  if (!Array.isArray(value)) return fallback;
  return value.slice(0, maxCount).flatMap((item, index) => {
    const row = record(item);
    const title = text(row.title, '', 120);
    const description = text(row.description, '', 600);
    if (!title) return [];
    return [{ id: text(row.id, `item-${index + 1}`, 60), title, description }];
  });
}

function assetPath(value: unknown, fallback: string, max = 500): string {
  const source = text(value, fallback, max);
  if (/^https:\/\//i.test(source)) return source;
  if (/^\/api\/media\/[a-f0-9-]{36}$/i.test(source)) return source;
  if (/^[a-zA-Z0-9_./ -]+$/.test(source) && !source.includes('..') && !source.startsWith('/')) return source;
  return fallback;
}

export function normalizeSiteContent(value: unknown): SiteContent {
  const input = mergeSiteContent(value);
  const raw = record(value);
  const profile = record(raw.profile);
  const navigation = record(raw.navigation);
  const hero = record(raw.hero);
  const marquee = record(raw.marquee);
  const work = record(raw.work);
  const about = record(raw.about);
  const services = record(raw.services);
  const contact = record(raw.contact);
  const footer = record(raw.footer);
  const seo = record(raw.seo);
  const page = record(raw.page);
  const email = text(profile.email, input.profile.email, 254);
  const instagram = text(profile.instagram, input.profile.instagram, 40).replace(/^@/, '').replace(/[^a-zA-Z0-9._]/g, '');
  const categories = Array.isArray(work.categories) ? work.categories.slice(0, 12).flatMap((entry) => {
    const row = record(entry);
    const id = text(row.id, '', 60);
    const label = text(row.label, '', 80);
    return id && label && input.work.categories.some((item) => item.id === id) ? [{ id, label }] : [];
  }) : input.work.categories;
  const featuredProjects = input.work.featuredProjects.map((base) => {
    const candidate = Array.isArray(work.featuredProjects)
      ? work.featuredProjects.find((entry) => record(entry).id === base.id)
      : undefined;
    const row = record(candidate);
    return {
      ...base,
      title: text(row.title, base.title, 120),
      category: categories.some((item) => item.id === row.category) ? String(row.category) : base.category,
      categoryLabel: text(row.categoryLabel, base.categoryLabel, 80),
      alt: text(row.alt, base.alt, 500),
      year: text(row.year, base.year, 4),
      brief: text(row.brief, base.brief, 1000),
      visible: typeof row.visible === 'boolean' ? row.visible : base.visible,
    };
  });
  const allowedOrder = Array.isArray(page.sectionOrder)
    ? page.sectionOrder.filter((item): item is EditableSection => sectionIds.includes(item as EditableSection))
    : input.page.sectionOrder;
  const order = [...new Set(allowedOrder)];
  sectionIds.forEach((id) => { if (!order.includes(id)) order.push(id); });
  const hiddenSections = textList(page.hiddenSections, [], sectionIds.length, 30).filter((id): id is EditableSection => sectionIds.includes(id as EditableSection));

  return {
    profile: {
      name: text(profile.name, input.profile.name, 80),
      handle: text(profile.handle, input.profile.handle, 80).replace(/^@/, '').slice(0, 80),
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : input.profile.email,
      whatsapp: text(profile.whatsapp, input.profile.whatsapp, 30).replace(/[^+0-9]/g, ''),
      instagram: instagram || input.profile.instagram,
      availability: text(profile.availability, input.profile.availability, 100),
    },
    navigation: {
      work: text(navigation.work, input.navigation.work, 40),
      services: text(navigation.services, input.navigation.services, 40),
      about: text(navigation.about, input.navigation.about, 40),
      contact: text(navigation.contact, input.navigation.contact, 40),
      cta: text(navigation.cta, input.navigation.cta, 60),
    },
    hero: {
      eyebrow: text(hero.eyebrow, input.hero.eyebrow, 140),
      headline: text(hero.headline, input.hero.headline, 140),
      accent: text(hero.accent, input.hero.accent, 60),
      ending: text(hero.ending, input.hero.ending, 100),
      intro: text(hero.intro, input.hero.intro, 500),
      specialties: textList(hero.specialties, input.hero.specialties, 10, 80),
      workCta: text(hero.workCta, input.hero.workCta, 60),
      contactCta: text(hero.contactCta, input.hero.contactCta, 60),
      portraitSrc: assetPath(hero.portraitSrc, input.hero.portraitSrc),
      portraitAlt: text(hero.portraitAlt, input.hero.portraitAlt, 300),
      reelSrc: assetPath(hero.reelSrc, input.hero.reelSrc),
      reelLabel: text(hero.reelLabel, input.hero.reelLabel, 80),
      reelTitle: text(hero.reelTitle, input.hero.reelTitle, 120),
    },
    marquee: { items: textList(marquee.items, input.marquee.items, 12, 80) },
    work: {
      eyebrow: text(work.eyebrow, input.work.eyebrow, 60),
      heading: text(work.heading, input.work.heading, 140),
      intro: text(work.intro, input.work.intro, 500),
      searchPlaceholder: text(work.searchPlaceholder, input.work.searchPlaceholder, 80),
      categories: categories.length ? categories : input.work.categories,
      featuredProjects,
    },
    about: {
      eyebrow: text(about.eyebrow, input.about.eyebrow, 80),
      heading: text(about.heading, input.about.heading, 100),
      lead: text(about.lead, input.about.lead, 240),
      paragraphs: textList(about.paragraphs, input.about.paragraphs, 5, 700),
      location: text(about.location, input.about.location, 80),
      disciplines: text(about.disciplines, input.about.disciplines, 100),
      highlights: rows(about.highlights, input.about.highlights, 6),
    },
    services: {
      eyebrow: text(services.eyebrow, input.services.eyebrow, 80),
      heading: text(services.heading, input.services.heading, 100),
      intro: text(services.intro, input.services.intro, 400),
      items: rows(services.items, input.services.items, 12),
    },
    contact: {
      eyebrow: text(contact.eyebrow, input.contact.eyebrow, 80),
      heading: text(contact.heading, input.contact.heading, 120),
      intro: text(contact.intro, input.contact.intro, 400),
      formHeading: text(contact.formHeading, input.contact.formHeading, 80),
      formIntro: text(contact.formIntro, input.contact.formIntro, 240),
      serviceOptions: textList(contact.serviceOptions, input.contact.serviceOptions, 20, 100),
      timelineOptions: textList(contact.timelineOptions, input.contact.timelineOptions, 12, 80),
    },
    footer: { tagline: text(footer.tagline, input.footer.tagline, 180) },
    seo: {
      title: text(seo.title, input.seo.title, 140),
      description: text(seo.description, input.seo.description, 300),
    },
    page: { sectionOrder: order, hiddenSections },
  };
}

export async function getSiteContent(bucket: R2Bucket): Promise<SiteContent> {
  const object = await bucket.get(SITE_CONTENT_KEY);
  if (!object) return DEFAULT_SITE_CONTENT;
  try {
    return normalizeSiteContent(JSON.parse(await new Response(object.body).text()));
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}
