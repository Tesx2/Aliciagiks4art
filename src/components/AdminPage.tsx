import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, LoaderCircle, LogOut, Save, Trash2, UploadCloud, LayoutDashboard, PanelsTopLeft, FolderOpen, Images, Eye } from 'lucide-react';
import { PortfolioItem } from '../data/portfolioData';
import { DEFAULT_SITE_CONTENT, SiteContent } from '../data/siteContent';
import { SiteEditor } from './SiteEditor';

interface ManagedProject extends PortfolioItem {
  alt: string;
  brief: string;
  featured: boolean;
}

const categories = [
  { value: 'motion graphic', label: 'Motion Graphics' },
  { value: 'logo design', label: 'Brand & Logo' },
  { value: 'posters', label: 'Posters & Print' },
  { value: 'drawing', label: 'Drawing & Art' },
  { value: 'photography', label: 'Photography' },
  { value: '3D', label: '3D Art' },
];

const fieldClass = 'mt-1 w-full rounded-lg border border-purple-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100';
type AdminTab = 'overview' | 'site' | 'projects' | 'media';
interface ManagedAsset { id: string; alt: string; src: string; size: number; createdAt: string }

export const AdminPage: React.FC = () => {
  const [projects, setProjects] = useState<ManagedProject[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [setupAvailable, setSetupAvailable] = useState(false);
  const [authConfigured, setAuthConfigured] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [setupToken, setSetupToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0].value);
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [alt, setAlt] = useState('');
  const [brief, setBrief] = useState('');
  const [featured, setFeatured] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [savedSiteContent, setSavedSiteContent] = useState(JSON.stringify(DEFAULT_SITE_CONTENT));
  const [siteSaving, setSiteSaving] = useState(false);
  const [assets, setAssets] = useState<ManagedAsset[]>([]);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/projects', { cache: 'no-store' });
      if (response.status === 401 || response.status === 403) {
        setAuthorized(false);
        return;
      }
      if (!response.ok) throw new Error((await response.json()).error || 'Could not load projects.');
      setProjects(await response.json());
      setAuthorized(true);
    } catch (error) {
      setAuthorized(false);
      setNotice(error instanceof Error ? error.message : 'Could not connect to the portfolio API.');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSite = useCallback(async () => {
    const response = await fetch('/api/admin/site', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load site content.');
    const result = await response.json() as SiteContent;
    setSiteContent(result);
    setSavedSiteContent(JSON.stringify(result));
  }, []);

  const loadAssets = useCallback(async () => {
    const response = await fetch('/api/admin/assets', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load site media.');
    setAssets(await response.json());
  }, []);

  const loadSetupState = useCallback(async () => {
    try {
      const response = await fetch('/api/setup', { cache: 'no-store' });
      if (response.ok) {
        const result = await response.json() as { available?: boolean; configured?: boolean };
        setSetupAvailable(result.available === true);
        setAuthConfigured(result.configured === true);
      } else {
        setAuthConfigured(false);
      }
    } catch {
      setSetupAvailable(false);
      setAuthConfigured(false);
    }
  }, []);

  useEffect(() => { void loadProjects(); void loadSetupState(); }, [loadProjects, loadSetupState]);
  useEffect(() => {
    if (authorized !== true) return;
    void Promise.all([loadSite(), loadAssets()]).catch((error) => setNotice(error instanceof Error ? error.message : 'Could not load site settings.'));
  }, [authorized, loadSite, loadAssets]);

  const saveSite = async () => {
    setSiteSaving(true);
    setNotice('Saving site content…');
    try {
      const response = await fetch('/api/admin/site', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(siteContent) });
      const result = await response.json().catch(() => ({})) as { error?: string; content?: SiteContent };
      if (!response.ok) throw new Error(result.error || 'Could not save site content.');
      const saved = result.content || siteContent;
      setSiteContent(saved);
      setSavedSiteContent(JSON.stringify(saved));
      setNotice('Site content saved and published.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save site content.');
    } finally {
      setSiteSaving(false);
    }
  };

  const uploadSiteAsset = async (assetFile: File, imageAlt: string, target: 'portrait' | 'logo' = 'portrait') => {
    try {
      const form = new FormData();
      form.set('file', assetFile);
      form.set('alt', imageAlt);
      const response = await fetch('/api/admin/assets', { method: 'POST', body: form });
      const result = await response.json().catch(() => ({})) as ManagedAsset & { error?: string };
      if (!response.ok) throw new Error(result.error || 'Image upload failed.');
      setSiteContent((current) => target === 'logo'
        ? { ...current, profile: { ...current.profile, logoSrc: result.src, logoAlt: imageAlt } }
        : { ...current, hero: { ...current.hero, portraitSrc: result.src, portraitAlt: imageAlt } });
      setAssets((current) => [result, ...current]);
      setNotice(`${target === 'logo' ? 'Logo' : 'Portrait'} uploaded. Save site content to publish it.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Image upload failed.');
    }
  };

  const deleteSiteAsset = async (asset: ManagedAsset) => {
    if (siteContent.hero.portraitSrc === asset.src || siteContent.profile.logoSrc === asset.src) {
      setNotice('This image is currently in use on the site. Replace or remove it in Site editor before deleting it.');
      return;
    }
    if (!window.confirm('Permanently delete this uploaded image?')) return;
    const response = await fetch(`/api/admin/assets/${asset.id}`, { method: 'DELETE' });
    const result = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) { setNotice(result.error || 'Could not delete image.'); return; }
    setAssets((current) => current.filter((item) => item.id !== asset.id));
    setNotice('Image deleted.');
  };

  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice('Signing in…');
    try {
      const response = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail.trim().toLowerCase(), password: authPassword, rememberMe: false }),
      });
      const result = await response.json().catch(() => ({})) as { message?: string; error?: { message?: string } };
      if (!response.ok) throw new Error(result.message || result.error?.message || 'Sign-in failed. Check the email and password.');
      setAuthPassword('');
      setNotice('Signed in.');
      await loadProjects();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  const createAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice('Creating the first admin account…');
    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Setup-Token': setupToken },
        body: JSON.stringify({ email: authEmail.trim().toLowerCase(), password: authPassword }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || 'Could not create the admin account.');
      setSetupAvailable(false);
      setSetupToken('');
      setAuthPassword('');
      setNotice('Admin account created. Sign in with that email and password.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create the admin account.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    try {
      const response = await fetch('/api/auth/sign-out', { method: 'POST' });
      if (!response.ok) throw new Error('Could not sign out. Please try again.');
      setAuthorized(false);
      setProjects([]);
      setAssets([]);
      setNotice('You have signed out.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not sign out.');
    } finally {
      setBusy(false);
    }
  };

  const uploadProject = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setNotice('Choose an image or video first.');
      return;
    }
    setBusy(true);
    setNotice('Uploading your project…');
    const form = new FormData();
    form.set('file', file);
    form.set('title', title);
    form.set('category', category);
    form.set('categoryLabel', categories.find((item) => item.value === category)?.label || category);
    form.set('year', year);
    form.set('alt', alt);
    form.set('brief', brief);
    form.set('featured', String(featured));
    try {
      const response = await fetch('/api/admin/projects', { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Upload failed.');
      setProjects((current) => [result, ...current]);
      setTitle('');
      setAlt('');
      setBrief('');
      setFile(null);
      const picker = document.getElementById('project-file') as HTMLInputElement | null;
      if (picker) picker.value = '';
      setNotice('Project uploaded. It is now listed in the public portfolio.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const updateDraft = (id: string, field: keyof ManagedProject, value: string | boolean) => {
    setProjects((current) => current.map((project) => project.id === id ? { ...project, [field]: value } : project));
  };

  const saveProject = async (project: ManagedProject) => {
    setBusy(true);
    setNotice('Saving project…');
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          category: project.category,
          categoryLabel: project.categoryLabel,
          year: project.year,
          alt: project.alt,
          brief: project.brief,
          featured: project.featured,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not save project.');
      setNotice('Project details saved.');
      await loadProjects();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save project.');
    } finally {
      setBusy(false);
    }
  };

  const deleteProject = async (project: ManagedProject) => {
    if (!window.confirm(`Permanently remove “${project.title}” and its uploaded file?`)) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Could not delete project.');
      }
      setProjects((current) => current.filter((item) => item.id !== project.id));
      setNotice('Project and file removed.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not delete project.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF7FC] text-neutral-900">
      {authorized === true && <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-purple-200 bg-white px-4 py-5 shadow-sm md:flex">
        <a href="/" className="flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-purple-50">
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-purple-900 font-serif text-lg font-bold text-white">{siteContent.profile.logoSrc ? <img src={siteContent.profile.logoSrc} alt={siteContent.profile.logoAlt} className="h-full w-full object-contain" /> : siteContent.profile.name.charAt(0) || 'M'}</span>
          <span className="min-w-0"><span className="block truncate text-sm font-bold text-neutral-900">{siteContent.profile.handle}</span><span className="block truncate text-xs text-neutral-500">{siteContent.profile.name}</span></span>
        </a>
        <div className="mt-8 px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">Workspace</div>
        <nav aria-label="Admin areas" className="mt-2 space-y-1">
          {([{ id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'site', label: 'Site editor', icon: PanelsTopLeft }, { id: 'projects', label: 'Projects', icon: FolderOpen }, { id: 'media', label: 'Media library', icon: Images }] as const).map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} aria-current={activeTab === id ? 'page' : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition-colors ${activeTab === id ? 'bg-purple-100 text-purple-950' : 'text-neutral-600 hover:bg-purple-50 hover:text-purple-950'}`}><Icon className="h-4 w-4 shrink-0" />{label}</button>)}
        </nav>
        <div className="mt-auto space-y-2 border-t border-purple-100 pt-4">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-600 hover:bg-purple-50 hover:text-purple-950"><Eye className="h-4 w-4" />View website</a>
          <button type="button" disabled={busy} onClick={() => void signOut()} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-neutral-600 hover:bg-purple-50 hover:text-purple-950 disabled:opacity-60"><LogOut className="h-4 w-4" />Sign out</button>
        </div>
      </aside>}
      <div className={`mx-auto max-w-7xl px-4 py-8 sm:px-8 ${authorized === true ? 'md:ml-64' : ''}`}>
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-purple-900 hover:text-purple-700">
          <ArrowLeft className="h-4 w-4" /> View public portfolio
        </a>
        <header className="mt-7 border-b border-purple-200 pb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-purple-700">Aliciagiks4art · Admin</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Manage your portfolio</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
            Manage the homepage, profile, work, services, contact details, page layout, search previews, and uploaded media from one place.
          </p>
          {authorized === true && <button type="button" disabled={busy} onClick={() => void signOut()} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-purple-200 px-3 py-2 text-sm font-medium text-purple-950 hover:bg-purple-50 disabled:opacity-60 md:hidden"><LogOut className="h-4 w-4" /> Sign out</button>}
        </header>

        {notice && <p role="status" className="mt-5 rounded-lg border border-purple-200 bg-white px-4 py-3 text-sm text-purple-950">{notice}</p>}

        {loading ? (
          <div className="mt-10 flex items-center gap-2 text-sm text-neutral-600"><LoaderCircle className="h-4 w-4 animate-spin" /> Connecting to your admin…</div>
        ) : authorized === false ? (
          <section className="mt-8 rounded-2xl border border-purple-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold">{!authConfigured ? 'Admin authentication is not configured' : setupAvailable ? 'Set up the owner account' : 'Admin sign-in'}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              {!authConfigured ? 'Add the AUTH_DB D1 binding and Better Auth production variables/secrets in the Cloudflare account hosting this site, apply the D1 migration, and redeploy.' : setupAvailable ? 'This one-time setup is available before the first admin account is created. Use the setup code saved in your Cloudflare secret.' : 'Sign in with the owner account. Public account registration is disabled.'}
            </p>
            {authConfigured && <form onSubmit={setupAvailable ? createAdmin : signIn} className="mt-5 grid max-w-lg gap-4">
              {setupAvailable && <label className="text-sm font-medium">One-time setup code<input className={fieldClass} type="password" autoComplete="off" required value={setupToken} onChange={(event) => setSetupToken(event.target.value)} /></label>}
              <label className="text-sm font-medium">Admin email<input className={fieldClass} type="email" autoComplete="username" required value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} /></label>
              <label className="text-sm font-medium">Password<input className={fieldClass} type="password" minLength={12} maxLength={128} autoComplete={setupAvailable ? 'new-password' : 'current-password'} required value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} /></label>
              <button type="submit" disabled={busy} className="inline-flex w-fit items-center gap-2 rounded-lg bg-purple-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-60">{busy && <LoaderCircle className="h-4 w-4 animate-spin" />}{setupAvailable ? 'Create admin account' : 'Sign in'}</button>
            </form>}
            {authConfigured && !setupAvailable && <button type="button" onClick={() => { void loadProjects(); void loadSetupState(); }} className="mt-4 text-sm font-medium text-purple-800 underline">Try again</button>}
          </section>
        ) : (
          <>
            <nav aria-label="Admin areas" className="mt-7 flex gap-2 overflow-x-auto rounded-xl border border-purple-200 bg-white p-2 md:hidden">
              {([{ id: 'overview', label: 'Overview', icon: LayoutDashboard }, { id: 'site', label: 'Site editor', icon: PanelsTopLeft }, { id: 'projects', label: 'Projects', icon: FolderOpen }, { id: 'media', label: 'Media library', icon: Images }] as const).map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setActiveTab(id)} className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold ${activeTab === id ? 'bg-purple-900 text-white' : 'text-neutral-700 hover:bg-purple-50'}`}><Icon className="h-4 w-4" />{label}</button>)}
            </nav>

            {activeTab === 'overview' && <section className="mt-7 grid gap-4 sm:grid-cols-3">
              {[{ label: 'Uploaded projects', value: projects.length, action: 'Manage projects', tab: 'projects' as const }, { label: 'Media files', value: assets.length, action: 'Open media library', tab: 'media' as const }, { label: 'Editable sections', value: 5, action: 'Edit site content', tab: 'site' as const }].map((card) => <article key={card.label} className="rounded-2xl border border-purple-200 bg-white p-5"><p className="text-sm text-neutral-500">{card.label}</p><p className="mt-2 text-3xl font-bold text-purple-950">{card.value}</p><button type="button" onClick={() => setActiveTab(card.tab)} className="mt-4 text-sm font-semibold text-purple-800 underline">{card.action}</button></article>)}
              <article className="rounded-2xl border border-purple-200 bg-white p-5 sm:col-span-3"><h2 className="text-lg font-semibold">Publish changes</h2><p className="mt-1 text-sm text-neutral-600">Site text and layout are saved to Cloudflare R2. Project uploads are published to the portfolio automatically.</p><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => setActiveTab('site')} className="rounded-lg bg-purple-900 px-4 py-2.5 text-sm font-semibold text-white">Edit website</button><a href="/" target="_blank" rel="noreferrer" className="rounded-lg border border-purple-200 px-4 py-2.5 text-sm font-semibold text-purple-950">Preview website</a></div></article>
            </section>}

            {activeTab === 'site' && <div className="mt-7"><SiteEditor content={siteContent} onChange={setSiteContent} onSave={() => void saveSite()} saving={siteSaving} dirty={JSON.stringify(siteContent) !== savedSiteContent} onUploadPortrait={uploadSiteAsset} onUploadLogo={(file, imageAlt) => uploadSiteAsset(file, imageAlt, 'logo')} /></div>}

            {activeTab === 'media' && <section className="mt-7"><div className="mb-4"><h2 className="text-xl font-semibold">Media library</h2><p className="mt-1 text-sm text-neutral-600">Images uploaded for the site, with the alt text recorded for accessibility.</p></div>{assets.length === 0 ? <p className="rounded-xl border border-dashed border-purple-300 bg-white p-8 text-center text-sm text-neutral-600">No site images uploaded yet. Upload a portrait from Site editor.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{assets.map((asset) => <article key={asset.id} className="overflow-hidden rounded-2xl border border-purple-200 bg-white"><img src={asset.src} alt={asset.alt} className="aspect-video w-full object-cover" /><div className="p-4"><p className="line-clamp-3 text-sm text-neutral-700">{asset.alt}</p><p className="mt-2 text-xs text-neutral-500">{(asset.size / 1024 / 1024).toFixed(2)} MB</p><button type="button" onClick={() => void deleteSiteAsset(asset)} className="mt-3 text-sm font-semibold text-red-700">Delete image</button></div></article>)}</div>}</section>}

            {activeTab === 'projects' && <>
            <section className="mt-8 rounded-2xl border border-purple-200 bg-white p-5 sm:p-7">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-900"><ImagePlus className="h-5 w-5" /></span>
                <div><h2 className="text-lg font-semibold">Add a project</h2><p className="text-xs text-neutral-500">JPEG, PNG, WebP, MP4, or WebM · up to 50 MB</p></div>
              </div>
              <form onSubmit={uploadProject} className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">Media file *
                  <input id="project-file" className={fieldClass} type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" required onChange={(event) => {
                    const nextFile = event.target.files?.[0] || null;
                    setFile(nextFile);
                    if (nextFile && !title) setTitle(nextFile.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '));
                  }} />
                </label>
                <label className="text-sm font-medium">Project title *<input className={fieldClass} maxLength={120} required value={title} onChange={(event) => setTitle(event.target.value)} /></label>
                <label className="text-sm font-medium">Category *
                  <select className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)}>
                    {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
                <label className="text-sm font-medium">Year<input className={fieldClass} inputMode="numeric" maxLength={4} value={year} onChange={(event) => setYear(event.target.value)} /></label>
                <label className="text-sm font-medium sm:col-span-2">Alt text *
                  <textarea className={fieldClass} rows={2} maxLength={500} required value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="Describe what the image shows, including important colors, subjects, and text." />
                  <span className="mt-1 block text-xs font-normal text-neutral-500">Describe the content and purpose of the image; don’t start with “image of”. For video, summarize the visible action.</span>
                </label>
                <label className="text-sm font-medium sm:col-span-2">Short project description
                  <textarea className={fieldClass} rows={3} maxLength={1000} value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="What was the idea, brief, or creative approach?" />
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-700 sm:col-span-2"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} /> Mark as featured</label>
                <div className="sm:col-span-2"><button disabled={busy} type="submit" className="inline-flex items-center gap-2 rounded-lg bg-purple-900 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-60"><UploadCloud className="h-4 w-4" /> Upload project</button></div>
              </form>
            </section>

            <section className="mt-10">
              <div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-xl font-semibold">Uploaded projects</h2><p className="mt-1 text-sm text-neutral-600">Edit the title, category, alt text, and description shown on the site.</p></div><span className="text-sm text-neutral-500">{projects.length} items</span></div>
              {projects.length === 0 ? (
                <p className="rounded-xl border border-dashed border-purple-300 bg-white/70 p-8 text-center text-sm text-neutral-600">No uploads yet. Existing portfolio artwork remains available until you add projects here.</p>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <article key={project.id} className="grid gap-4 rounded-2xl border border-purple-200 bg-white p-4 sm:grid-cols-[150px_1fr] sm:p-5">
                      {project.type === 'video' ? <video src={project.src} className="aspect-video w-full rounded-lg bg-neutral-100 object-cover sm:w-[150px]" muted playsInline /> : <img src={project.src} alt={project.alt} className="aspect-video w-full rounded-lg bg-neutral-100 object-cover sm:w-[150px]" />}
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="text-xs font-semibold text-neutral-600">Title<input className={fieldClass} value={project.title} onChange={(event) => updateDraft(project.id, 'title', event.target.value)} /></label>
                        <label className="text-xs font-semibold text-neutral-600">Category
                          <select className={fieldClass} value={project.category} onChange={(event) => {
                            const selected = categories.find((item) => item.value === event.target.value);
                            updateDraft(project.id, 'category', event.target.value);
                            if (selected) updateDraft(project.id, 'categoryLabel', selected.label);
                          }}>
                            {categories.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                          </select>
                        </label>
                        <label className="text-xs font-semibold text-neutral-600 sm:col-span-2">Alt text<input className={fieldClass} maxLength={500} value={project.alt} onChange={(event) => updateDraft(project.id, 'alt', event.target.value)} /></label>
                        <label className="text-xs font-semibold text-neutral-600 sm:col-span-2">Description<textarea className={fieldClass} rows={2} maxLength={1000} value={project.brief} onChange={(event) => updateDraft(project.id, 'brief', event.target.value)} /></label>
                        <label className="flex items-center gap-2 text-sm text-neutral-700"><input type="checkbox" checked={project.featured} onChange={(event) => updateDraft(project.id, 'featured', event.target.checked)} /> Featured</label>
                        <div className="flex flex-wrap justify-end gap-2 sm:col-span-2">
                          <button type="button" disabled={busy} onClick={() => void saveProject(project)} className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 px-3 py-2 text-xs font-semibold text-purple-950 hover:bg-purple-50 disabled:opacity-60"><Save className="h-3.5 w-3.5" /> Save details</button>
                          <button type="button" disabled={busy} onClick={() => void deleteProject(project)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
            </>}
          </>
        )}
        {authorized === true && <footer className="mt-12 border-t border-purple-200 py-5 text-xs text-neutral-500">Changes to text and layout are stored in R2; project uploads are managed separately. Keep your admin password private.</footer>}
      </div>
    </main>
  );
};
