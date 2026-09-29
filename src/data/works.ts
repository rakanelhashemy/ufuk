export const SHOW_EMPTY_SLOTS = true;

export type Bilingual = { en: string; ar: string };

export type SocialVideo = {
  id: string;
  src: string;
  title: Bilingual;
  category: Bilingual;
  poster?: string;
  ratio?: '9:16' | '16:9';
};

export type MarketingWork = {
  id: string;
  src: string;
  title: Bilingual;
  category: Bilingual;
  kind: 'logo' | 'design';
  size?: 'standard' | 'tall' | 'wide';
};

export type WebsiteWork = {
  id: string;
  src: string;
  title: Bilingual;
  category: Bilingual;
  siteUrl?: string;
};

export type ResolvedMedia = {
  kind: 'youtube' | 'drive-video' | 'drive-image' | 'mp4' | 'webm' | 'image';
  embedUrl?: string;
  thumb?: string;
  videoSrc?: string;
  imgSrc?: string;
};

export function resolveMedia(src: string): ResolvedMedia {
  if (!src || src === 'PASTE_LINK_HERE') {
    return { kind: 'image' };
  }

  const ytMatch = src.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/
  );
  if (ytMatch) {
    const id = ytMatch[1];
    return {
      kind: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`,
      thumb: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const driveFileMatch = src.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (driveFileMatch) {
    const id = driveFileMatch[1];
    return {
      kind: 'drive-video',
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      thumb: `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
    };
  }

  const driveOpenMatch = src.match(/drive\.google\.com\/open\?id=([\w-]+)/);
  if (driveOpenMatch) {
    const id = driveOpenMatch[1];
    return {
      kind: 'drive-image',
      imgSrc: `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    };
  }

  const driveUcMatch = src.match(
    /drive\.google\.com\/uc\?(?:export=[^&]+&)?id=([\w-]+)/
  );
  if (driveUcMatch) {
    const id = driveUcMatch[1];
    return {
      kind: 'drive-video',
      embedUrl: `https://drive.google.com/file/d/${id}/preview`,
      thumb: `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
    };
  }

  if (/\.mp4(?:\?.*)?$/i.test(src)) return { kind: 'mp4', videoSrc: src };
  if (/\.webm(?:\?.*)?$/i.test(src)) return { kind: 'webm', videoSrc: src };

  return { kind: 'image', imgSrc: src };
}

// ============================================================
// SOCIAL MEDIA
// ============================================================

const socialCategory: Bilingual = { en: 'Social Media', ar: 'سوشيال ميديا' };

const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;

export const socialVideos: SocialVideo[] = [
  {
    id: 'sv01',
    src: drive('1vFn1Og-pkKWl4zP0IOvJASu5RqPEDJBB'),
    title: { en: 'Reel 01', ar: 'ريلز 01' },
    category: socialCategory,
    ratio: '9:16',
  },
  {
    id: 'sv02',
    src: drive('1BvDym2qvRoEiP1alawbKRpx20QUfpMQp'),
    title: { en: 'Reel 02', ar: 'ريلز 02' },
    category: socialCategory,
    ratio: '9:16',
  },
  {
    id: 'sv03',
    src: drive('1i8QnYKCD4tbTI2lBcv3cHTPsvQMM0jYJ'),
    title: { en: 'Reel 03', ar: 'ريلز 03' },
    category: socialCategory,
    ratio: '9:16',
  },
  {
    id: 'sv05',
    src: drive('1285D7t5r4EiioGxzqsnk5gIp9rTxc0WB'),
    title: { en: 'Reel 05', ar: 'ريلز 05' },
    category: socialCategory,
    ratio: '16:9',
  },
  {
    id: 'sv06',
    src: drive('1L_OX89CRPnqgn4lOhUU85XbICmwBD63C'),
    title: { en: 'Reel 06', ar: 'ريلز 06' },
    category: socialCategory,
    ratio: '9:16',
  },
  {
    id: 'sv07',
    src: drive('1EULui_Aaq1Bp8Dl-466H5fNXE2tFiD7e'),
    title: { en: 'Reel 07', ar: 'ريلز 07' },
    category: socialCategory,
    ratio: '9:16',
  },
  {
    id: 'sv08',
    src: drive('1Q8b9kD9Iu0wylnOu9HGCA_53-_n2rguP'),
    title: { en: 'Reel 08', ar: 'ريلز 08' },
    category: socialCategory,
    ratio: '16:9',
  },
  {
    id: 'sv09',
    src: drive('18bJDm4cd2l-q5UYPJLYGVPQdJ4QvZu35'),
    title: { en: 'Reel 09', ar: 'ريلز 09' },
    category: socialCategory,
    ratio: '9:16',
  },
  {
    id: 'sv10',
    src: 'PASTE_LINK_HERE',
    title: { en: 'Reel 10', ar: 'ريلز 10' },
    category: socialCategory,
    ratio: '9:16',
  },
];

// ============================================================
// MARKETING WORK
// ============================================================

const mkCategory: Bilingual = {
  en: 'Digital Marketing',
  ar: 'التسويق الرقمي',
};

const img = (name: string) => `/imgesandphotos/design/${name}`;

export const marketingWorks: MarketingWork[] = [
  { id: 'mk01', src: img('54.png'), title: { en: 'Project 01', ar: 'مشروع 01' }, category: mkCategory, kind: 'design', size: 'wide' },
  { id: 'mk02', src: img('kofta.JPG'), title: { en: 'Project 02', ar: 'مشروع 02' }, category: mkCategory, kind: 'design', size: 'tall' },
  { id: 'mk03', src: img('df2.png'), title: { en: 'Logo 03', ar: 'شعار 03' }, category: mkCategory, kind: 'logo', size: 'standard' },
  { id: 'mk04', src: img('4.jpg'), title: { en: 'Logo 04', ar: 'شعار 04' }, category: mkCategory, kind: 'logo', size: 'standard' },
  { id: 'mk05', src: img('7.jpg'), title: { en: 'Logo 05', ar: 'شعار 05' }, category: mkCategory, kind: 'logo', size: 'standard' },
  { id: 'mk06', src: img('build.JPG'), title: { en: 'Logo 06', ar: 'شعار 06' }, category: mkCategory, kind: 'logo', size: 'standard' },
  { id: 'mk07', src: img('building.jpg'), title: { en: 'Design 07', ar: 'تصميم 07' }, category: mkCategory, kind: 'design', size: 'standard' },
  { id: 'mk08', src: img('Tarb.JPG'), title: { en: 'Design 08', ar: 'تصميم 08' }, category: mkCategory, kind: 'design', size: 'tall' },
  { id: 'mk09', src: img('sawndiwth.JPG'), title: { en: 'Design 09', ar: 'تصميم 09' }, category: mkCategory, kind: 'design', size: 'wide' },
  { id: 'mk10', src: img('pizza.jpg'), title: { en: 'Logo 10', ar: 'شعار 10' }, category: mkCategory, kind: 'logo', size: 'standard' },
  { id: 'mk11', src: img('Juice.JPG'), title: { en: 'Logo 11', ar: 'شعار 11' }, category: mkCategory, kind: 'logo', size: 'standard' },
];

// ============================================================
// WEBSITE WORK (disabled)
// ============================================================

// export const websiteWorks: WebsiteWork[] = [
//   { id: 'ws01', src: 'PASTE_LINK_HERE', title: { en: 'Site 01', ar: 'موقع 01' }, category: { en: 'Websites', ar: 'المواقع الإلكترونية' } },
// ];