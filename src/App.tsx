import { useEffect, useState, type ReactNode } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  ChevronDown,
  Facebook,
  Instagram,
  Mail,
  Menu,
  Monitor,
  PenTool,
  Phone,
  Play,
  Plus,
  Target,
  X,
} from 'lucide-react';
import WorkSection from '@/components/WorkSection';

const WHATSAPP = 'https://wa.me/201015158464';
const INSTAGRAM = 'https://www.instagram.com/ufuk_agancy1/';
const FACEBOOK = 'https://www.facebook.com/UfukAgency';

type Language = 'en' | 'ar';
type Bilingual = { en: string; ar: string };

const imageUrls = {
  strategy: './Portfolio/Portfolio/0710 (1)(2).mp4',
  campaign: 'https://images.pexels.com/photos/4925629/pexels-photo-4925629.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  film: 'https://images.pexels.com/photos/7212451/pexels-photo-7212451.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  texture: 'https://images.pexels.com/photos/30173134/pexels-photo-30173134.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  palette: 'https://images.pexels.com/photos/9594092/pexels-photo-9594092.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const clientLogos: Bilingual[] = [
  { en: 'Strategy-led', ar: 'Strategy-led' },
  { en: 'Business-focused', ar: 'Business-focused' },
  { en: 'Integrated', ar: 'Integrated' },
  { en: 'Custom-built', ar: 'Custom-built' },
  { en: 'analytical', ar: 'analytical' },
  { en: 'Creative ', ar: 'Creative ' },
];

const serviceGroups = [
  {
    number: '01', title: { en: 'Strategy & Growth', ar: 'الاستراتيجية والنمو' }, icon: Target,
    description: { en: 'A clear point of view before a single deliverable is made.', ar: 'رؤية واضحة قبل تنفيذ أي مخرج أو محتوى.' },
    items: [
      { en: 'Marketing Strategy', ar: 'استراتيجية التسويق' }, { en: 'Business & Market Analysis', ar: 'تحليل الأعمال والسوق' }, { en: 'Competitor & Audience Analysis', ar: 'تحليل المنافسين والجمهور' }, { en: 'Brand Positioning', ar: 'تموضع العلامة التجارية' }, { en: 'Advertising Strategy', ar: 'استراتيجية الإعلان' }, { en: 'Growth Planning', ar: 'تخطيط النمو' }, { en: 'Marketing Audits', ar: 'مراجعات التسويق' },
    ],
  },
  {
    number: '02', title: { en: 'Creative & Content', ar: 'الإبداع والمحتوى' }, icon: PenTool,
    description: { en: 'Ideas, systems, and content that give the strategy a visible shape.', ar: 'أفكار وأنظمة ومحتوى يحوّل الاستراتيجية إلى حضور ملموس.' },
    items: [
      { en: 'Social Media Management', ar: 'إدارة وسائل التواصل الاجتماعي' }, { en: 'Content Plans', ar: 'خطط المحتوى' }, { en: 'Content Strategy & Creation', ar: 'استراتيجية وإنتاج المحتوى' }, { en: 'Graphic Design', ar: 'التصميم الجرافيكي' }, { en: 'Branding & Visual Communication', ar: 'الهوية والاتصال البصري' }, { en: 'Video Production', ar: 'إنتاج الفيديو' }, { en: 'Reels & Photography', ar: 'الريلز والتصوير' }, { en: 'Moderation', ar: 'إدارة المجتمع والردود' },
    ],
  },
  {
    number: '03', title: { en: 'Performance Marketing', ar: 'التسويق بالأداء' }, icon: BarChart3,
    description: { en: 'Campaigns designed to learn, improve, and move the business forward.', ar: 'حملات تتعلم من البيانات وتتحسن لتدفع العمل إلى الأمام.' },
    items: [
      { en: 'Media Buying', ar: 'شراء المساحات الإعلانية' }, { en: 'Google Ads', ar: 'إعلانات جوجل' }, { en: 'Paid Social', ar: 'الإعلانات الممولة' }, { en: 'Strategic Campaigns', ar: 'الحملات الاستراتيجية' }, { en: 'Performance Analysis', ar: 'تحليل الأداء' }, { en: 'Optimization & Reporting', ar: 'التحسين والتقارير' },
    ],
  },
  {
    number: '04', title: { en: 'Digital Solutions', ar: 'الحلول الرقمية' }, icon: Monitor,
    description: { en: 'Useful digital touchpoints that connect the brand to its next opportunity.', ar: 'نقاط اتصال رقمية تربط العلامة بفرصتها التالية.' },
    items: [{ en: 'Website Development', ar: 'تطوير المواقع الإلكترونية' }, { en: 'Landing Pages', ar: 'صفحات الهبوط' }, { en: 'Digital Experiences', ar: 'التجارب الرقمية' }],
  },
];

