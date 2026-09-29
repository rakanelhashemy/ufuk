<<<<<<< HEAD
```ts
// ============================================================
// MEDIA CONFIG
// ============================================================

// Paste your link in `src`.
//
// Supported:
// - Image URL
// - Direct .mp4 URL
// - Direct .webm URL
// - YouTube URL
// - Google Drive share link
//
// Google Drive videos are resolved to an iframe preview.
// Local/direct MP4 files are resolved to <video>.
//
// Slots still set to PASTE_LINK_HERE are hidden when
// SHOW_EMPTY_SLOTS is false.

export const SHOW_EMPTY_SLOTS = true;


// ============================================================
// TYPES
// ============================================================

export type Bilingual = {
  en: string;
  ar: string;
};

=======
// PASTE YOUR LINK in `src`. It can be: an image URL, a direct .mp4 URL, a YouTube link
// (watch / youtu.be / shorts), or a Google Drive share link.
// Slots still set to PASTE_LINK_HERE are hidden when SHOW_EMPTY_SLOTS is false.

export const SHOW_EMPTY_SLOTS = true;

export type Bilingual = { en: string; ar: string };
>>>>>>> 065ac8faf2546a213be67d9dc521eb4fc38e4d74

export type SocialVideo = {
  id: string;
  src: string;
  title: Bilingual;
  category: Bilingual;
  poster?: string;
  ratio?: '9:16' | '16:9';
};
<<<<<<< HEAD

=======
 
>>>>>>> 065ac8faf2546a213be67d9dc521eb4fc38e4d74

export type MarketingWork = {
  id: string;
  src: string;
  title: Bilingual;
  category: Bilingual;
  kind: 'logo' | 'design';
  size?: 'standard' | 'tall' | 'wide';
};

<<<<<<< HEAD

=======
>>>>>>> 065ac8faf2546a213be67d9dc521eb4fc38e4d74
export type WebsiteWork = {
  id: string;
  src: string;
  title: Bilingual;
  category: Bilingual;
  siteUrl?: string;
};

<<<<<<< HEAD

export type ResolvedMedia = {
  kind:
    | 'youtube'
    | 'drive-video'
    | 'drive-image'
    | 'mp4'
    | 'webm'
    | 'image';

=======
export type ResolvedMedia = {
  kind: 'youtube' | 'drive-video' | 'drive-image' | 'mp4' | 'webm' | 'image';
>>>>>>> 065ac8faf2546a213be67d9dc521eb4fc38e4d74
  embedUrl?: string;
  thumb?: string;
  videoSrc?: string;
  imgSrc?: string;
};

<<<<<<< HEAD

// ============================================================
// RESOLVE MEDIA
// ============================================================

export function resolveMedia(src: string): ResolvedMedia {
  if (!src || src === 'PASTE_LINK_HERE') {
    return {
      kind: 'image',
    };
  }


  // ==========================================================
  // YOUTUBE
  // ==========================================================

  const ytMatch = src.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/
  );

  if (ytMatch) {
    const id = ytMatch[1];

    return {
      kind: 'youtube',

      embedUrl:
        `https://www.youtube.com/embed/${id}` +
        `?autoplay=1` +
        `&rel=0` +
        `&playsinline=1`,

      thumb:
        `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }


  // ==========================================================
  // GOOGLE DRIVE VIDEO
  //
  // Example:
  // https://drive.google.com/file/d/FILE_ID/view
  // ==========================================================

  const driveFileMatch = src.match(
    /drive\.google\.com\/file\/d\/([\w-]+)/
  );

  if (driveFileMatch) {
    const id = driveFileMatch[1];

    return {
      kind: 'drive-video',

      embedUrl:
        `https://drive.google.com/file/d/${id}/preview`,

      thumb:
        `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
    };
  }


  // ==========================================================
  // GOOGLE DRIVE OPEN LINK
  //
  // Example:
  // https://drive.google.com/open?id=FILE_ID
  //
  // Usually used for images.
  // ==========================================================

  const driveOpenMatch = src.match(
    /drive\.google\.com\/open\?id=([\w-]+)/
  );

  if (driveOpenMatch) {
    const id = driveOpenMatch[1];

    return {
      kind: 'drive-image',

      imgSrc:
        `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
    };
  }


  // ==========================================================
  // GOOGLE DRIVE UC LINK
  //
  // Also support:
  // https://drive.google.com/uc?id=FILE_ID
  // ==========================================================

  const driveUcMatch = src.match(
    /drive\.google\.com\/uc\?(?:export=[^&]+&)?id=([\w-]+)/
  );

  if (driveUcMatch) {
    const id = driveUcMatch[1];

    return {
      kind: 'drive-video',

      embedUrl:
        `https://drive.google.com/file/d/${id}/preview`,

      thumb:
        `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
    };
  }


  // ==========================================================
  // DIRECT MP4
  // ==========================================================

  if (/\.mp4(?:\?.*)?$/i.test(src)) {
    return {
      kind: 'mp4',
      videoSrc: src,
    };
  }


  // ==========================================================
  // DIRECT WEBM
  // ==========================================================

  if (/\.webm(?:\?.*)?$/i.test(src)) {
    return {
      kind: 'webm',
      videoSrc: src,
    };
  }


  // ==========================================================
  // NORMAL IMAGE
  // ==========================================================

  return {
    kind: 'image',
    imgSrc: src,
  };
}


// ============================================================
// SOCIAL VIDEOS
// ============================================================

export const socialVideos: SocialVideo[] = [

  {
    id: 'sv01',

    src:
      'https://drive.google.com/file/d/' +
      '1vFn1Og-pkKWl4zP0IOvJASu5RqPEDJBB/view',

    title: {
      en: 'Reel 01',
      ar: 'ريلز 01',
    },

    category: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },

    ratio: '9:16',
  },


  {
    id: 'sv02',

    src:
      'https://drive.google.com/file/d/' +
      '1BvDym2qvRoEiP1alawbKRpx20QUfpMQp/view',

    title: {
      en: 'Reel 02',
      ar: 'ريلز 02',
    },

    category: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },

    ratio: '9:16',
  },


  {
    id: 'sv03',

    src:
      'https://drive.google.com/file/d/' +
      '1i8QnYKCD4tbTI2lBcv3cHTPsvQMM0jYJ/view',

    title: {
      en: 'Reel 03',
      ar: 'ريلز 03',
    },

    category: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },

    ratio: '9:16',
  },


  {
    id: 'sv05',

    src:
      'https://drive.google.com/file/d/' +
      '1285D7t5r4EiioGxzqsnk5gIp9rTxc0WB/view',

    title: {
      en: 'Reel 05',
      ar: 'ريلز 05',
    },

    category: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },

    ratio: '16:9',
  },


  {
    id: 'sv06',

    src:
      'https://drive.google.com/file/d/' +
      '1L_OX89CRPnqgn4lOhUU85XbICmwBD63C/view',

    title: {
      en: 'Reel 06',
      ar: 'ريلز 06',
    },

    category: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },

    ratio: '9:16',
  },


  {
    id: 'sv07',

    src:
      'https://drive.google.com/file/d/' +
      '1EULui_Aaq1Bp8Dl-466H5fNXE2tFiD7e/view',

    title: {
      en: 'Reel 07',
      ar: 'ريلز 07',
    },

    category: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },

    ratio: '9:16',
  },


  {
    id: 'sv08',

    src:
      'https://drive.google.com/file/d/' +
      '1Q8b9kD9Iu0wylnOu9HGCA_53-_n2rguP/view',

    title: {
      en: 'Reel 08',
      ar: 'ريلز 08',
    },

    category: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },

    ratio: '16:9',
  },


  {
    id: 'sv09',

    src:
      'https://drive.google.com/file/d/' +
      '18bJDm4cd2l-q5UYPJLYGVPQdJ4QvZu35/view',

    title: {
      en: 'Reel 09',
      ar: 'ريلز 09',
    },

    category: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },

    ratio: '9:16',
  },


  {
    id: 'sv10',

    src: 'PASTE_LINK_HERE',

    title: {
      en: 'Reel 10',
      ar: 'ريلز 10',
    },

    category: {
      en: 'Social Media',
      ar: 'سوشيال ميديا',
    },

    ratio: '9:16',
  },
];


// ============================================================
// MARKETING WORK
// ============================================================

export const marketingWorks: MarketingWork[] = [

  {
    id: 'mk01',
    src: '/imgesandphotos/design/54.png',

    title: {
      en: 'Project 01',
      ar: 'مشروع 01',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'design',
    size: 'wide',
  },


  {
    id: 'mk02',
    src: '/imgesandphotos/design/kofta.JPG',

    title: {
      en: 'Project 02',
      ar: 'مشروع 02',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'design',
    size: 'tall',
  },


  {
    id: 'mk03',
    src: '/imgesandphotos/design/df2.png',

    title: {
      en: 'Logo 03',
      ar: 'شعار 03',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'logo',
    size: 'standard',
  },


  {
    id: 'mk04',
    src: '/imgesandphotos/design/4.jpg',

    title: {
      en: 'Logo 04',
      ar: 'شعار 04',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'logo',
    size: 'standard',
  },


  {
    id: 'mk05',
    src: '/imgesandphotos/design/7.jpg',

    title: {
      en: 'Logo 05',
      ar: 'شعار 05',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'logo',
    size: 'standard',
  },


  {
    id: 'mk06',
    src: '/imgesandphotos/design/build.JPG',

    title: {
      en: 'Logo 06',
      ar: 'شعار 06',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'logo',
    size: 'standard',
  },


  {
    id: 'mk07',
    src: '/imgesandphotos/design/building.jpg',

    title: {
      en: 'Design 07',
      ar: 'تصميم 07',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'design',
    size: 'standard',
  },


  {
    id: 'mk08',
    src: '/imgesandphotos/design/Tarb.JPG',

    title: {
      en: 'Design 08',
      ar: 'تصميم 08',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'design',
    size: 'tall',
  },


  {
    id: 'mk09',
    src: '/imgesandphotos/design/sawndiwth.JPG',

    title: {
      en: 'Design 09',
      ar: 'تصميم 09',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'design',
    size: 'wide',
  },


  {
    id: 'mk10',
    src: '/imgesandphotos/design/pizza.jpg',

    title: {
      en: 'Logo 10',
      ar: 'شعار 10',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'logo',
    size: 'standard',
  },


  {
    id: 'mk11',
    src: '/imgesandphotos/design/Juice.JPG',

    title: {
      en: 'Logo 11',
      ar: 'شعار 11',
    },

    category: {
      en: 'Digital Marketing',
      ar: 'التسويق الرقمي',
    },

    kind: 'logo',
    size: 'standard',
  },
];


// ============================================================
// WEBSITE WORK
// ============================================================

// export const websiteWorks: WebsiteWork[] = [

//   {
//     id: 'ws01',
//     src: demoImages.strategy,
//     title: {
//       en: 'Site 01',
//       ar: 'موقع 01',
//     },
//     category: {
//       en: 'Websites',
//       ar: 'المواقع الإلكترونية',
//     },
//   },

//   {
//     id: 'ws02',
//     src: demoImages.campaign,
//     title: {
//       en: 'Site 02',
//       ar: 'موقع 02',
//     },
//     category: {
//       en: 'Websites',
//       ar: 'المواقع الإلكترونية',
//     },
//   },

//   {
//     id: 'ws03',
//     src: 'PASTE_LINK_HERE',
//     title: {
//       en: 'Site 03',
//       ar: 'موقع 03',
//     },
//     category: {
//       en: 'Websites',
//       ar: 'المواقع الإلكترونية',
//     },
//   },

//   {
//     id: 'ws04',
//     src: 'PASTE_LINK_HERE',
//     title: {
//       en: 'Site 04',
//       ar: 'موقع 04',
//     },
//     category: {
//       en: 'Websites',
//       ar: 'المواقع الإلكترونية',
//     },
//   },

//   {
//     id: 'ws05',
//     src: 'PASTE_LINK_HERE',
//     title: {
//       en: 'Site 05',
//       ar: 'موقع 05',
//     },
//     category: {
//       en: 'Websites',
//       ar: 'المواقع الإلكترونية',
//     },
//   },

//   {
//     id: 'ws06',
//     src: 'PASTE_LINK_HERE',
//     title: {
//       en: 'Site 06',
//       ar: 'موقع 06',
//     },
//     category: {
//       en: 'Websites',
//       ar: 'المواقع الإلكترونية',
//     },
//   },

//   {
//     id: 'ws07',
//     src: 'PASTE_LINK_HERE',
//     title: {
//       en: 'Site 07',
//       ar: 'موقع 07',
//     },
//     category: {
//       en: 'Websites',
//       ar: 'المواقع الإلكترونية',
//     },
//   },

//   {
//     id: 'ws08',
//     src: 'PASTE_LINK_HERE',
//     title: {
//       en: 'Site 08',
//       ar: 'موقع 08',
//     },
//     category: {
//       en: 'Websites',
//       ar: 'المواقع الإلكترونية',
//     },
//   },

// ];
```
=======
export function resolveMedia(src: string): ResolvedMedia {
  if (!src || src === 'PASTE_LINK_HERE') return { kind: 'image' };

  const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]+)/);
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

  if (/\.mp4(\?|$)/i.test(src)) return { kind: 'mp4', videoSrc: src };
  if (/\.webm(\?|$)/i.test(src)) return { kind: 'webm', videoSrc: src };

  return { kind: 'image', imgSrc: src };
}



