import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_SITE_CONTENT, mergeSiteContent, SiteContent } from '../data/siteContent';

const SiteContentContext = createContext<SiteContent>(DEFAULT_SITE_CONTENT);

export const SiteContentProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [content, setContent] = useState(DEFAULT_SITE_CONTENT);

  useEffect(() => {
    let cancelled = false;
    fetch('/site.json', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : null)
      .then((value) => {
        if (!cancelled && value) setContent(mergeSiteContent(value));
      })
      .catch(() => { /* The bundled content remains usable while the feed is unavailable. */ });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    document.title = content.seo.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = content.seo.description;
    const socialTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (socialTitle) socialTitle.content = content.seo.title;
    const socialDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (socialDescription) socialDescription.content = content.seo.description;
  }, [content.seo]);

  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
};

export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}