const principles: [string, Bilingual, Bilingual][] = [
  ['01', { en: 'Strategy-led', ar: 'بقيادة الاستراتيجية' }, { en: 'No execution without understanding the objective.', ar: 'لا تنفيذ قبل فهم الهدف بوضوح.' }],
  ['02', { en: 'Business-focused', ar: 'نضع العمل أولاً' }, { en: 'We look at the business before the content.', ar: 'ننظر إلى العمل قبل أن ننظر إلى المحتوى.' }],
  ['03', { en: 'Integrated', ar: 'متكامل' }, { en: 'Strategy + Creative + Performance + Digital Solutions.', ar: 'استراتيجية + إبداع + أداء + حلول رقمية.' }],
  ['04', { en: 'Custom-built', ar: 'مصمم خصيصاً' }, { en: 'The answer is shaped around your real situation.', ar: 'نصمم الحل وفقاً لواقع عملك واحتياجاته.' }],
  ['05', { en: 'Creative + analytical', ar: 'إبداعي وتحليلي' }, { en: 'Ideas are stronger when data gives them direction.', ar: 'تزداد قوة الأفكار عندما تمنحها البيانات اتجاهاً واضحاً.' }],
];

const processSteps: [string, Bilingual, Bilingual][] = [
  ['01', { en: 'Discover', ar: 'نكتشف' }, { en: 'Understand the business, context, and ambition.', ar: 'نفهم العمل وسياقه وطموحه.' }],
  ['02', { en: 'Analyze', ar: 'نحلل' }, { en: 'Read the market, audience, competition, and current presence.', ar: 'نقرأ السوق والجمهور والمنافسة والحضور الحالي.' }],
  ['03', { en: 'Strategize', ar: 'نضع الاستراتيجية' }, { en: 'Choose the clearest path toward the next stage.', ar: 'نختار المسار الأكثر وضوحاً نحو المرحلة التالية.' }],
  ['04', { en: 'Create', ar: 'نبتكر' }, { en: 'Turn the direction into a compelling visual system.', ar: 'نحوّل التوجه إلى منظومة بصرية مؤثرة.' }],
  ['05', { en: 'Execute', ar: 'ننّفذ' }, { en: 'Bring it to life across the right channels.', ar: 'نحوّل الفكرة إلى واقع عبر القنوات المناسبة.' }],
  ['06', { en: 'Measure', ar: 'نقيس' }, { en: 'Learn from what the work is telling us.', ar: 'نتعلم مما تخبرنا به النتائج.' }],
  ['07', { en: 'Optimize', ar: 'نحسّن' }, { en: 'Keep improving what is already in motion.', ar: 'نواصل تحسين ما بدأناه.' }],
];

const metaData: Record<Language, { title: string; description: string }> = {
  en: { title: 'UFUK — Strategic Growth Partner', description: 'UFUK is a strategic growth partner for ambitious businesses. Strategy + Creative + Performance + Digital Solutions. We see the full horizon, then we build what matters.' },
  ar: { title: 'أفق — شريك استراتيجي للنمو', description: 'أفق شريك استراتيجي للنمو للأعمال الطموحة. استراتيجية + إبداع + أداء + حلول رقمية. نرى الصورة كاملة، ثم نصنع الأثر.' },
};