export const socialVideos: SocialVideo[] = [
  
  { id: 'sv01', src: '/imgesandphotos/a.mp4', title: { en: 'Reel 01', ar: 'ريلز 01' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '9:16' },
  { id: 'sv02', src: '/imgesandphotos/b.mp4', title: { en: 'Reel 02', ar: 'ريلز 02' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '9:16' },
  { id: 'sv03', src: '/imgesandphotos/c.mp4', title: { en: 'Reel 03', ar: 'ريلز 03' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '9:16' },
  { id: 'sv05', src: '/imgesandphotos/d.mp4', title: { en: 'Reel 05', ar: 'ريلز 05' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '16:9' },
  { id: 'sv06', src: '/imgesandphotos/e.mp4', title: { en: 'Reel 06', ar: 'ريلز 06' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '9:16' },
  { id: 'sv07', src: '/imgesandphotos/z.mp4', title: { en: 'Reel 07', ar: 'ريلز 07' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '9:16' },
  { id: 'sv08', src: '/imgesandphotos/f.mp4', title: { en: 'Reel 08', ar: 'ريلز 08' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '16:9' },
  { id: 'sv09', src: '/imgesandphotos/g.mp4', title: { en: 'Reel 09', ar: 'ريلز 09' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '9:16' },
  { id: 'sv10', src: '/imgesandphotos/s.mp4', title: { en: 'Reel 10', ar: 'ريلز 10' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '9:16' },
  { id: 'sv11', src: '/imgesandphotos/y.mp4', title: { en: 'Reel 11', ar: 'ريلز 11' }, category: { en: 'Social Media', ar: 'سوشيال ميديا' }, ratio: '9:16' },
];

export const marketingWorks: MarketingWork[] = [
  // DEMO - replace 

  { id: 'mk01', src: '/imgesandphotos/design/54.png', title: { en: 'Project 01', ar: 'مشروع 01' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'design', size: 'wide' },
  { id: 'mk02', src: '/imgesandphotos/design/kofta.JPG', title: { en: 'Project 02', ar: 'مشروع 02' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'design', size: 'tall' },
  { id: 'mk03', src: '/imgesandphotos/design/df2.png', title: { en: 'Logo 03', ar: 'شعار 03' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'logo', size: 'standard' },
  { id: 'mk04', src: '/imgesandphotos/design/4.jpg', title: { en: 'Logo 04', ar: 'شعار 04' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'logo', size: 'standard' },
  { id: 'mk05', src: '/imgesandphotos/design/7.jpg', title: { en: 'Logo 05', ar: 'شعار 05' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'logo', size: 'standard' },
  { id: 'mk06', src: '/imgesandphotos/design/build.JPG', title: { en: 'Logo 06', ar: 'شعار 06' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'logo', size: 'standard' },
  { id: 'mk07', src: '/imgesandphotos/design/building.jpg', title: { en: 'Design 07', ar: 'تصميم 07' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'design', size: 'standard' },
  { id: 'mk08', src: '/imgesandphotos/design/Tarb.JPG', title: { en: 'Design 08', ar: 'تصميم 08' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'design', size: 'tall' },
  { id: 'mk09', src: '/imgesandphotos/design/sawndiwth.JPG', title: { en: 'Design 09', ar: 'تصميم 09' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'design', size: 'wide' },
  { id: 'mk10', src: '/imgesandphotos/design/pizza.jpg', title: { en: 'Logo 10', ar: 'شعار 10' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'logo', size: 'standard' },
  { id: 'mk11', src: '/imgesandphotos/design/Juice.JPG', title: { en: 'Logo 11', ar: 'شعار 11' }, category: { en: 'Digital Marketing', ar: 'التسويق الرقمي' }, kind: 'logo', size: 'standard' },
];

// export const websiteWorks: WebsiteWork[] = [
//   // DEMO - replace
//   { id: 'ws01', src: demoImages.strategy, title: { en: 'Site 01', ar: 'موقع 01' }, category: { en: 'Websites', ar: 'المواقع الإلكترونية' } },
//   { id: 'ws02', src: demoImages.campaign, title: { en: 'Site 02', ar: 'موقع 02' }, category: { en: 'Websites', ar: 'المواقع الإلكترونية' } },
//   // end DEMO
//   { id: 'ws03', src: 'PASTE_LINK_HERE', title: { en: 'Site 03', ar: 'موقع 03' }, category: { en: 'Websites', ar: 'المواقع الإلكترونية' } },
//   { id: 'ws04', src: 'PASTE_LINK_HERE', title: { en: 'Site 04', ar: 'موقع 04' }, category: { en: 'Websites', ar: 'المواقع الإلكترونية' } },
//   { id: 'ws05', src: 'PASTE_LINK_HERE', title: { en: 'Site 05', ar: 'موقع 05' }, category: { en: 'Websites', ar: 'المواقع الإلكترونية' } },
//   { id: 'ws06', src: 'PASTE_LINK_HERE', title: { en: 'Site 06', ar: 'موقع 06' }, category: { en: 'Websites', ar: 'المواقع الإلكترونية' } },
//   { id: 'ws07', src: 'PASTE_LINK_HERE', title: { en: 'Site 07', ar: 'موقع 07' }, category: { en: 'Websites', ar: 'المواقع الإلكترونية' } },
//   { id: 'ws08', src: 'PASTE_LINK_HERE', title: { en: 'Site 08', ar: 'موقع 08' }, category: { en: 'Websites', ar: 'المواقع الإلكترونية' } },
// ];
>>>>>>> 065ac8faf2546a213be67d9dc521eb4fc38e4d74
