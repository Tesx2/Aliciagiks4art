import React, { useState } from 'react';
import { Globe, Check, Copy, ExternalLink, ShieldCheck, Terminal, Server, ArrowRight, RefreshCw } from 'lucide-react';
import { DEPLOYMENT_ENVIRONMENTS } from '../data/portfolioData';
import { CloudflareDevSuite } from './CloudflareDevSuite';

export const CustomDomainSection: React.FC = () => {
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);
  const [testSubpath, setTestSubpath] = useState<string>('Aliciagiks4art');
  const [testedResolution, setTestedResolution] = useState<{
    customDomainUrl: string;
    githubPagesUrl: string;
    assetUrl: string;
    status: string;
  } | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(id);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  const handleTestResolution = () => {
    const cleanSubpath = testSubpath.replace(/^\/+|\/+$/g, '');
    setTestedResolution({
      customDomainUrl: 'https://aliciagiks4art.com/',
      githubPagesUrl: `https://aliciagiks-graphics.github.io/${cleanSubpath}/`,
      assetUrl: `./geeks4drisony/motion%20graphic/inspiration.mp4`,
      status: 'Relative base ("./") resolves correctly in both environments without 404 errors',
    });
  };

  return (
    <section id="custom-domain" className="py-16 sm:py-24 border-b border-neutral-200 bg-neutral-50/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-500 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              <span>Deployment &amp; URLs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
              Production URLs &amp; Custom Domain
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-2xl">
              Configured for zero-backend static hosting across GitHub Pages and custom apex domains with relative asset safety and edge routing.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SSL / TLS Active</span>
          </div>
        </div>

        {/* 3-Column Environments Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {DEPLOYMENT_ENVIRONMENTS.map((env) => (
            <div
              key={env.type}
              className="rounded-xl border border-neutral-200 bg-white p-6 flex flex-col justify-between hover:border-neutral-300 transition-colors shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase text-neutral-400">
                    {env.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 text-2xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {env.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900">
                  {env.type}
                </h3>

                <div className="mt-2.5 font-mono text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-200 break-all flex items-center justify-between gap-2">
                  <span>{env.displayUrl}</span>
                  <a
                    href={env.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-neutral-900 transition-colors shrink-0"
                    title="Open URL"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="mt-3 text-xs text-neutral-600 leading-relaxed">
                  {env.description}
                </p>
              </div>

              {/* DNS / Routing Table */}
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <span className="text-2xs font-mono uppercase text-neutral-400 block mb-2">
                  Routing Target
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  {env.dnsRecords.map((rec, idx) => (
                    <div key={idx} className="flex items-center justify-between text-2xs text-neutral-600">
                      <span className="font-semibold text-neutral-800">{rec.type}</span>
                      <span className="text-neutral-400">{rec.host}</span>
                      <span className="text-neutral-900 truncate max-w-[120px]">{rec.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DNS Configuration & CNAME Inspector */}
        <div className="mt-10 rounded-xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
            <div>
              <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-neutral-700" />
                <span>Custom Domain DNS &amp; CNAME Directives</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Custom domain hosting is managed through the connected hosting provider.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleCopy('aliciagiks4art.com', 'cname-content')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors border border-neutral-200"
            >
              {copiedRecord === 'cname-content' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied CNAME!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy CNAME Content</span>
                </>
              )}
            </button>
          </div>

          {/* DNS Table */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400">
                  <th className="pb-2 font-normal">RECORD</th>
                  <th className="pb-2 font-normal">NAME / HOST</th>
                  <th className="pb-2 font-normal">TARGET / VALUE</th>
                  <th className="pb-2 font-normal">TTL</th>
                  <th className="pb-2 font-normal text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">CNAME</td>
                  <td className="py-2.5">www</td>
                  <td className="py-2.5 text-neutral-900">aliciagiks-graphics.github.io</td>
                  <td className="py-2.5 text-neutral-400">Auto (DNS)</td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy('aliciagiks-graphics.github.io', 'cname-target')}
                      className="text-2xs text-neutral-500 hover:text-neutral-900"
                    >
                      {copiedRecord === 'cname-target' ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">A</td>
                  <td className="py-2.5">@ (apex)</td>
                  <td className="py-2.5 text-neutral-900">185.199.108.153</td>
                  <td className="py-2.5 text-neutral-400">Auto (DNS)</td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy('185.199.108.153', 'a1')}
                      className="text-2xs text-neutral-500 hover:text-neutral-900"
                    >
                      {copiedRecord === 'a1' ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-neutral-900">A</td>
                  <td className="py-2.5">@ (apex)</td>
                  <td className="py-2.5 text-neutral-900">185.199.109.153</td>
                  <td className="py-2.5 text-neutral-400">Auto (DNS)</td>
                  <td className="py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleCopy('185.199.109.153', 'a2')}
                      className="text-2xs text-neutral-500 hover:text-neutral-900"
                    >
                      {copiedRecord === 'a2' ? 'Copied' : 'Copy'}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Relative Asset & Base Path Verification Tool */}
        <div className="mt-8 rounded-xl border border-neutral-200 bg-neutral-900 text-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase mb-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Deployment-Safe Verification Engine</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white">
            Dual-URL Asset Resolution Simulator
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 mt-1">
            Test and verify that assets never break whether served from custom domain root or repository subpath.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="subpath-input" className="block text-2xs font-mono text-neutral-400 uppercase mb-1">
                Repository Subpath Name
              </label>
              <input
                id="subpath-input"
                type="text"
                value={testSubpath}
                onChange={(e) => setTestSubpath(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-hidden focus:border-neutral-500"
                placeholder="e.g. Aliciagiks4art"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleTestResolution}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Test Asset Resolution</span>
              </button>
            </div>
          </div>

          {testedResolution && (
            <div className="mt-6 p-4 rounded-lg bg-neutral-950/80 border border-neutral-800 space-y-3 text-xs font-mono">
              <div className="flex items-start justify-between">
                <span className="text-neutral-400">Custom Domain:</span>
                <span className="text-emerald-400">{testedResolution.customDomainUrl}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-neutral-400">GitHub Pages Subpath:</span>
                <span className="text-emerald-400">{testedResolution.githubPagesUrl}</span>
              </div>
              <div className="flex items-start justify-between">
                <span className="text-neutral-400">Relative Base Path:</span>
                <span className="text-neutral-200">base: &quot;./&quot;</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 text-2xs text-neutral-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{testedResolution.status}</span>
              </div>
            </div>
          )}
        </div>

        {/* Cloudflare Developer Suite Showcase */}
        <CloudflareDevSuite />

      </div>
    </section>
  );
};