const currency: Bilingual = { en: 'EGP', ar: 'ج.م' };

function useReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function SectionLabel({ children, number }: { children: ReactNode; number: string }) {
  return <div className="section-label"><span>{number}</span><span>{children}</span></div>;
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 100 140" role="img"><path d="M22 38v48c0 25 12 39 28 39s28-14 28-39V38" /><path d="M50 38V16l13-13" /><circle cx="67" cy="3" r="6" /></svg></span>;
}

function Wordmark({ lang }: { lang: Language }) {
  const isAr = lang === 'ar';
  return (
    <span className={`wordmark ${isAr ? 'wordmark-ar' : 'wordmark-en'}`}>
      {isAr ? 'أفق' : 'UFUK'}
      <span className="wordmark-horizon"><span className="wordmark-dot" /></span>
    </span>
  );
}

function App() {
  const [lang, setLang] = useState<Language>(() => {
    try { const s = localStorage.getItem('ufuk-lang'); if (s === 'en' || s === 'ar') return s; } catch { /* noop */ }
    return 'ar';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  useReveal();

  const isArabic = lang === 'ar';
  const tr = (value: Bilingual) => value[lang];
  const whatsappLink = (message: Bilingual) => `${WHATSAPP}?text=${encodeURIComponent(tr(message))}`;
  const navItems: Bilingual[] = [
    { en: 'About', ar: 'من نحن' }, { en: 'Marketing', ar: 'التسويق' }, { en: 'Media', ar: 'الإعلام' }, { en: 'Work', ar: 'أعمالنا' }, { en: 'Contact', ar: 'تواصل معنا' },
  ];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.title = metaData[lang].title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', metaData[lang].description);
    try { localStorage.setItem('ufuk-lang', lang); } catch { /* noop */ }
  }, [isArabic, lang]);

  return (
    <div className="site-shell" dir={isArabic ? 'rtl' : 'ltr'}>
      <header className={`site-header ${menuOpen ? 'menu-open' : ''}`}>
        <a className="brand" href="#top" onClick={() => setMenuOpen(false)} aria-label={isArabic ? 'أفق، الصفحة الرئيسية' : 'UFUK home'}><BrandMark /><Wordmark lang={lang} /></a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}>
          {navItems.map((item) => <a key={item.en} href={`#${item.en.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{tr(item)}</a>)}
        </nav>
        <div className="header-actions">
          <button className="language-switcher" onClick={() => setLang(isArabic ? 'en' : 'ar')} aria-label={isArabic ? 'التبديل إلى الإنجليزية' : 'Switch to Arabic'}>{isArabic ? 'EN' : 'AR'}</button>
          <a className="header-cta" href={whatsappLink({ en: 'Hello UFUK, I would like to start a conversation.', ar: 'مرحباً أفق، أرغب في بدء محادثة.' })} target="_blank" rel="noreferrer">{tr({ en: 'Start a conversation', ar: 'ابدأ محادثة' })} <ArrowUpRight size={16} /></a>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? (isArabic ? 'إغلاق القائمة' : 'Close menu') : (isArabic ? 'فتح القائمة' : 'Open menu')}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main id="top">
        <section className="hero section-dark">
          <div className="hero-grid" /><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><div className="hero-orbit orbit-three" />
          <div className="container hero-content">
            <div className="hero-kicker" data-reveal><span className="status-dot" /> {tr({ en: 'Strategic growth partner', ar: 'شريك استراتيجي للنمو' })} <span className="line" /> 2026</div>
            <h1 data-reveal>{isArabic ? <><span className="h1-line">نرى الصورة كاملة،</span><em className="h1-line">ثم نصنع الأثر.</em></> : <><span className="h1-line">We see the full horizon,</span><em className="h1-line">then we build what matters.</em></>}</h1>
            <p className="hero-copy" data-reveal>{tr({ en: 'UFUK helps ambitious businesses find the next right move — then turns that understanding into strategy, creative, performance, and digital solutions.', ar: 'تساعد أفق الأعمال الطموحة على اكتشاف خطوتها التالية، ثم تحوّل هذا الفهم إلى استراتيجية وإبداع وأداء وحلول رقمية.' })}</p>
            <div className="button-row" data-reveal><a className="button button-primary" href={whatsappLink({ en: 'Hello UFUK, I would like to start a conversation.', ar: 'مرحباً أفق، أرغب في بدء محادثة.' })} target="_blank" rel="noreferrer">{tr({ en: 'Start a conversation', ar: 'ابدأ محادثة' })} <ArrowUpRight size={17} /></a><a className="button button-quiet" href="#work">{tr({ en: 'Explore our work', ar: 'استكشف أعمالنا' })} <ArrowDownRight size={17} /></a></div>
            <div className="hero-foot" data-reveal><span>{tr({ en: 'Scroll to shift perspective', ar: 'مرّر لتغيّر زاوية النظر' })}</span><span className="scroll-line" /></div>
          </div>
          <div className="hero-stamp" aria-hidden="true"><BrandMark /><span>{isArabic ? <><span className="h1-line">غيّر زاوية النظر.</span><span className="h1-line">اصنع ما هو قادم.</span></> : <><span className="h1-line">SHIFT PERSPECTIVE.</span><span className="h1-line">SHAPE WHAT'S NEXT.</span></>}</span></div>
        </section>

        <section id="about" className="section-cream about-section">
          <div className="container split-layout"><div data-reveal><SectionLabel number="01">{tr({ en: 'Who we are', ar: 'من نحن' })}</SectionLabel><h2>{isArabic ? <><span className="h1-line">أكثر من</span><span className="h1-line">مجرد وكالة.</span></> : <><span className="h1-line">More than</span><span className="h1-line">an agency.</span></>}</h2></div><div className="about-copy" data-reveal><p className="lead-dark">{tr({ en: 'UFUK is a strategic growth partner for businesses and brands that are ready for their next chapter.', ar: 'أفق شريك استراتيجي للنمو للأعمال والعلامات التجارية المستعدة لفصلها القادم.' })}</p><p>{tr({ en: 'We do not treat marketing as a list of isolated services. We start by understanding the business, its market, its audience, its competitors, and the opportunities in front of it.', ar: 'لا نتعامل مع التسويق كقائمة من الخدمات المنفصلة. نبدأ بفهم العمل وسوقه وجمهوره ومنافسيه والفرص المتاحة أمامه.' })}</p><p>{tr({ en: 'Then we build a clear system around what the business actually needs — not a package we already had in mind.', ar: 'بعد ذلك نبني منظومة واضحة حول ما يحتاجه العمل فعلياً، لا حول باقة جاهزة مسبقاً.' })}</p><a className="text-link dark-link" href="#difference">{tr({ en: 'See the UFUK difference', ar: 'اكتشف الفرق مع أفق' })} <ArrowRight size={16} /></a></div></div>
          <div className="container principle-line" data-reveal><span>{tr({ en: 'STRATEGY', ar: 'استراتيجية' })}</span><b>+</b><span>{tr({ en: 'CREATIVE', ar: 'إبداع' })}</span><b>+</b><span>{tr({ en: 'PERFORMANCE', ar: 'أداء' })}</span></div>
        </section>

        <section className="section-dark clients-section" aria-label={tr({ en: 'Trusted by businesses and brands', ar: 'تحظى بثقة الأعمال والعلامات التجارية' })}><div className="container"><div className="clients-heading" data-reveal><SectionLabel number="—">{tr({ en: 'Trusted by businesses & brands', ar: 'تحظى بثقة الأعمال والعلامات التجارية' })}</SectionLabel></div></div><div className="marquee" data-reveal><div className="marquee-track">{[...clientLogos, ...clientLogos].map((name, index) => <span className="marquee-item" key={`${name.en}-${index}`}>{tr(name)}</span>)}</div></div></section>

        <section className="section-dark why-section"><div className="container"><div className="section-intro" data-reveal><SectionLabel number="02">{tr({ en: 'Why UFUK', ar: 'لماذا أفق' })}</SectionLabel><h2>{isArabic ? <><span className="h1-line">الفكرة</span><em className="h1-line">خلف كل عمل.</em></> : <><span className="h1-line">The thinking</span><em className="h1-line">behind the work.</em></>}</h2><p>{tr({ en: 'Good marketing is not louder. It is more considered, more connected, and more useful to the business it represents.', ar: 'التسويق الجيد ليس الأعلى صوتاً، بل الأكثر وعياً وترابطاً وفائدة للعمل الذي يمثّله.' })}</p></div><div className="principle-list">{principles.map(([number, title, copy], index) => <div className="principle-row" data-reveal key={title.en} style={{ transitionDelay: `${index * 80}ms` }}><span className="row-number">{number}</span><h3>{tr(title)}</h3><p>{tr(copy)}</p><ArrowUpRight className="row-arrow" size={20} /></div>)}</div></div></section>

        <section id="difference" className="difference-section section-cream"><div className="container"><SectionLabel number="03">{tr({ en: 'The UFUK difference', ar: 'الفرق مع أفق' })}</SectionLabel><div className="difference-head" data-reveal><h2>{isArabic ? <><span className="h1-line">ابدأ</span><span className="h1-line">بالسؤال الصحيح.</span></> : <><span className="h1-line">Start with the</span><span className="h1-line">right question.</span></>}</h2><div className="question-mark">?</div></div><div className="question-grid" data-reveal><div className="question-card usual"><span>{tr({ en: 'The usual question', ar: 'السؤال المعتاد' })}</span><p>{isArabic ? <><span className="h1-line">«أي باقة</span><span className="h1-line">تريد؟»</span></> : <><span className="h1-line">“What package</span><span className="h1-line">do you want?”</span></>}</p></div><div className="question-card ufuk"><span>{tr({ en: 'The UFUK question', ar: 'سؤال أفق' })}</span><p>{isArabic ? <><span className="h1-line">«ماذا يحتاج</span><em className="h1-line">عملك فعلياً؟»</em></> : <><span className="h1-line">“What does your</span><em className="h1-line">business actually need?”</em></>}</p></div></div><div className="difference-foot" data-reveal><p>{tr({ en: 'Sometimes the answer is strategy. Sometimes it is content, advertising, brand positioning, a website, media production — or a combination of all of them.', ar: 'أحياناً تكون الإجابة استراتيجية، وأحياناً محتوى أو إعلاناً أو تموضعاً للعلامة أو موقعاً إلكترونياً أو إنتاجاً إعلامياً، وربما مزيجاً من ذلك كله.' })}</p><strong>{tr({ en: 'The solution follows the need.', ar: 'الحل يتبع الاحتياج.' })}</strong></div></div></section>

        <section id="marketing" className="section-cream services-section"><div className="container"><div className="section-intro services-intro" data-reveal><SectionLabel number="04">{tr({ en: 'Marketing', ar: 'التسويق' })}</SectionLabel><h2>{isArabic ? <><span className="h1-line">أربعة محاور.</span><span className="h1-line">منظومة واحدة.</span></> : <><span className="h1-line">Four pillars.</span><span className="h1-line">One system.</span></>}</h2><p>{tr({ en: 'Everything we do is connected by one belief: the work gets better when every move serves the same business direction.', ar: 'كل ما نفعله يجمعه إيمان واحد: يصبح العمل أقوى عندما تخدم كل خطوة الاتجاه نفسه.' })}</p></div><div className="services-grid">{serviceGroups.map(({ number, title, icon: Icon, description, items }, index) => <article className="service-group" data-reveal key={title.en} style={{ transitionDelay: `${index * 80}ms` }}><div className="service-top"><span>{number}</span><Icon size={22} /></div><h3>{tr(title)}</h3><p>{tr(description)}</p><ul>{items.map((item) => <li key={item.en}><span>{tr(item)}</span><Check size={13} /></li>)}</ul><a href={whatsappLink({ en: `Hello UFUK, I would like to discuss ${title.en}.`, ar: `مرحباً أفق، أرغب في مناقشة ${title.ar}.` })} target="_blank" rel="noreferrer" className="service-link">{tr({ en: 'Discuss this pillar', ar: 'ناقش هذا المحور' })} <ArrowUpRight size={15} /></a></article>)}</div><div className="website-cta" data-reveal><div className="website-cta-copy"><span className="eyebrow-dark">{tr({ en: 'Digital Solutions', ar: 'الحلول الرقمية' })}</span><h3>{tr({ en: "Need a Website? Let's Talk", ar: 'تحتاج إلى موقع إلكتروني؟ لنتحدث' })} <ArrowRight size={22} /></h3><p>{tr({ en: "From landing pages to full digital experiences — tell us your requirements, features, and scope. We'll discuss pricing and details to find the right build for your business.", ar: 'من صفحات الهبوط إلى التجارب الرقمية المتكاملة — أخبرنا بمتطلباتك وخصائص مشروعك ونطاقه، ولنناقش السعر والتفاصيل للوصول إلى الحل المناسب لعملك.' })}</p></div><a className="button button-primary" href={whatsappLink({ en: "Hello UFUK, I'm interested in Website Development. I'd like to discuss my project requirements, pricing, and details.", ar: 'مرحباً أفق، أنا مهتم بتطوير موقع إلكتروني وأرغب في مناقشة متطلبات مشروعي وتكلفته وتفاصيله.' })} target="_blank" rel="noreferrer">{tr({ en: 'Discuss your website', ar: 'ناقش موقعك الإلكتروني' })} <ArrowUpRight size={17} /></a></div><div className="services-cta" data-reveal><span>{tr({ en: 'Have something specific in mind?', ar: 'لديك فكرة أو احتياج محدد؟' })}</span><a className="button button-dark" href={whatsappLink({ en: 'Hello UFUK, I have something specific in mind and would like to discuss it.', ar: 'مرحباً أفق، لدي احتياج محدد وأرغب في مناقشته.' })} target="_blank" rel="noreferrer">{tr({ en: "Let's discuss your needs", ar: 'لنتحدث عن احتياجاتك' })} <ArrowUpRight size={17} /></a></div></div></section>

        <section className="section-dark process-section"><div className="container"><div className="process-heading" data-reveal><SectionLabel number="05">{tr({ en: 'How we work', ar: 'كيف نعمل' })}</SectionLabel><h2>{isArabic ? <><span className="h1-line">من الفهم</span><em className="h1-line">إلى النمو.</em></> : <><span className="h1-line">From understanding</span><em className="h1-line">to growth.</em></>}</h2><p>{tr({ en: 'Not a straight line. A continuous cycle that keeps the work connected to the business.', ar: 'ليست خطوات مستقيمة، بل دورة مستمرة تبقي العمل مرتبطاً بالعمل التجاري.' })}</p></div><div className="process-track" data-reveal>{processSteps.map(([number, title], index) => <button className={activeStep === index ? 'process-step active' : 'process-step'} key={title.en} onClick={() => setActiveStep(index)}><span>{number}</span><strong>{tr(title)}</strong></button>)}</div><div className="process-detail" data-reveal><div className="process-number">{processSteps[activeStep][0]}</div><div><h3>{tr(processSteps[activeStep][1])}</h3><p>{tr(processSteps[activeStep][2])}</p></div><div className="process-hint"><ChevronDown size={16} /> {tr({ en: 'Tap a stage to explore', ar: 'اختر مرحلة لاستكشافها' })}</div></div></div></section>

        <WorkSection lang={lang} />

        <section id="media" className="section-dark media-section"><div className="container"><div className="media-heading" data-reveal><SectionLabel number="07">{tr({ en: 'Media', ar: 'الإعلام' })}</SectionLabel><h2>{isArabic ? <><span className="h1-line">اجعل</span><em className="h1-line">اللحظة تتحرك.</em></> : <><span className="h1-line">Make the</span><em className="h1-line">moment move.</em></>}</h2><p>{tr({ en: 'For the moments you need right now — from one post to a complete visual system.', ar: 'للحظات التي تحتاجها الآن، من منشور واحد إلى منظومة بصرية متكاملة.' })}</p></div><div className="media-feature" data-reveal><div className="media-image"><img src={imageUrls.film} alt={tr({ en: 'Media production visual', ar: 'مشهد من إنتاج إعلامي' })} loading="lazy" /><div className="play-badge"><Play size={16} fill="currentColor" /></div></div><div className="media-feature-copy"><span className="eyebrow">{tr({ en: 'Individual services', ar: 'خدمات فردية' })}</span><h3>{tr({ en: "Don't want to commit to a package?", ar: 'لا تريد الالتزام بباقة؟' })}</h3><p>{tr({ en: 'Order a single Post or Reel whenever you need one. Complete execution, according to your needs.', ar: 'اطلب منشوراً أو ريلز واحداً وقتما تحتاج. تنفيذ متكامل وفقاً لاحتياجك.' })}</p><div className="price-row"><div><strong>250 <small>{tr(currency)}</small></strong><span>{tr({ en: 'Post', ar: 'منشور' })}</span></div><div><strong>600 <small>{tr(currency)}</small></strong><span>{tr({ en: 'Reel', ar: 'ريلز' })}</span></div></div><a className="text-link" href={whatsappLink({ en: 'Hello UFUK, I would like to order an individual Post or Reel.', ar: 'مرحباً أفق، أرغب في طلب منشور أو ريلز بشكل فردي.' })} target="_blank" rel="noreferrer">{tr({ en: 'Start a conversation', ar: 'ابدأ محادثة' })} <ArrowRight size={16} /></a></div></div><div className="packages-heading" data-reveal><span>{tr({ en: 'Packages', ar: 'الباقات' })}</span><p>{tr({ en: 'Built for a clear content rhythm. Package prices, with management included.', ar: 'مصممة لإيقاع محتوى واضح، وتشمل أسعار الباقات الإدارة.' })}</p><a href="#packages">{tr({ en: 'View packages', ar: 'شاهد الباقات' })} <ArrowDownRight size={15} /></a></div></div></section>

        <section id="packages" className="section-cream packages-section"><div className="container"><div className="packages-grid"><article className="package-card" data-reveal><div className="package-meta"><span>{tr({ en: 'Package 01', ar: 'الباقة 01' })}</span><span>{tr({ en: 'Core rhythm', ar: 'إيقاع أساسي' })}</span></div><h3>5,000 <small>{tr(currency)}</small></h3><ul><li>{tr({ en: '5 Reels', ar: '5 ريلز' })}</li><li>{tr({ en: '10 Posts', ar: '10 منشورات' })}</li><li>{tr({ en: 'Management Included', ar: 'تشمل الإدارة' })}</li></ul><a className="button button-dark" href={whatsappLink({ en: 'Hello UFUK, I would like to choose Package 01 (5,000 EGP).', ar: 'مرحباً أفق، أرغب في اختيار الباقة 01 بسعر 5,000 ج.م.' })} target="_blank" rel="noreferrer">{tr({ en: 'Choose package', ar: 'اختر الباقة' })} <ArrowUpRight size={16} /></a></article><article className="package-card featured" data-reveal><div className="package-meta"><span>{tr({ en: 'Package 02', ar: 'الباقة 02' })}</span><span>{tr({ en: 'Full rhythm', ar: 'إيقاع متكامل' })}</span></div><h3>10,000 <small>{tr(currency)}</small></h3><ul><li>{tr({ en: '10 Reels', ar: '10 ريلز' })}</li><li>{tr({ en: '20 Posts', ar: '20 منشوراً' })}</li><li>{tr({ en: 'Management Included', ar: 'تشمل الإدارة' })}</li></ul><a className="button button-primary" href={whatsappLink({ en: 'Hello UFUK, I would like to choose Package 02 (10,000 EGP).', ar: 'مرحباً أفق، أرغب في اختيار الباقة 02 بسعر 10,000 ج.م.' })} target="_blank" rel="noreferrer">{tr({ en: 'Choose package', ar: 'اختر الباقة' })} <ArrowUpRight size={16} /></a></article></div><div className="starting-note" data-reveal><Plus size={18} /><div><strong>{tr({ en: 'Have something more specific in mind?', ar: 'لديك احتياج أكثر تحديداً؟' })}</strong><p>{tr({ en: "Packages starting from 5,000 EGP. Let's shape the right scope together.", ar: 'الباقات تبدأ من 5,000 ج.م. لنبنِ النطاق المناسب معاً.' })}</p></div><a className="text-link dark-link" href={whatsappLink({ en: 'Hello UFUK, I have a specific scope in mind and would like to discuss it.', ar: 'مرحباً أفق، لدي نطاق محدد وأرغب في مناقشته.' })} target="_blank" rel="noreferrer">{tr({ en: "Let's discuss", ar: 'لنتحدث' })} <ArrowRight size={16} /></a></div></div></section>

        <section id="contact" className="section-dark contact-section"><div className="contact-orbit orbit-one" /><div className="contact-orbit orbit-two" /><div className="container contact-content"><SectionLabel number="08">{tr({ en: "Let's shape what's next", ar: 'لنصنع ما هو قادم' })}</SectionLabel><h2 data-reveal>{isArabic ? <><span className="h1-line">أخبرنا بما</span><em className="h1-line">يحتاجه عملك.</em></> : <><span className="h1-line">Tell us what</span><em className="h1-line">your business needs.</em></>}</h2><p data-reveal>{tr({ en: 'We will help you figure out what it needs next.', ar: 'سنساعدك على اكتشاف خطوته التالية.' })}</p><a className="button button-primary large-button" data-reveal href={whatsappLink({ en: 'Hello UFUK, I would like to start a conversation about my business.', ar: 'مرحباً أفق، أرغب في بدء محادثة حول عملي.' })} target="_blank" rel="noreferrer">{tr({ en: 'Start a conversation', ar: 'ابدأ محادثة' })} <ArrowUpRight size={19} /></a><div className="contact-details" data-reveal><a href="mailto:ufuk.agency1@gmail.com"><Mail size={16} /> ufuk.agency1@gmail.com</a><a href="tel:+201015158464"><Phone size={16} /> 01015158464</a><a href={INSTAGRAM} target="_blank" rel="noreferrer"><Instagram size={16} /> @ufuk_agancy1</a><a href={FACEBOOK} target="_blank" rel="noreferrer"><Facebook size={16} /> {isArabic ? 'أفق' : 'Ufuk Agency'}</a></div></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-row"><a className="brand" href="#top" aria-label={isArabic ? 'أفق، الصفحة الرئيسية' : 'UFUK home'}><BrandMark /><Wordmark lang={lang} /></a><span>{tr({ en: 'Strategy + Creative + Performance', ar: 'استراتيجية + إبداع + أداء' })}</span><div className="footer-socials"><a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={17} /></a><a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={17} /></a></div><span>{isArabic ? '© 2026 أفق' : '© 2026 UFUK'}</span></div></footer>

    </div>
  );
}

export default App;
