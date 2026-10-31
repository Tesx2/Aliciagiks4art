import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, LoaderCircle, Save, Trash2, UploadCloud } from 'lucide-react';
import { PortfolioItem } from '../data/portfolioData';

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

export const AdminPage: React.FC = () => {
  const [projects, setProjects] = useState<ManagedProject[]>([]);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
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

  useEffect(() => { void loadProjects(); }, [loadProjects]);

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
    <main className="min-h-screen bg-[#FAF7FC] px-4 py-8 text-neutral-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-purple-900 hover:text-purple-700">
          <ArrowLeft className="h-4 w-4" /> View public portfolio
        </a>
        <header className="mt-7 border-b border-purple-200 pb-6">
          <p className="font-mono text-xs uppercase tracking-widest text-purple-700">Aliciagiks4art · Admin</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Manage your portfolio</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
            Upload artwork or video, write descriptive alt text, and update or remove projects. Uploaded media is stored in your private Cloudflare R2 bucket.
          </p>
        </header>

        {notice && <p role="status" className="mt-5 rounded-lg border border-purple-200 bg-white px-4 py-3 text-sm text-purple-950">{notice}</p>}

        {loading ? (
          <div className="mt-10 flex items-center gap-2 text-sm text-neutral-600"><LoaderCircle className="h-4 w-4 animate-spin" /> Connecting to your admin…</div>
        ) : authorized === false ? (
          <section className="mt-8 rounded-2xl border border-purple-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold">Admin sign-in required</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
              Open this page on <a className="font-semibold text-purple-800 underline" href="https://aliciagiks4art.dpdns.org/admin">aliciagiks4art.dpdns.org/admin</a> and sign in with the email allowed by Cloudflare Access. If you already signed in, ask the site administrator to add your email to the admin allowlist.
            </p>
            <button type="button" onClick={() => void loadProjects()} className="mt-5 rounded-lg bg-purple-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-800">Try again</button>
          </section>
        ) : (
          <>
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
          </>
        )}
        <footer className="mt-12 border-t border-purple-200 py-5 text-xs text-neutral-500">Admin changes are saved to R2 and appear in the public project grid. Keep your Cloudflare Access account secure.</footer>
      </div>
    </main>
  );
};
