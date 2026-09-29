import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  type MouseEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Play,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';

import {
  SHOW_EMPTY_SLOTS,
  resolveMedia,
  socialVideos,
  marketingWorks,
  type Bilingual,
} from '@/data/works';

type Language = 'en' | 'ar';

const WHATSAPP = 'https://wa.me/201015158464';

function filterVisible<T extends { src: string }>(items: T[]): T[] {
  return items.filter(
    (item) => item.src !== 'PASTE_LINK_HERE' || SHOW_EMPTY_SLOTS
  );
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type TabId = 'social' | 'marketing';

const tabs: { id: TabId; label: Bilingual }[] = [
  { id: 'social', label: { en: 'Social Media', ar: 'سوشيال ميديا' } },
  { id: 'marketing', label: { en: 'Digital Marketing', ar: 'التسويق الرقمي' } },
];

/* ------------------------------------------------------------------ */
/* Shared Lightbox                                                     */
/* ------------------------------------------------------------------ */

function Lightbox({
  isAr,
  onClose,
  onPrev,
  onNext,
  contentClass,
  children,
}: {
  isAr: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  contentClass: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const handlers = useRef({ onClose, onPrev, onNext });
  handlers.current = { onClose, onPrev, onNext };

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      const { onClose, onPrev, onNext } = handlers.current;

      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        isAr ? onPrev() : onNext();
      } else if (event.key === 'ArrowLeft') {
        isAr ? onNext() : onPrev();
      } else if (event.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], video[controls], iframe, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previouslyFocused?.focus?.();
    };
  }, [isAr]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={dialogRef}
      onClick={onClose}
    >
      <button
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label={isAr ? 'إغلاق' : 'Close'}
      >
        <X size={24} />
      </button>

      <button
        type="button"
        className="lightbox-nav prev"
        onClick={(event) => {
          event.stopPropagation();
          isAr ? onNext() : onPrev();
        }}
        aria-label={isAr ? 'التالي' : 'Previous'}
      >
        <ArrowLeft size={22} />
      </button>

      <button
        type="button"
        className="lightbox-nav next"
        onClick={(event) => {
          event.stopPropagation();
          isAr ? onPrev() : onNext();
        }}
        aria-label={isAr ? 'السابق' : 'Next'}
      >
        <ArrowRight size={22} />
      </button>

      <div
        className={contentClass}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Social rail                                                         */
/* ------------------------------------------------------------------ */

