import React, { useState } from 'react';
import { Mail, MessageCircle, Copy, Check, Send, ArrowUpRight, Instagram, Github, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { CloudflareTurnstile } from './CloudflareTurnstile';
import { MagneticWrapper } from './MagneticWrapper';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [turnstileVerified, setTurnstileVerified] = useState(false);
  const [showTurnstileError, setShowTurnstileError] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    service: 'Motion Graphics & Animation',
    timeline: 'Within 2-4 weeks',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('aliciagiks@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileVerified) {
      setShowTurnstileError(true);
      return;
    }
    setShowTurnstileError(false);
    // Build mailto link so it functions in 100% static hosting without a server backend
    const subject = encodeURIComponent(`Project Inquiry: ${formState.service} - ${formState.name}`);
    const body = encodeURIComponent(
      `Hi Alicia,\n\nMy name is ${formState.name} (${formState.email}).\n\nProject Type: ${formState.service}\nTimeline: ${formState.timeline}\n\nProject Details:\n${formState.message}\n\nLooking forward to hearing from you!`
    );
    window.location.href = `mailto:aliciagiks@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 border-b border-purple-200/70 bg-[#FAF7FC]/80 backdrop-blur-xs relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="pb-10 border-b border-purple-100">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-900 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#420D58]" />
            <span className="font-semibold">Initiate Collaboration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
            Let&apos;s Build Something Bold
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 mt-2 max-w-xl">
            Tell me about your project, campaign, or motion vision — I usually reply within 24 hours.
          </p>
        </div>

        {/* 2-Column Split: Direct Channels + Interactive Inquiry Form */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left Column: Direct Contact Info */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Direct Channels
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                For fast turnaround inquiries, contract commissions, or general creative direction questions.
              </p>
            </div>

            {/* Email Card with 1-click copy */}
            <div className="p-4 rounded-xl border border-purple-200/80 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-purple-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#420D58]" />
                </div>
                <div>
                  <p className="text-2xs font-mono text-purple-700 font-semibold uppercase">Email Directly</p>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 font-mono">
                    aliciagiks@gmail.com
                  </p>
                </div>
              </div>

              <button
                type="button"
                data-cursor="copy"
                data-cursor-text="COPY EMAIL"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-purple-600" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* WhatsApp Card */}
            <div className="p-4 rounded-xl border border-purple-200/80 bg-white flex items-center justify-between gap-3 shadow-2xs hover:border-purple-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <p className="text-2xs font-mono text-emerald-700 font-semibold uppercase">WhatsApp Chat</p>
                  <p className="text-xs sm:text-sm font-semibold text-neutral-900 font-mono">
                    +254 768 795 272
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/254768795272?text=Hello%20Alicia%2C%20I%20saw%20your%20portfolio%20and%20would%20love%20to%20collaborate."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#420D58] to-[#7E22CE] hover:from-[#350A47] hover:to-[#6B21A8] rounded-md transition-all shadow-xs shadow-purple-900/25"
              >
                <span>Chat</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-2xs font-mono uppercase tracking-wider text-purple-800 font-semibold mb-3">
                Online Profiles &amp; Repositories
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/geeks4drisony/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-purple-200 bg-white text-xs font-medium text-neutral-800 hover:text-purple-950 hover:bg-purple-50 transition-colors shadow-2xs"
                >
                  <Instagram className="w-4 h-4 text-purple-600" />
                  <span>@geeks4drisony</span>
                </a>

                <a
                  href="https://github.com/aliciagiks-graphics/Aliciagiks4art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md border border-purple-200 bg-white text-xs font-medium text-neutral-800 hover:text-purple-950 hover:bg-purple-50 transition-colors shadow-2xs"
                >
                  <Github className="w-4 h-4 text-neutral-700" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

          </motion.div>

          {/* Right Column: Inquiry Form */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl border border-purple-200/90 bg-white space-y-5 shadow-xl shadow-purple-950/5"
            >
              <div>
                <h3 className="text-base font-bold text-neutral-900">
                  Project Inquiry Form
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Fill in your details below to generate a direct project brief.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name-input" className="block text-xs font-mono text-purple-950 font-medium mb-1.5">
                    Your Name / Company *
                  </label>
                  <input
                    id="name-input"
                    type="text"
                    required
                    placeholder="e.g. Maya Chen"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-purple-50/30 border border-purple-200 rounded-md focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email-input" className="block text-xs font-mono text-purple-950 font-medium mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    placeholder="e.g. maya@company.com"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-purple-50/30 border border-purple-200 rounded-md focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-neutral-900 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="service-select" className="block text-xs font-mono text-purple-950 font-medium mb-1.5">
                    Required Service
                  </label>
                  <select
                    id="service-select"
                    value={formState.service}
                    onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-purple-50/30 border border-purple-200 rounded-md focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-neutral-900 transition-colors"
                  >
                    <option>Motion Graphics &amp; Animation</option>
                    <option>Branding &amp; Visual Identity</option>
                    <option>Graphic &amp; Campaign Design</option>
                    <option>Custom Digital Illustration</option>
                    <option>Full Creative Direction Package</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="timeline-select" className="block text-xs font-mono text-purple-950 font-medium mb-1.5">
                    Estimated Timeline
                  </label>
                  <select
                    id="timeline-select"
                    value={formState.timeline}
                    onChange={(e) => setFormState({ ...formState, timeline: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-purple-50/30 border border-purple-200 rounded-md focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-neutral-900 transition-colors"
                  >
                    <option>Urgent (&lt; 2 weeks)</option>
                    <option>Within 2-4 weeks</option>
                    <option>Next Quarter (1-2 months)</option>
                    <option>Flexible / Ongoing retainer</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message-input" className="block text-xs font-mono text-purple-950 font-medium mb-1.5">
                  Project Brief &amp; Objectives *
                </label>
                <textarea
                  id="message-input"
                  required
                  rows={4}
                  placeholder="Share a brief overview of your deliverables, target audience, aesthetic reference, and any deadlines..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-purple-50/30 border border-purple-200 rounded-md focus:outline-hidden focus:border-purple-600 focus:ring-1 focus:ring-purple-600 text-neutral-900 transition-colors resize-none"
                />
              </div>

              {/* Cloudflare Turnstile human verification */}
              <div className="pt-1">
                <label className="block text-2xs font-mono uppercase text-purple-800 font-semibold mb-1.5">
                  Spam Protection &amp; Verification
                </label>
                <CloudflareTurnstile
                  verified={turnstileVerified}
                  onVerify={(val) => {
                    setTurnstileVerified(val);
                    if (val) setShowTurnstileError(false);
                  }}
                />
                {showTurnstileError && (
                  <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Please complete the Cloudflare Turnstile verification challenge.</span>
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <MagneticWrapper strength={0.25}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#420D58] via-[#5F1B68] to-[#7E22CE] hover:from-[#350A47] hover:to-[#6B21A8] rounded-md transition-all shadow-md shadow-purple-900/25 hover:shadow-lg hover:shadow-purple-900/35"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Project Inquiry</span>
                  </button>
                </MagneticWrapper>

                {submitted && (
                  <span className="text-xs text-purple-900 font-semibold bg-purple-100 px-2.5 py-1 rounded">
                    Draft prepared in your email client!
                  </span>
                )}
              </div>
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
