import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type MouseEvent,
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

function filterVisible<T extends { src: string }>(
  items: T[]
): T[] {
  return items.filter(
    (item) =>
      item.src !== 'PASTE_LINK_HERE' ||
      SHOW_EMPTY_SLOTS
  );
}

type TabId = 'social' | 'marketing';

const tabs: {
  id: TabId;
  label: Bilingual;
}[] = [
  {
    id: 'social',
    label: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },
  },
  {
    id: 'marketing',
    label: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },
  },
];

function SocialRail({
  lang,
}: {
  lang: Language;
}) {
  const tr = (v: Bilingual) => v[lang];
  const isAr = lang === 'ar';

  const railRef =
    useRef<HTMLDivElement>(null);

  const sectionRef =
    useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] =
    useState(0);

  const [lightboxIndex, setLightboxIndex] =
    useState<number | null>(null);

  const [lightboxError, setLightboxError] =
    useState(false);

  const [failed, setFailed] =
    useState<Record<string, boolean>>({});

  const [scrollProgress, setScrollProgress] =
    useState(0);

  const videoRefs =
    useRef<(HTMLVideoElement | null)[]>([]);

  const isReducedMotion =
    useRef(false);

  const dragMoved =
    useRef(false);

  const items =
    filterVisible(socialVideos);

  useEffect(() => {
    const mq = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    isReducedMotion.current = mq.matches;

    const handleChange = (
      event: MediaQueryListEvent
    ) => {
      isReducedMotion.current =
        event.matches;
    };

    mq.addEventListener(
      'change',
      handleChange
    );

    return () => {
      mq.removeEventListener(
        'change',
        handleChange
      );
    };
  }, []);

  const scrollToCard = useCallback(
    (index: number) => {
      const rail = railRef.current;

      if (!rail || !items[index]) {
        return;
      }

      const card =
        rail.children[index] as HTMLElement;

      if (!card) {
        return;
      }

      const left =
        card.offsetLeft -
        (rail.clientWidth -
          card.clientWidth) /
          2;

      rail.scrollTo({
        left,
        behavior: 'smooth',
      });
    },
    [items]
  );

  const handleScroll = useCallback(() => {
    const rail = railRef.current;

    if (!rail || items.length === 0) {
      return;
    }

    const scrollLeft =
      rail.scrollLeft;

    const maxScroll =
      rail.scrollWidth -
      rail.clientWidth;

    setScrollProgress(
      maxScroll > 0
        ? scrollLeft / maxScroll
        : 0
    );

    const center =
      scrollLeft +
      rail.clientWidth / 2;

    let closest = 0;
    let minDist = Infinity;

    Array.from(
      rail.children
    ).forEach((child, i) => {
      const el =
        child as HTMLElement;

      const elCenter =
        el.offsetLeft +
        el.clientWidth / 2;

      const dist =
        Math.abs(
          elCenter - center
        );

      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });

    setActiveIndex(closest);
  }, [items]);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });

        ticking = true;
      }
    };

    rail.addEventListener(
      'scroll',
      onScroll,
      {
        passive: true,
      }
    );

    return () => {
      rail.removeEventListener(
        'scroll',
        onScroll
      );
    };
  }, [handleScroll]);

  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                videoRefs.current.forEach(
                  (video) => {
                    if (video) {
                      video.pause();
                    }
                  }
                );
              } else {
                const activeVideo =
                  videoRefs.current[
                    activeIndex
                  ];

                if (
                  activeVideo &&
                  lightboxIndex === null &&
                  !isReducedMotion.current
                ) {
                  activeVideo
                    .play()
                    .catch(() => {});
                }
              }
            }
          );
        },
        {
          threshold: 0.15,
        }
      );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [
    activeIndex,
    lightboxIndex,
  ]);

  useEffect(() => {
    videoRefs.current.forEach(
      (video, index) => {
        if (!video) {
          return;
        }

        if (
          lightboxIndex !== null ||
          isReducedMotion.current
        ) {
          video.pause();
          return;
        }

        if (index === activeIndex) {
          video.muted = true;

          video.setAttribute(
            'muted',
            ''
          );

          video.setAttribute(
            'playsinline',
            '');

          video
            .play()
            .catch(() => {});
        } else {
          video.pause();

          try {
            video.currentTime = 0;
          } catch {
          }
        }
      }
    );
  }, [
    activeIndex,
    lightboxIndex,
  ]);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (
      event: PointerEvent
    ) => {
      isDown = true;

      dragMoved.current = false;

      startX = event.clientX;

      startScroll =
        rail.scrollLeft;
    };

    const onMove = (
      event: PointerEvent
    ) => {
      if (!isDown) {
        return;
      }

      const dx =
        event.clientX - startX;

      if (Math.abs(dx) > 6) {
        dragMoved.current = true;

        rail.style.cursor =
          'grabbing';
      }

      if (
        dragMoved.current &&
        event.pointerType === 'mouse'
      ) {
        event.preventDefault();

        rail.scrollLeft =
          startScroll - dx;
      }
    };

    const onUp = () => {
      isDown = false;

      rail.style.cursor = 'grab';
    };

    rail.addEventListener(
      'pointerdown',
      onDown
    );

    rail.addEventListener(
      'pointermove',
      onMove
    );

    rail.addEventListener(
      'pointerup',
      onUp
    );

    rail.addEventListener(
      'pointerleave',
      onUp
    );

    return () => {
      rail.removeEventListener(
        'pointerdown',
        onDown
      );

      rail.removeEventListener(
        'pointermove',
        onMove
      );

      rail.removeEventListener(
        'pointerup',
        onUp
      );

      rail.removeEventListener(
        'pointerleave',
        onUp
      );
    };
  }, []);

  const openLightbox = (
    index: number
  ) => {
    if (dragMoved.current) {
      return;
    }

    setLightboxError(false);

    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);

    setLightboxError(false);
  };

  const nextVideo = () => {
    setLightboxError(false);

    setLightboxIndex(
      (current) =>
        current === null
          ? null
          : (current + 1) %
            items.length
    );
  };

  const prevVideo = () => {
    setLightboxError(false);

    setLightboxIndex(
      (current) =>
        current === null
          ? null
          : (current - 1 + items.length) %
            items.length
    );
  };

  useEffect(() => {
    if (
      lightboxIndex === null
    ) {
      return;
    }

    const onKey = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (
        event.key === 'ArrowRight'
      ) {
        isAr
          ? prevVideo()
          : nextVideo();
      } else if (
        event.key === 'ArrowLeft'
      ) {
        isAr
          ? nextVideo()
          : prevVideo();
      }
    };

    document.addEventListener(
      'keydown',
      onKey
    );

    document.body.style.overflow =
      'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        onKey
      );

      document.body.style.overflow =
        '';
    };
  }, [
    lightboxIndex,
    isAr,
  ]);

  if (items.length === 0) {
    return (
      <EmptyState
        lang={lang}
      />
    );
  }

  return (
    <div
      className="social-rail-wrap"
      ref={sectionRef}
    >
      <div className="rail-controls">
        <button
          type="button"
          className="rail-arrow"
          onClick={() =>
            isAr
              ? scrollToCard(
                  Math.min(
                    activeIndex + 1,
                    items.length - 1
                  )
                )
              : scrollToCard(
                  Math.max(
                    activeIndex - 1,
                    0
                  )
                )
          }
          aria-label={
            isAr
              ? 'السابق'
              : 'Previous'
          }
        >
          <ArrowLeft size={18} />
        </button>

        <button
          type="button"
          className="rail-arrow"
          onClick={() =>
            isAr
              ? scrollToCard(
                  Math.max(
                    activeIndex - 1,
                    0
                  )
                )
              : scrollToCard(
                  Math.min(
                    activeIndex + 1,
                    items.length - 1
                  )
                )
          }
          aria-label={
            isAr
              ? 'التالي'
              : 'Next'
          }
        >
          <ArrowRight size={18} />
        </button>
      </div>

      <div
        className="reel-rail"
        ref={railRef}
      >
        {items.map(
          (item, i) => {
            const resolved =
              resolveMedia(
                item.src
              );

            const isEmpty =
              item.src ===
              'PASTE_LINK_HERE';

            const isActive =
              i === activeIndex;

            const isVertical =
              (item.ratio ||
                '9:16') ===
              '9:16';

            const thumb =
              item.poster ||
              resolved.thumb ||
              '';

            const isVideoFile =
              resolved.kind ===
                'mp4' ||
              resolved.kind ===
                'webm';

            const videoUrl =
              resolved.videoSrc ||
              item.src;

            const hasFailed =
              !!failed[item.id];

            return (
              <button
                type="button"
                className={`reel-card ${
                  isActive
                    ? 'active'
                    : ''
                } ${
                  isVertical
                    ? 'vertical'
                    : 'horizontal'
                } ${
                  isEmpty
                    ? 'empty'
                    : ''
                }`}
                key={item.id}
                onClick={() =>
                  isEmpty
                    ? undefined
                    : openLightbox(i)
                }
                aria-label={tr(
                  item.title
                )}
              >
                {isEmpty ? (
                  <div className="empty-slot">
                    <Plus
                      size={20}
                    />

                    <span>
                      {tr({
                        en: 'Add link',
                        ar: 'أضف الرابط',
                      })}
                    </span>
                  </div>
                ) : (
                  <>
                    {resolved.kind === 'drive-video' ? (
                      <iframe
                        src={resolved.embedUrl}
                        title={tr(item.title)}
                        className="reel-drive-video"
                        allow="autoplay; fullscreen"
                        allowFullScreen
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
                        autoPlay
                        loop
                        playsInline
                        preload="metadata"
                        controls={false}
                        disablePictureInPicture
                        onLoadedMetadata={(event) => {
                          const video = event.currentTarget;
                          video.muted = true;

                          if (
                            i === activeIndex &&
                            lightboxIndex === null &&
                            !isReducedMotion.current
                          ) {
                            video.play().catch(() => {});
                          }
                        }}
                        onCanPlay={(event) => {
                          const video = event.currentTarget;

                          if (
                            i === activeIndex &&
                            lightboxIndex === null &&
                            !isReducedMotion.current
                          ) {
                            video.play().catch(() => {});
                          }
                        }}
                        onError={() => {
                          console.error('Video failed to load:', {
                            id: item.id,
                            src: item.src,
                            resolved,
                            videoUrl,
                          });

                          setFailed((current) => ({
                            ...current,
                            [item.id]: true,
                          }));
                        }}
                      />
                    ) : thumb ? (
                      <img
                        src={thumb}
                        alt={tr(
                          item.title
                        )}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div
                        aria-hidden="true"
                        style={{
                          position:
                            'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(160deg, #3a352f, #171513)',
                        }}
                      />
                    )}

                    <div className="reel-overlay" />

                    <div className="play-badge">
                      <Play
                        size={16}
                        fill="currentColor"
                      />
                    </div>

                    <div className="reel-meta">
                      <span className="reel-label">
                        {tr({
                          en: 'Reel',
                          ar: 'ريلز',
                        })}
                      </span>

                      <strong>
                        {tr(
                          item.title
                        )}
                      </strong>

                      <span className="reel-cat">
                        {tr(
                          item.category
                        )}
                      </span>
                    </div>
                  </>
                )}
              </button>
            );
          }
        )}
      </div>

      <div className="rail-progress">
        <div
          className="rail-progress-fill"
          style={{
            width: `${Math.max(
              scrollProgress * 100,
              5
            )}%`,
          }}
        />
      </div>

      {lightboxIndex !==
        null &&
        items[lightboxIndex] &&
        (() => {
          const item =
            items[lightboxIndex];

          const resolved =
            resolveMedia(
              item.src
            );

          const isVertical =
            (item.ratio ||
              '9:16') ===
            '9:16';

          const isEmbed =
            resolved.kind ===
              'youtube' ||
            resolved.kind ===
              'drive-video';

          const isImage =
            resolved.kind ===
              'image' ||
            resolved.kind ===
              'drive-image';

          const videoUrl =
            resolved.videoSrc ||
            item.src;

          return (
            <div
              className="lightbox"
              role="presentation"
              onClick={
                closeLightbox
              }
            >
              <button
                type="button"
                className="lightbox-close"
                onClick={
                  closeLightbox
                }
                aria-label={
                  isAr
                    ? 'إغلاق'
                    : 'Close'
                }
              >
                <X size={24} />
              </button>

              <button
                type="button"
                className="lightbox-nav prev"
                onClick={(event) => {
                  event.stopPropagation();

                  isAr
                    ? nextVideo()
                    : prevVideo();
                }}
                aria-label={
                  isAr
                    ? 'التالي'
                    : 'Previous'
                }
              >
                <ArrowLeft
                  size={22}
                />
              </button>

              <button
                type="button"
                className="lightbox-nav next"
                onClick={(event) => {
                  event.stopPropagation();

                  isAr
                    ? prevVideo()
                    : nextVideo();
                }}
                aria-label={
                  isAr
                    ? 'السابق'
                    : 'Next'
                }
              >
                <ArrowRight
                  size={22}
                />
              </button>

              <div
                className={`lightbox-content ${
                  isVertical
                    ? 'vertical'
                    : 'horizontal'
                }`}
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                {isEmbed ? (
                  <iframe
                    key={item.id}
                    src={
                      resolved.embedUrl
                    }
                    title={tr(
                      item.title
                    )}
                    allow="autoplay; fullscreen; encrypted-media"
                    allowFullScreen
                  />
                ) : isImage ? (
                  <img
                    src={
                      item.poster ||
                      resolved.imgSrc ||
                      resolved.thumb ||
                      ''
                    }
                    alt={tr(
                      item.title
                    )}
                  />
                ) : lightboxError ? (
                  <div
                    style={{
                      color: '#fff',
                      padding:
                        '48px 24px',
                      textAlign:
                        'center',
                    }}
                  >
                    {tr({
                      en: 'This video could not be loaded. Make sure the URL is a direct MP4/WebM video link.',
                      ar: 'تعذر تحميل الفيديو. تأكد أن الرابط مباشر لملف MP4 أو WebM.',
                    })}
                  </div>
                ) : (
                  <video
                    key={item.id}
                    src={videoUrl}
                    poster={
                      item.poster ||
                      undefined
                    }
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    onCanPlay={(event) => {
                      event.currentTarget
                        .play()
                        .catch(
                          () => {}
                        );
                    }}
                    onError={() => {
                      console.error(
                        'Lightbox video failed:',
                        {
                          id: item.id,
                          src: item.src,
                          videoUrl,
                          resolved,
                        }
                      );

                      setLightboxError(
                        true
                      );
                    }}
                  />
                )}

                <div className="lightbox-caption">
                  <strong>
                    {tr(
                      item.title
                    )}
                  </strong>

                  <span>
                    {tr(
                      item.category
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

function MarketingGrid({
  lang,
}: {
  lang: Language;
}) {
  const tr = (v: Bilingual) => v[lang];
  const isAr = lang === 'ar';

  const [subFilter, setSubFilter] =
    useState<
      'all' | 'logo' | 'design'
    >('all');

  const [lightboxIndex, setLightboxIndex] =
    useState<number | null>(null);

  const gridRef =
    useRef<HTMLDivElement>(null);

  const allItems =
    filterVisible(
      marketingWorks
    );

  const items =
    subFilter === 'all'
      ? allItems
      : allItems.filter(
          (item) =>
            item.kind ===
            subFilter
        );

  const subFilters: {
    id:
      | 'all'
      | 'logo'
      | 'design';
    label: Bilingual;
  }[] = [
    {
      id: 'all',
      label: {
        en: 'All',
        ar: 'الكل',
      },
    },
    {
      id: 'logo',
      label: {
        en: 'Logos',
        ar: 'لوجوهات',
      },
    },
    {
      id: 'design',
      label: {
        en: 'Designs',
        ar: 'تصاميم',
      },
    },
  ];

  const openLightbox = (
    index: number
  ) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextItem = () => {
    setLightboxIndex(
      (current) =>
        current === null
          ? null
          : (current + 1) %
            items.length
    );
  };

  const prevItem = () => {
    setLightboxIndex(
      (current) =>
        current === null
          ? null
          : (current - 1 + items.length) %
            items.length
    );
  };

  useEffect(() => {
    if (
      lightboxIndex === null
    ) {
      return;
    }

    const onKey = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (
        event.key === 'ArrowRight'
      ) {
        isAr
          ? prevItem()
          : nextItem();
      } else if (
        event.key === 'ArrowLeft'
      ) {
        isAr
          ? nextItem()
          : prevItem();
      }
    };

    document.addEventListener(
      'keydown',
      onKey
    );

    document.body.style.overflow =
      'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        onKey
      );

      document.body.style.overflow =
        '';
    };
  }, [
    lightboxIndex,
    isAr,
  ]);

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    const element =
      event.currentTarget;

    const rect =
      element.getBoundingClientRect();

    const x =
      (event.clientX -
        rect.left) /
        rect.width -
      0.5;

    const y =
      (event.clientY -
        rect.top) /
        rect.height -
      0.5;

    element.style.transform = `
      perspective(900px)
      rotateY(${x * 8}deg)
      rotateX(${-y * 8}deg)
      scale(1.02)
    `;

    element.style.setProperty(
      '--mx',
      `${(x + 0.5) * 100}%`
    );

    element.style.setProperty(
      '--my',
      `${(y + 0.5) * 100}%`
    );
  };

  const handleMouseLeave = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    event.currentTarget.style.transform =
      '';
  };

  if (allItems.length === 0) {
    return (
      <EmptyState
        lang={lang}
      />
    );
  }

  return (
    <div className="marketing-wrap">
      <div className="sub-filter-row">
        {subFilters.map(
          (filter) => (
            <button
              type="button"
              key={filter.id}
              className={
                subFilter ===
                filter.id
                  ? 'sub-filter active'
                  : 'sub-filter'
              }
              onClick={() =>
                setSubFilter(
                  filter.id
                )
              }
            >
              {tr(
                filter.label
              )}
            </button>
          )
        )}
      </div>

      <div
        className="marketing-grid"
        ref={gridRef}
      >
        {items.map(
          (item, i) => {
            const resolved =
              resolveMedia(
                item.src
              );

            const isEmpty =
              item.src ===
              'PASTE_LINK_HERE';

            const isLogo =
              item.kind === 'logo';

            const size =
              item.size ||
              'standard';

            return (
              <div
                className={`mk-tile ${size} ${
                  isLogo
                    ? 'logo'
                    : 'design'
                } ${
                  isEmpty
                    ? 'empty'
                    : ''
                }`}
                key={item.id}
                onMouseMove={(event) =>
                  !isEmpty &&
                  handleMouseMove(
                    event
                  )
                }
                onMouseLeave={
                  handleMouseLeave
                }
                onClick={() =>
                  isEmpty
                    ? undefined
                    : openLightbox(i)
                }
                role="button"
                tabIndex={0}
                style={{
                  animationDelay: `${Math.min(
                    i * 60,
                    600
                  )}ms`,
                }}
                onKeyDown={(event) => {
                  if (
                    event.key ===
                      'Enter' &&
                    !isEmpty
                  ) {
                    openLightbox(i);
                  }
                }}
              >
                {isEmpty ? (
                  <div className="empty-slot">
                    <Plus
                      size={20}
                    />

                    <span>
                      {tr({
                        en: 'Add link',
                        ar: 'أضف الرابط',
                      })}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="mk-glow" />

                    {resolved.kind ===
                      'image' ||
                    resolved.kind ===
                      'drive-image' ? (
                      <img
                        src={
                          resolved.imgSrc ||
                          ''
                        }
                        alt={tr(
                          item.title
                        )}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}

                    <div className="mk-border" />

                    <div className="mk-info">
                      <strong>
                        {tr(
                          item.title
                        )}
                      </strong>

                      <span>
                        {tr(
                          item.category
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          }
        )}
      </div>

      {lightboxIndex !==
        null &&
        items[lightboxIndex] &&
        (() => {
          const item =
            items[lightboxIndex];

          const resolved =
            resolveMedia(
              item.src
            );

          return (
            <div
              className="lightbox"
              role="presentation"
              onClick={
                closeLightbox
              }
            >
              <button
                type="button"
                className="lightbox-close"
                onClick={
                  closeLightbox
                }
                aria-label={
                  isAr
                    ? 'إغلاق'
                    : 'Close'
                }
              >
                <X size={24} />
              </button>

              <button
                type="button"
                className="lightbox-nav prev"
                onClick={(event) => {
                  event.stopPropagation();

                  isAr
                    ? nextItem()
                    : prevItem();
                }}
                aria-label={
                  isAr
                    ? 'التالي'
                    : 'Previous'
                }
              >
                <ArrowLeft
                  size={22}
                />
              </button>

              <button
                type="button"
                className="lightbox-nav next"
                onClick={(event) => {
                  event.stopPropagation();

                  isAr
                    ? prevItem()
                    : nextItem();
                }}
                aria-label={
                  isAr
                    ? 'السابق'
                    : 'Next'
                }
              >
                <ArrowRight
                  size={22}
                />
              </button>

              <div
                className="lightbox-content image-lightbox"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <img
                  src={
                    resolved.imgSrc ||
                    ''
                  }
                  alt={tr(
                    item.title
                  )}
                />

                <div className="lightbox-caption">
                  <strong>
                    {tr(
                      item.title
                    )}
                  </strong>

                  <span>
                    {tr(
                      item.category
                    )}
                  </span>

                  <a
                    className="text-link"
                    href={`${WHATSAPP}?text=${encodeURIComponent(
                      tr({
                        en: `Hello UFUK, I would like to discuss the ${item.title.en} project.`,
                        ar: `مرحباً أفق، أرغب في مناقشة مشروع ${item.title.ar}.`,
                      })
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {tr({
                      en: 'Discuss a project',
                      ar: 'ناقش مشروعاً',
                    })}

                    <ArrowUpRight
                      size={16}
                    />
                  </a>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

function EmptyState({
  lang,
}: {
  lang: Language;
}) {
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

export default function WorkSection({
  lang,
}: {
  lang: Language;
}) {
  const tr = (v: Bilingual) => v[lang];

  const isAr = lang === 'ar';

  const [activeTab, setActiveTab] =
    useState<TabId>('social');

  const [panelDirection, setPanelDirection] =
    useState<1 | -1>(1);

  const [panelKey, setPanelKey] =
    useState(0);

  const tabRefs =
    useRef<
      (HTMLButtonElement | null)[]
    >([]);

  const [
    indicatorStyle,
    setIndicatorStyle,
  ] = useState<{
    left: number;
    width: number;
  }>({
    left: 0,
    width: 0,
  });

  const counts: Record<
    TabId,
    number
  > = {
    social:
      filterVisible(
        socialVideos
      ).length,

    marketing:
      filterVisible(
        marketingWorks
      ).length,
  };

  const handleTabChange = (
    tab: TabId,
    index: number
  ) => {
    const tabsOrder: TabId[] = [
      'social',
      'marketing',
    ];

    const currentIndex =
      tabsOrder.indexOf(
        activeTab
      );

    setPanelDirection(
      index > currentIndex
        ? 1
        : -1
    );

    setActiveTab(tab);

    setPanelKey(
      (current) => current + 1
    );
  };

  useEffect(() => {
    const activeButton =
      tabRefs.current[
        tabs.findIndex(
          (tab) =>
            tab.id === activeTab
        )
      ];

    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }
  }, [
    activeTab,
    lang,
  ]);

  return (
    <section
      id="work"
      className="section-cream work-section"
    >
      <div className="container">
        <div
          className="work-header"
          data-reveal
        >
          <div>
            <div className="section-label">
              <span>06</span>

              <span>
                {tr({
                  en: 'Selected work',
                  ar: 'أعمال مختارة',
                })}
              </span>
            </div>

            <h2>
              {isAr ? (
                <>
                  <span className="h1-line">
                    أعمال
                  </span>

                  <span className="h1-line">
                    تتحدث.
                  </span>
                </>
              ) : (
                <>
                  <span className="h1-line">
                    Work that
                  </span>

                  <span className="h1-line">
                    speaks.
                  </span>
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

        <div
          className="work-tabs"
          data-reveal
        >
          <div className="work-tabs-track">
            <span
              className="tab-indicator"
              style={{
                left:
                  indicatorStyle.left,
                width:
                  indicatorStyle.width,
              }}
            />

            {tabs.map(
              (tab, i) => (
                <button
                  type="button"
                  key={tab.id}
                  ref={(element) => {
                    tabRefs.current[
                      i
                    ] = element;
                  }}
                  className={
                    activeTab ===
                    tab.id
                      ? 'work-tab active'
                      : 'work-tab'
                  }
                  onClick={() =>
                    handleTabChange(
                      tab.id,
                      i
                    )
                  }
                >
                  {tr(
                    tab.label
                  )}

                  <span className="tab-count">
                    {counts[
                      tab.id
                    ]}
                  </span>
                </button>
              )
            )}
          </div>
        </div>

        <div
          className={`work-panel ${
            panelDirection === 1
              ? 'slide-in-ltr'
              : 'slide-in-rtl'
          }`}
          key={panelKey}
        >
          {activeTab ===
            'social' && (
            <SocialRail
              lang={lang}
            />
          )}

          {activeTab ===
            'marketing' && (
            <MarketingGrid
              lang={lang}
            />
          )}
        </div>
      </div>
    </section>
  );
}