function SocialRail({ lang }: { lang: Language }) {
  const tr = (v: Bilingual) => v[lang];
  const isAr = lang === 'ar';

  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const dragMoved = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxError, setLightboxError] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);

  const items = useMemo(() => filterVisible(socialVideos), []);

  const scrollToCard = useCallback(
    (index: number) => {
      const rail = railRef.current;
      if (!rail || !items[index]) return;
      const card = rail.children[index] as HTMLElement | undefined;
      if (!card) return;
      card.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    },
    [items]
  );

  const handleScroll = useCallback(() => {
    const rail = railRef.current;
    if (!rail || items.length === 0) return;

    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const progress =
      maxScroll > 0 ? Math.min(Math.abs(rail.scrollLeft) / maxScroll, 1) : 0;
    setScrollProgress(progress);

    const railRect = rail.getBoundingClientRect();
    const center = railRect.left + railRect.width / 2;

    let closest = 0;
    let minDist = Infinity;

    Array.from(rail.children).forEach((child, i) => {
      const rect = (child as HTMLElement).getBoundingClientRect();
      const dist = Math.abs(rect.left + rect.width / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    setActiveIndex(closest);
  }, [items]);

  // Scroll listener
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    };

    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => rail.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  // Pause everything when the section leaves the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            videoRefs.current.forEach((video) => video?.pause());
          } else {
            const activeVideo = videoRefs.current[activeIndex];
            if (activeVideo && lightboxIndex === null && !prefersReducedMotion()) {
              activeVideo.play().catch(() => {});
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [activeIndex, lightboxIndex]);

  // Only the active card plays
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (lightboxIndex !== null || prefersReducedMotion()) {
        video.pause();
        return;
      }

      if (index === activeIndex) {
        video.muted = true;
        video.setAttribute('playsinline', '');
        video.play().catch(() => {});
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    });
  }, [activeIndex, lightboxIndex]);

  // Mouse drag to scroll
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      isDown = true;
      dragMoved.current = false;
      startX = event.clientX;
      startScroll = rail.scrollLeft;
    };

    const onMove = (event: PointerEvent) => {
      if (!isDown) return;
      const dx = event.clientX - startX;

      if (!dragMoved.current && Math.abs(dx) > 6) {
        dragMoved.current = true;
        rail.style.cursor = 'grabbing';
        rail.style.scrollSnapType = 'none';
      }

      if (dragMoved.current) {
        event.preventDefault();
        rail.scrollLeft = startScroll - dx;
      }
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      rail.style.cursor = 'grab';
      rail.style.scrollSnapType = '';
    };

    rail.addEventListener('pointerdown', onDown);
    rail.addEventListener('pointermove', onMove);
    rail.addEventListener('pointerup', onUp);
    rail.addEventListener('pointercancel', onUp);
    rail.addEventListener('pointerleave', onUp);

    return () => {
      rail.removeEventListener('pointerdown', onDown);
      rail.removeEventListener('pointermove', onMove);
      rail.removeEventListener('pointerup', onUp);
      rail.removeEventListener('pointercancel', onUp);
      rail.removeEventListener('pointerleave', onUp);
    };
  }, []);

  const openLightbox = (index: number) => {
    if (dragMoved.current) return;
    setLightboxError(false);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setLightboxError(false);
  };

  const nextVideo = () => {
    setLightboxError(false);
    setLightboxIndex((c) => (c === null ? null : (c + 1) % items.length));
  };

  const prevVideo = () => {
    setLightboxError(false);
    setLightboxIndex((c) =>
      c === null ? null : (c - 1 + items.length) % items.length
    );
  };

  if (items.length === 0) return <EmptyState lang={lang} />;

  const goLeft = () =>
    scrollToCard(
      isAr
        ? Math.min(activeIndex + 1, items.length - 1)
        : Math.max(activeIndex - 1, 0)
    );

  const goRight = () =>
    scrollToCard(
      isAr
        ? Math.max(activeIndex - 1, 0)
        : Math.min(activeIndex + 1, items.length - 1)
    );

  const lbItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div className="social-rail-wrap" ref={sectionRef}>
      <div className="rail-controls">
        <button
          type="button"
          className="rail-arrow"
          onClick={goLeft}
          aria-label={isAr ? 'التالي' : 'Previous'}
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          className="rail-arrow"
          onClick={goRight}
          aria-label={isAr ? 'السابق' : 'Next'}
        >
          <ArrowRight size={18} />
        </button>
      </div>

      <div className="reel-rail" ref={railRef}>
        {items.map((item, i) => {
          const resolved = resolveMedia(item.src);
          const isEmpty = item.src === 'PASTE_LINK_HERE';
          const isActive = i === activeIndex;
          const isVertical = (item.ratio || '9:16') === '9:16';
          const thumb = item.poster || resolved.thumb || '';
          const isVideoFile = resolved.kind === 'mp4' || resolved.kind === 'webm';
          const videoUrl = resolved.videoSrc || item.src;
          const hasFailed = !!failed[item.id];

          const open = () => (isEmpty ? undefined : openLightbox(i));

          return (
            <div
              role="button"
              tabIndex={0}
              className={`reel-card ${isActive ? 'active' : ''} ${
                isVertical ? 'vertical' : 'horizontal'
              } ${isEmpty ? 'empty' : ''}`}
              key={item.id}
              onClick={open}
              onKeyDown={(event: ReactKeyboardEvent) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  open();
                }
              }}
              aria-label={tr(item.title)}
            >
              {isEmpty ? (
                <div className="empty-slot">
                  <Plus size={20} />
                  <span>{tr({ en: 'Add link', ar: 'أضف الرابط' })}</span>
                </div>
              ) : (
                <>
                  {resolved.kind === 'drive-video' && isActive ? (
                    <iframe
                      src={resolved.embedUrl}
                      title={tr(item.title)}
                      className="reel-drive-video"
                      allow="autoplay; fullscreen"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        border: 0,
                        pointerEvents: 'none',
                      }}
                    />
                  ) : isVideoFile && !hasFailed ? (
                    <video
                      ref={(element) => {
                        videoRefs.current[i] = element;
                      }}
                      src={videoUrl}
                      poster={item.poster || undefined}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      controls={false}
                      disablePictureInPicture
                      onCanPlay={(event) => {
                        const video = event.currentTarget;
                        video.muted = true;
                        if (
                          i === activeIndex &&
                          lightboxIndex === null &&
                          !prefersReducedMotion()
                        ) {
                          video.play().catch(() => {});
                        }
                      }}
                      onError={() => {
                        console.error('Video failed to load:', {
                          id: item.id,
                          src: item.src,
                          videoUrl,
                        });
                        setFailed((current) => ({ ...current, [item.id]: true }));
                      }}
                    />
                  ) : thumb ? (
                    <img
                      src={thumb}
                      alt={tr(item.title)}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(160deg, #3a352f, #171513)',
                      }}
                    />
                  )}

                  <div className="reel-overlay" />

                  <div className="play-badge">
                    <Play size={16} fill="currentColor" />
                  </div>

                  <div className="reel-meta">
                    <span className="reel-label">
                      {tr({ en: 'Reel', ar: 'ريلز' })}
                    </span>
                    <strong>{tr(item.title)}</strong>
                    <span className="reel-cat">{tr(item.category)}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="rail-progress">
        <div
          className="rail-progress-fill"
          style={{ width: `${Math.max(scrollProgress * 100, 5)}%` }}
        />
      </div>

      {lbItem &&
        (() => {
          const resolved = resolveMedia(lbItem.src);
          const isVertical = (lbItem.ratio || '9:16') === '9:16';
          const isEmbed =
            resolved.kind === 'youtube' || resolved.kind === 'drive-video';
          const isImage =
            resolved.kind === 'image' || resolved.kind === 'drive-image';
          const videoUrl = resolved.videoSrc || lbItem.src;

          return (
            <Lightbox
              isAr={isAr}
              onClose={closeLightbox}
              onPrev={prevVideo}
              onNext={nextVideo}
              contentClass={`lightbox-content ${
                isVertical ? 'vertical' : 'horizontal'
              }`}
            >
              {isEmbed ? (
                <iframe
                  key={lbItem.id}
                  src={resolved.embedUrl}
                  title={tr(lbItem.title)}
                  allow="autoplay; fullscreen; encrypted-media"
                  allowFullScreen
                />
              ) : isImage ? (
                <img
                  src={lbItem.poster || resolved.imgSrc || resolved.thumb || ''}
                  alt={tr(lbItem.title)}
                />
              ) : lightboxError ? (
                <div
                  style={{
                    color: '#fff',
                    padding: '48px 24px',
                    textAlign: 'center',
                  }}
                >
                  {tr({
                    en: 'This video could not be loaded. Make sure the URL is a direct MP4/WebM video link.',
                    ar: 'تعذر تحميل الفيديو. تأكد أن الرابط مباشر لملف MP4 أو WebM.',
                  })}
                </div>
              ) : (
                <video
                  key={lbItem.id}
                  src={videoUrl}
                  poster={lbItem.poster || undefined}
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  onError={() => {
                    console.error('Lightbox video failed:', {
                      id: lbItem.id,
                      src: lbItem.src,
                      videoUrl,
                    });
                    setLightboxError(true);
                  }}
                />
              )}

              <div className="lightbox-caption">
                <strong>{tr(lbItem.title)}</strong>
                <span>{tr(lbItem.category)}</span>
              </div>
            </Lightbox>
          );
        })()}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marketing grid                                                      */
/* ------------------------------------------------------------------ */

function MarketingGrid({ lang }: { lang: Language }) {
  const tr = (v: Bilingual) => v[lang];
  const isAr = lang === 'ar';

  const [subFilter, setSubFilter] = useState<'all' | 'logo' | 'design'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allItems = useMemo(() => filterVisible(marketingWorks), []);

  const items = useMemo(
    () =>
      subFilter === 'all'
        ? allItems
        : allItems.filter((item) => item.kind === subFilter),
    [allItems, subFilter]
  );

  const subFilters: { id: 'all' | 'logo' | 'design'; label: Bilingual }[] = [
    { id: 'all', label: { en: 'All', ar: 'الكل' } },
    { id: 'logo', label: { en: 'Logos', ar: 'لوجوهات' } },
    { id: 'design', label: { en: 'Designs', ar: 'تصاميم' } },
  ];

  const closeLightbox = () => setLightboxIndex(null);

  const nextItem = () =>
    setLightboxIndex((c) => (c === null ? null : (c + 1) % items.length));

  const prevItem = () =>
    setLightboxIndex((c) =>
      c === null ? null : (c - 1 + items.length) % items.length
    );

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;

    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    element.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${
      -y * 8
    }deg) scale(1.02)`;
    element.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    element.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.transform = '';
  };

  if (allItems.length === 0) return <EmptyState lang={lang} />;

  const lbItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <div className="marketing-wrap">
      <div className="sub-filter-row">
        {subFilters.map((filter) => (
          <button
            type="button"
            key={filter.id}
            className={subFilter === filter.id ? 'sub-filter active' : 'sub-filter'}
            onClick={() => {
              setSubFilter(filter.id);
              setLightboxIndex(null);
            }}
          >
            {tr(filter.label)}
          </button>
        ))}
      </div>

      <div className="marketing-grid">
        {items.map((item, i) => {
          const resolved = resolveMedia(item.src);
          const isEmpty = item.src === 'PASTE_LINK_HERE';
          const isLogo = item.kind === 'logo';
          const size = item.size || 'standard';
          const open = () => (isEmpty ? undefined : setLightboxIndex(i));

          return (
            <div
              className={`mk-tile ${size} ${isLogo ? 'logo' : 'design'} ${
                isEmpty ? 'empty' : ''
              }`}
              key={item.id}
              onMouseMove={(event) => !isEmpty && handleMouseMove(event)}
              onMouseLeave={handleMouseLeave}
              onClick={open}
              role="button"
              tabIndex={0}
              aria-label={tr(item.title)}
              style={{ animationDelay: `${Math.min(i * 60, 600)}ms` }}
              onKeyDown={(event) => {
                if ((event.key === 'Enter' || event.key === ' ') && !isEmpty) {
                  event.preventDefault();
                  open();
                }
              }}
            >
              {isEmpty ? (
                <div className="empty-slot">
                  <Plus size={20} />
                  <span>{tr({ en: 'Add link', ar: 'أضف الرابط' })}</span>
                </div>
              ) : (
                <>
                  <div className="mk-glow" />

                  {resolved.kind === 'image' || resolved.kind === 'drive-image' ? (
                    <img
                      src={resolved.imgSrc || ''}
                      alt={tr(item.title)}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}

                  <div className="mk-border" />

                  <div className="mk-info">
                    <strong>{tr(item.title)}</strong>
                    <span>{tr(item.category)}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {lbItem &&
        (() => {
          const resolved = resolveMedia(lbItem.src);

          return (
            <Lightbox
              isAr={isAr}
              onClose={closeLightbox}
              onPrev={prevItem}
              onNext={nextItem}
              contentClass="lightbox-content image-lightbox"
            >
              <img src={resolved.imgSrc || ''} alt={tr(lbItem.title)} />

              <div className="lightbox-caption">
                <strong>{tr(lbItem.title)}</strong>
                <span>{tr(lbItem.category)}</span>

                <a
                  className="text-link"
                  href={`${WHATSAPP}?text=${encodeURIComponent(
                    tr({
                      en: `Hello UFUK, I would like to discuss the ${lbItem.title.en} project.`,
                      ar: `مرحباً أفق، أرغب في مناقشة مشروع ${lbItem.title.ar}.`,
                    })
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {tr({ en: 'Discuss a project', ar: 'ناقش مشروعاً' })}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </Lightbox>
          );
        })()}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

