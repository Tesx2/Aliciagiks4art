import React, { useState } from 'react';
import { Eye, Save, UploadCloud } from 'lucide-react';
import { EditableSection, SiteContent } from '../data/siteContent';

const inputClass = 'mt-1 w-full rounded-lg border border-purple-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100';
const sections = [
  { id: 'home', label: 'Home page' },
  { id: 'profile', label: 'Profile & about' },
  { id: 'work', label: 'Work section' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
  { id: 'layout', label: 'Layout & search' },
] as const;
type EditorSection = typeof sections[number]['id'];
type EditableBlock = 'profile' | 'navigation' | 'hero' | 'marquee' | 'work' | 'about' | 'services' | 'contact' | 'footer' | 'seo' | 'page';

interface SiteEditorProps {
  content: SiteContent;
  onChange: (content: SiteContent) => void;
  onSave: () => void;
  onUploadPortrait: (file: File, alt: string) => Promise<void>;
  saving: boolean;
  dirty: boolean;
}

export const SiteEditor: React.FC<SiteEditorProps> = ({ content, onChange, onSave, onUploadPortrait, saving, dirty }) => {
  const [section, setSection] = useState<EditorSection>('home');
  const [uploadingPortrait, setUploadingPortrait] = useState(false);

  const update = (block: EditableBlock, field: string, value: unknown) => {
    onChange({ ...content, [block]: { ...content[block], [field]: value } } as SiteContent);
  };
  const input = (label: string, value: string, onValue: (value: string) => void, limit = 180, type = 'text') => (
    <label className="block text-sm font-medium text-neutral-700">{label}
      <input className={inputClass} type={type} maxLength={limit} value={value} onChange={(event) => onValue(event.target.value)} />
    </label>
  );
  const textarea = (label: string, value: string, onValue: (value: string) => void, rows = 3, limit = 700) => (
    <label className="block text-sm font-medium text-neutral-700">{label}
      <textarea className={inputClass} rows={rows} maxLength={limit} value={value} onChange={(event) => onValue(event.target.value)} />
    </label>
  );
  const listEditor = (label: string, values: string[], onValue: (values: string[]) => void, placeholder: string) => (
    <label className="block text-sm font-medium text-neutral-700">{label}
      <textarea className={inputClass} rows={Math.min(Math.max(values.length, 3), 8)} value={values.join('\n')} placeholder={placeholder} onChange={(event) => onValue(event.target.value.split('\n').map((line) => line.trim()).filter(Boolean))} />
      <span className="mt-1 block text-xs font-normal text-neutral-500">Use one item per line.</span>
    </label>
  );
  const moveSection = (id: EditableSection, direction: -1 | 1) => {
    const order = [...content.page.sectionOrder];
    const index = order.indexOf(id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= order.length) return;
    [order[index], order[next]] = [order[next], order[index]];
    update('page', 'sectionOrder', order);
  };
  const sectionNames: Record<EditableSection, string> = {
    marquee: 'Expertise ticker', work: 'Selected work', services: 'Services', about: 'About', contact: 'Contact',
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div>
          <h2 className="font-semibold text-neutral-900">Site content editor</h2>
          <p className="text-xs text-neutral-500">{dirty ? 'Unsaved changes' : 'All changes saved'}</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-purple-200 px-3 py-2 text-sm font-medium text-purple-950 hover:bg-purple-50"><Eye className="h-4 w-4" /> Preview site</a>
          <button type="button" onClick={onSave} disabled={!dirty || saving} className="inline-flex items-center gap-2 rounded-lg bg-purple-900 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"><Save className="h-4 w-4" />{saving ? 'Saving…' : 'Save site'}</button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <nav aria-label="Site editor sections" className="flex gap-2 overflow-x-auto rounded-2xl border border-purple-200 bg-white p-2 lg:flex-col lg:overflow-visible lg:self-start">
          {sections.map((item) => <button key={item.id} type="button" onClick={() => setSection(item.id)} className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${section === item.id ? 'bg-purple-100 text-purple-950' : 'text-neutral-600 hover:bg-neutral-50'}`}>{item.label}</button>)}
        </nav>

        <div className="min-w-0 space-y-5">
          {section === 'home' && <>
            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <div className="mb-5"><h3 className="text-lg font-semibold">Homepage hero</h3><p className="mt-1 text-sm text-neutral-500">Change the first message visitors see.</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                {input('Role line', content.hero.eyebrow, (value) => update('hero', 'eyebrow', value), 140)}
                {input('Headline', content.hero.headline, (value) => update('hero', 'headline', value), 140)}
                {input('Accent word', content.hero.accent, (value) => update('hero', 'accent', value), 60)}
                {input('Headline ending', content.hero.ending, (value) => update('hero', 'ending', value), 100)}
                <div className="sm:col-span-2">{textarea('Introduction', content.hero.intro, (value) => update('hero', 'intro', value), 3, 500)}</div>
                <div className="sm:col-span-2">{listEditor('Specialties', content.hero.specialties, (value) => update('hero', 'specialties', value), 'One specialty per line')}</div>
                {input('Work button', content.hero.workCta, (value) => update('hero', 'workCta', value), 60)}
                {input('Contact button', content.hero.contactCta, (value) => update('hero', 'contactCta', value), 60)}
              </div>
            </article>

            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <div className="mb-5"><h3 className="text-lg font-semibold">Portrait & featured reel</h3><p className="mt-1 text-sm text-neutral-500">Upload a portrait or choose a video that is already in Projects.</p></div>
              <div className="grid gap-4 sm:grid-cols-2">
                {input('Portrait image URL', content.hero.portraitSrc, (value) => update('hero', 'portraitSrc', value), 500)}
                {input('Portrait alt text', content.hero.portraitAlt, (value) => update('hero', 'portraitAlt', value), 300)}
                {input('Featured video URL', content.hero.reelSrc, (value) => update('hero', 'reelSrc', value), 500)}
                {input('Reel label', content.hero.reelLabel, (value) => update('hero', 'reelLabel', value), 80)}
                {input('Reel title', content.hero.reelTitle, (value) => update('hero', 'reelTitle', value), 120)}
              </div>
              <div className="mt-4">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-purple-200 px-3 py-2 text-sm font-medium text-purple-950 hover:bg-purple-50">
                  <UploadCloud className="h-4 w-4" />{uploadingPortrait ? 'Uploading…' : 'Choose portrait file'}
                  <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={uploadingPortrait} onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setUploadingPortrait(true);
                    try { await onUploadPortrait(file, content.hero.portraitAlt); }
                    finally { setUploadingPortrait(false); event.target.value = ''; }
                  }} />
                </label>
                <p className="mt-2 text-xs text-neutral-500">JPEG, PNG or WebP, up to 20 MB. Alt text is required for uploaded images.</p>
              </div>
            </article>

            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <h3 className="text-lg font-semibold">Moving ticker</h3>
              <div className="mt-4">{listEditor('Ticker phrases', content.marquee.items, (value) => update('marquee', 'items', value), 'One phrase per line')}</div>
            </article>
          </>}

          {section === 'profile' && <>
            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <h3 className="text-lg font-semibold">Profile and contact details</h3>
              <p className="mt-1 text-sm text-neutral-500">These details appear in the header, profile, contact area, and footer.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {input('Display name', content.profile.name, (value) => update('profile', 'name', value), 80)}
                {input('Handle', content.profile.handle, (value) => update('profile', 'handle', value), 80)}
                {input('Email', content.profile.email, (value) => update('profile', 'email', value), 254, 'email')}
                {input('WhatsApp number', content.profile.whatsapp, (value) => update('profile', 'whatsapp', value), 30, 'tel')}
                {input('Instagram username', content.profile.instagram, (value) => update('profile', 'instagram', value.replace(/^@/, '')), 40)}
                {input('Availability label (leave blank to hide)', content.profile.availability, (value) => update('profile', 'availability', value), 100)}
              </div>
            </article>
            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <h3 className="text-lg font-semibold">About section</h3>
              <div className="mt-5 grid gap-4">
                {input('Small section label', content.about.eyebrow, (value) => update('about', 'eyebrow', value), 80)}
                {input('Heading', content.about.heading, (value) => update('about', 'heading', value), 100)}
                {input('Lead sentence', content.about.lead, (value) => update('about', 'lead', value), 240)}
                {textarea('About copy', content.about.paragraphs.join('\n\n'), (value) => update('about', 'paragraphs', value.split(/\n\s*\n/).map((item) => item.trim()).filter(Boolean)), 7)}
                <div className="grid gap-4 sm:grid-cols-2">
                  {input('Location', content.about.location, (value) => update('about', 'location', value), 80)}
                  {input('Discipline line', content.about.disciplines, (value) => update('about', 'disciplines', value), 100)}
                </div>
                <div className="space-y-3 border-t border-purple-100 pt-4">
                  <div className="flex items-center justify-between"><h4 className="text-sm font-semibold">About highlights</h4><button type="button" onClick={() => update('about', 'highlights', [...content.about.highlights, { title: 'New highlight', description: '' }])} className="text-sm font-semibold text-purple-800">+ Add</button></div>
                  {content.about.highlights.map((item, index) => <div key={`${item.title}-${index}`} className="grid gap-3 rounded-xl bg-purple-50/60 p-3 sm:grid-cols-2">
                    {input('Title', item.title, (value) => update('about', 'highlights', content.about.highlights.map((row, rowIndex) => rowIndex === index ? { ...row, title: value } : row)), 120)}
                    {input('Description', item.description, (value) => update('about', 'highlights', content.about.highlights.map((row, rowIndex) => rowIndex === index ? { ...row, description: value } : row)), 300)}
                    <button type="button" onClick={() => update('about', 'highlights', content.about.highlights.filter((_, rowIndex) => rowIndex !== index))} className="text-left text-xs font-medium text-red-700 sm:col-span-2">Remove highlight</button>
                  </div>)}
                </div>
              </div>
            </article>
          </>}

          {section === 'work' && <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
            <h3 className="text-lg font-semibold">Selected work section</h3>
            <div className="mt-5 grid gap-4">
              {input('Small section label', content.work.eyebrow, (value) => update('work', 'eyebrow', value), 60)}
              {input('Heading', content.work.heading, (value) => update('work', 'heading', value), 140)}
              {textarea('Introduction', content.work.intro, (value) => update('work', 'intro', value), 3, 500)}
              {input('Search placeholder', content.work.searchPlaceholder, (value) => update('work', 'searchPlaceholder', value), 80)}
              <div className="space-y-2 border-t border-purple-100 pt-4">
                <h4 className="text-sm font-semibold">Project filter labels</h4>
                {content.work.categories.map((category, index) => <div key={category.id} className="grid grid-cols-[1fr_1fr] gap-3">
                  <span className="self-center text-xs text-neutral-500">{category.id}</span>
                  {input('Label', category.label, (value) => update('work', 'categories', content.work.categories.map((row, rowIndex) => rowIndex === index ? { ...row, label: value } : row)), 80)}
                </div>)}
              </div>
              <div className="space-y-3 border-t border-purple-100 pt-4">
                <h4 className="text-sm font-semibold">Homepage project cards</h4>
                <p className="text-xs text-neutral-500">Edit the built-in cards here. Uploaded projects are managed in Projects.</p>
                {content.work.featuredProjects.map((project, index) => <div key={project.id} className="grid gap-3 rounded-xl border border-purple-100 p-4 sm:grid-cols-2">
                  <div className="sm:col-span-2"><span className="font-mono text-xs text-purple-700">CARD {String(index + 1).padStart(2, '0')}</span></div>
                  {input('Title', project.title, (value) => update('work', 'featuredProjects', content.work.featuredProjects.map((item) => item.id === project.id ? { ...item, title: value } : item)), 120)}
                  <label className="block text-sm font-medium text-neutral-700">Filter category<select className={inputClass} value={project.category} onChange={(event) => update('work', 'featuredProjects', content.work.featuredProjects.map((item) => item.id === project.id ? { ...item, category: event.target.value } : item))}>{content.work.categories.filter((category) => category.id !== 'all').map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
                  {input('Category label', project.categoryLabel, (value) => update('work', 'featuredProjects', content.work.featuredProjects.map((item) => item.id === project.id ? { ...item, categoryLabel: value } : item)), 80)}
                  {input('Year', project.year, (value) => update('work', 'featuredProjects', content.work.featuredProjects.map((item) => item.id === project.id ? { ...item, year: value } : item)), 4)}
                  {input('Alt text', project.alt, (value) => update('work', 'featuredProjects', content.work.featuredProjects.map((item) => item.id === project.id ? { ...item, alt: value } : item)), 500)}
                  <div className="sm:col-span-2">{textarea('Description', project.brief, (value) => update('work', 'featuredProjects', content.work.featuredProjects.map((item) => item.id === project.id ? { ...item, brief: value } : item)), 2, 500)}</div>
                  <label className="flex items-center gap-2 text-sm text-neutral-700 sm:col-span-2"><input type="checkbox" checked={project.visible} onChange={(event) => update('work', 'featuredProjects', content.work.featuredProjects.map((item) => item.id === project.id ? { ...item, visible: event.target.checked } : item))} /> Show this card</label>
                </div>)}
              </div>
            </div>
          </article>}

          {section === 'services' && <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold">Services section</h3><p className="mt-1 text-sm text-neutral-500">Edit, add, or remove cards on the public site.</p></div><button type="button" onClick={() => update('services', 'items', [...content.services.items, { id: crypto.randomUUID(), title: 'New service', description: '' }])} className="rounded-lg border border-purple-200 px-3 py-2 text-sm font-semibold text-purple-900">+ Add service</button></div>
            <div className="mt-5 grid gap-4">{input('Section label', content.services.eyebrow, (value) => update('services', 'eyebrow', value), 80)}{input('Heading', content.services.heading, (value) => update('services', 'heading', value), 100)}{textarea('Introduction', content.services.intro, (value) => update('services', 'intro', value), 3, 400)}
              {content.services.items.map((item, index) => <div key={item.id} className="rounded-xl border border-purple-100 p-4">
                <div className="mb-3 flex items-center justify-between"><span className="text-xs font-mono text-purple-700">SERVICE {String(index + 1).padStart(2, '0')}</span><button type="button" onClick={() => update('services', 'items', content.services.items.filter((row) => row.id !== item.id))} className="text-xs text-red-700">Remove</button></div>
                {input('Service title', item.title, (value) => update('services', 'items', content.services.items.map((row) => row.id === item.id ? { ...row, title: value } : row)), 120)}
                <div className="mt-3">{textarea('Description', item.description, (value) => update('services', 'items', content.services.items.map((row) => row.id === item.id ? { ...row, description: value } : row)), 3, 600)}</div>
              </div>)}
            </div>
          </article>}

          {section === 'contact' && <>
            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <h3 className="text-lg font-semibold">Contact area</h3><p className="mt-1 text-sm text-neutral-500">The contact form prepares an email using the profile email address.</p>
              <div className="mt-5 grid gap-4">
                {input('Section label', content.contact.eyebrow, (value) => update('contact', 'eyebrow', value), 80)}
                {input('Heading', content.contact.heading, (value) => update('contact', 'heading', value), 120)}
                {textarea('Introduction', content.contact.intro, (value) => update('contact', 'intro', value), 3, 400)}
                {input('Form heading', content.contact.formHeading, (value) => update('contact', 'formHeading', value), 80)}
                {textarea('Form introduction', content.contact.formIntro, (value) => update('contact', 'formIntro', value), 2, 240)}
                {listEditor('Service dropdown choices', content.contact.serviceOptions, (value) => update('contact', 'serviceOptions', value), 'One service per line')}
                {listEditor('Timeline dropdown choices', content.contact.timelineOptions, (value) => update('contact', 'timelineOptions', value), 'One timeline per line')}
              </div>
            </article>
          </>}

          {section === 'layout' && <>
            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <h3 className="text-lg font-semibold">Page structure</h3><p className="mt-1 text-sm text-neutral-500">Hide sections or change their order. The home hero stays at the top.</p>
              <div className="mt-5 space-y-2">{content.page.sectionOrder.map((id, index) => <div key={id} className="flex items-center justify-between rounded-xl border border-purple-100 px-4 py-3">
                <label className="flex items-center gap-3 text-sm font-medium"><input type="checkbox" checked={!content.page.hiddenSections.includes(id)} onChange={(event) => update('page', 'hiddenSections', event.target.checked ? content.page.hiddenSections.filter((hidden) => hidden !== id) : [...content.page.hiddenSections, id])} />{sectionNames[id]}</label>
                <div className="flex gap-2"><button type="button" disabled={index === 0} onClick={() => moveSection(id, -1)} className="rounded border border-purple-100 px-2 py-1 text-sm disabled:opacity-30" aria-label={`Move ${sectionNames[id]} up`}>↑</button><button type="button" disabled={index === content.page.sectionOrder.length - 1} onClick={() => moveSection(id, 1)} className="rounded border border-purple-100 px-2 py-1 text-sm disabled:opacity-30" aria-label={`Move ${sectionNames[id]} down`}>↓</button></div>
              </div>)}</div>
            </article>
            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <h3 className="text-lg font-semibold">Search and footer</h3>
              <div className="mt-4 grid gap-4">{textarea('Ticker text', content.marquee.items.join('\n'), (value) => update('marquee', 'items', value.split('\n').map((row) => row.trim()).filter(Boolean)), 5)}{input('Footer tagline', content.footer.tagline, (value) => update('footer', 'tagline', value), 180)}</div>
            </article>
            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <h3 className="text-lg font-semibold">Search and sharing metadata</h3>
              <div className="mt-4 grid gap-4">{input('Browser and social title', content.seo.title, (value) => update('seo', 'title', value), 140)}{textarea('Search description', content.seo.description, (value) => update('seo', 'description', value), 3, 300)}</div>
            </article>
            <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <h3 className="text-lg font-semibold">Navigation labels</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">
                {input('Work link', content.navigation.work, (value) => update('navigation', 'work', value), 40)}
                {input('Services link', content.navigation.services, (value) => update('navigation', 'services', value), 40)}
                {input('About link', content.navigation.about, (value) => update('navigation', 'about', value), 40)}
                {input('Contact link', content.navigation.contact, (value) => update('navigation', 'contact', value), 40)}
                {input('Navigation button', content.navigation.cta, (value) => update('navigation', 'cta', value), 60)}
              </div>
            </article>
          </>}
        </div>
      </div>
    </div>
  );
};