function EmptyState({ lang }: { lang: Language }) {
  const tr = (v: Bilingual) => v[lang];

  return (
    <div className="work-empty">
      <Sparkles size={20} />
      <span>
        {tr({
          en: 'This space is ready for approved UFUK projects.',
          ar: 'هذه المساحة جاهزة لاستقبال مشاريع أفق المعتمدة.',
        })}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export default function WorkSection({ lang }: { lang: Language }) {
  const tr = (v: Bilingual) => v[lang];
  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] = useState<TabId>('social');
  const [panelDirection, setPanelDirection] = useState<1 | -1>(1);
  const [panelKey, setPanelKey] = useState(0);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const counts = useMemo<Record<TabId, number>>(
    () => ({
      social: filterVisible(socialVideos).length,
      marketing: filterVisible(marketingWorks).length,
    }),
    []
  );

  const handleTabChange = (tab: TabId, index: number) => {
    if (tab === activeTab) return;
    const currentIndex = tabs.findIndex((t) => t.id === activeTab);
    setPanelDirection(index > currentIndex ? 1 : -1);
    setActiveTab(tab);
    setPanelKey((current) => current + 1);
  };

  useEffect(() => {
    const update = () => {
      const activeButton =
        tabRefs.current[tabs.findIndex((tab) => tab.id === activeTab)];
      if (activeButton) {
        setIndicatorStyle({
          left: activeButton.offsetLeft,
          width: activeButton.offsetWidth,
        });
      }
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [activeTab, lang]);

  return (
    <section id="work" className="section-cream work-section">
      <div className="container">
        <div className="work-header" data-reveal>
          <div>
            <div className="section-label">
              <span>06</span>
              <span>{tr({ en: 'Selected work', ar: 'أعمال مختارة' })}</span>
            </div>

            <h2>
              {isAr ? (
                <>
                  <span className="h1-line">أعمال</span>
                  <span className="h1-line">تتحدث.</span>
                </>
              ) : (
                <>
                  <span className="h1-line">Work that</span>
                  <span className="h1-line">speaks.</span>
                </>
              )}
            </h2>
          </div>

          <p>
            {tr({
              en: 'Reels and brand identities we have built.',
              ar: 'ريلز وهويات صممناها ونفذناها.',
            })}
          </p>
        </div>

        <div className="work-tabs" data-reveal>
          <div className="work-tabs-track">
            <span
              className="tab-indicator"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
            />

            {tabs.map((tab, i) => (
              <button
                type="button"
                key={tab.id}
                ref={(element) => {
                  tabRefs.current[i] = element;
                }}
                className={activeTab === tab.id ? 'work-tab active' : 'work-tab'}
                onClick={() => handleTabChange(tab.id, i)}
              >
                {tr(tab.label)}
                <span className="tab-count">{counts[tab.id]}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          className={`work-panel ${
            panelDirection === 1 ? 'slide-in-ltr' : 'slide-in-rtl'
          }`}
          key={panelKey}
        >
          {activeTab === 'social' && <SocialRail lang={lang} />}
          {activeTab === 'marketing' && <MarketingGrid lang={lang} />}
        </div>
      </div>
    </section>
  );
}