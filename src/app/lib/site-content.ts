export const locales = ["tr", "en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  ar: "العربية",
};

export const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
};

export const localeDirections: Record<Locale, "ltr" | "rtl"> = {
  tr: "ltr",
  en: "ltr",
  ar: "rtl",
};

export const sectionIds = {
  hero: "hero",
  about: "hakkimizda",
  products: "urunler",
  sectors: "sektorler",
  production: "uretim",
  projects: "projeler",
  export: "ihracat",
  news: "haberler",
  contact: "iletisim",
} as const;

export const translations = {
  tr: {
    brandTag: "Marine lifting engineering",
    brandClaim: "Marine lifting solutions",
    nav: {
      home: "Ana Sayfa",
      about: "Hakkımızda",
      products: "Ürünler",
      projects: "Projeler",
      contact: "İletişim",
    },
    hero: {
      eyebrow: "Marine lifting engineering",
      title: "Gemi ve deniz platformları için güvenli, sertifikalı vinç çözümleri.",
      description:
        "Atlantis Crane, hazır ürünlerin yanında müşteriye özel kaldırma sistemleri geliştiren, test eden ve uluslararası kurulum desteği sağlayan mühendislik odaklı bir üreticidir.",
      primaryCta: "Proje Konuşalım",
      secondaryCta: "Ürünleri İncele",
      stats: [
        { value: "3", label: "Dil yapısı" },
        { value: "100%", label: "Özel proje odaklı" },
        { value: "Global", label: "Kurulum ve destek" },
      ],
      highlightsTitle: "Öne çıkanlar",
      highlights: [
        "Tasarlayan, üreten, test eden ve sahada destek veren tek yapı",
        "İstanbul merkezli, Dubai tarafında bölgesel ve lojistik destek",
        "Dayanıklılık, güvenlik ve uluslararası standartlara odaklı üretim",
      ],
      workingTitle: "Çalışma yapısı",
      working: [
        "Hazır ürün + özel çözüm yaklaşımı",
        "Test, kalite kontrol ve sevkiyat süreci",
        "İhracat ve uluslararası saha desteği",
      ],
    },
    about: {
      eyebrow: "Hakkımızda",
      title: "Mühendislik odaklı üretim yaklaşımı",
      description:
        "Atlantis Crane, gemi ve deniz platformları için vinçler tasarlar ve üretir. Hazır ürünlerin yanında müşteriye özel kaldırma çözümleri geliştirir; ürettiği ekipmanların testini, kalite kontrolünü ve sevkiyatını da üstlenir. Dayanıklılık, güvenlik ve sertifikasyon standartlarını merkeze alan bu yapı, uluslararası kurulum ve destek süreçlerinde de aktiftir.",
    },
    products: {
      eyebrow: "Ürünler",
      title: "Farklı operasyonlara uygun vinç aileleri",
      description:
        "Ürün sayfası daha sonra teknik özellikler, sertifikalar ve model bazlı detaylarla genişletilebilir.",
      items: [
        {
          title: "Katlanır Bomlu Vinçler",
          description:
            "Dar alanlarda esnek kullanım ve güvenli operasyon için kompakt çözümler.",
        },
        {
          title: "Teleskopik Vinçler",
          description:
            "Farklı erişim mesafeleri ve operasyon senaryoları için ayarlanabilir yapılar.",
        },
        {
          title: "Sabit Bomlu Vinçler",
          description:
            "Sürekli çalışma ve yüksek dayanım gerektiren uygulamalar için sağlam tasarım.",
        },
        {
          title: "Özel Kaldırma Sistemleri",
          description:
            "Proje gereksinimlerine göre tasarlanan, sertifikasyon odaklı mühendislik çözümleri.",
        },
      ],
    },
    sectors: {
      eyebrow: "Sektörler / Kullanım Alanları",
      title: "Denizcilik, offshore ve kıyı projelerinde kullanım",
      items: [
        "Gemi üstü yükleme ve boşaltma",
        "Offshore ve açık deniz operasyonları",
        "Limanlar ve tersaneler",
        "Barge üstü işler",
        "İnşaat ve kıyı projeleri",
        "Özel denizcilik uygulamaları",
      ],
    },
    production: {
      eyebrow: "Üretim",
      title: "Tasarım, üretim, test ve sevkiyat tek akış",
      description:
        "Süreç; mühendislik, üretim, test, kalite kontrol ve sevkiyat aşamalarını kapsar. Bu yapı, uluslararası teslimatlarda güvenilir bir operasyon zemini sunar.",
      steps: [
        "Tasarım ve mühendislik",
        "İmalat ve montaj",
        "Test ve kalite kontrol",
        "Sevkiyat ve kurulum desteği",
      ],
    },
    projects: {
      eyebrow: "Projeler",
      title: "Referans projeleri, ölçülebilir mühendislik çıktılarıyla sunacağız.",
      description:
        "Bu alanı daha sonra vaka çalışmaları, teslim edilen üniteler, uygulama fotoğrafları ve proje özetleri ile doldurabiliriz.",
      note: 'Proje sayfaları için sonrasında "zorluk, çözüm, ekipman, sonuç" yapısında detaylı şablon hazırlayabiliriz.',
    },
    export: {
      eyebrow: "İhracat & Global Yapı",
      title: "İstanbul merkezli, Dubai destekli uluslararası operasyon",
      description:
        "Firma, ihracat ve uluslararası kurulum/destek tarafında aktif olduğunu vurgular. Bu bölümde lojistik ağ, bölgesel destek ve küresel teslimat kabiliyeti öne çıkarılabilir.",
    },
    news: {
      eyebrow: "Haberler / İçerikler",
      title: "Sektörel içerikler ve şirket haberleri için alan",
      description:
        "Bu bölüm daha sonra fuar katılımları, teslimatlar, teknik yazılar ve duyurular için kullanılabilir.",
      cta: "İçerik planı konuşalım",
    },
    contact: {
      eyebrow: "İletişim",
      title: "Projenizi birlikte şekillendirelim.",
      description:
        "Teklif, teknik görüşme veya uluslararası destek talepleri için bu alanı kullanabiliriz. Bir sonraki adımda burada çok dilli iletişim formu kurabiliriz.",
      locations: ["İstanbul, Türkiye", "Dubai, BAE"],
      email: "info@atlantiscrane.com",
      phone: "+90 000 000 00 00",
    },
    footer: {
      description:
        "Gemi ve deniz platformları için vinç tasarlayan, üreten, test eden ve uluslararası kurulum desteği sağlayan mühendislik odaklı bir üretici.",
      quickLinks: "Hızlı Linkler",
    },
  },
  en: {
    brandTag: "Marine lifting engineering",
    brandClaim: "Marine lifting solutions",
    nav: {
      home: "Home",
      about: "About",
      products: "Products",
      projects: "Projects",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Marine lifting engineering",
      title: "Safe, certified crane solutions for ships and marine platforms.",
      description:
        "Atlantis Crane designs and manufactures lifting systems for marine applications, develops custom solutions, and provides testing, quality control, and international installation support.",
      primaryCta: "Discuss a Project",
      secondaryCta: "Explore Products",
      stats: [
        { value: "3", label: "Language setup" },
        { value: "100%", label: "Custom project focus" },
        { value: "Global", label: "Installation and support" },
      ],
      highlightsTitle: "Highlights",
      highlights: [
        "One team that designs, manufactures, tests, and supports on site",
        "Based in Istanbul with regional and logistics support in Dubai",
        "Built around durability, safety, and international standards",
      ],
      workingTitle: "How we work",
      working: [
        "Ready products + custom solutions",
        "Testing, quality control, and shipping",
        "Export and international site support",
      ],
    },
    about: {
      eyebrow: "About",
      title: "Engineering-led manufacturing approach",
      description:
        "Atlantis Crane designs and manufactures cranes for ships and marine platforms. Alongside ready-made products, it develops custom lifting solutions, handling testing, quality control, and shipping. The company emphasizes durability, safety, and certification, while also supporting international installation and service.",
    },
    products: {
      eyebrow: "Products",
      title: "Crane families for different operations",
      description:
        "This page can later be expanded with technical specs, certifications, and model-level details.",
      items: [
        {
          title: "Folding Boom Cranes",
          description:
            "Compact solutions for flexible use and safe operations in tight spaces.",
        },
        {
          title: "Telescopic Cranes",
          description:
            "Adjustable structures for different reach requirements and operational scenarios.",
        },
        {
          title: "Fixed Boom Cranes",
          description:
            "Robust designs for continuous operation and demanding applications.",
        },
        {
          title: "Custom Lifting Systems",
          description:
            "Engineering solutions designed around project-specific requirements and certification needs.",
        },
      ],
    },
    sectors: {
      eyebrow: "Sectors / Applications",
      title: "Use across marine, offshore, and coastal projects",
      items: [
        "Ship loading and unloading",
        "Offshore and open sea operations",
        "Ports and shipyards",
        "Barge-based operations",
        "Construction and coastal projects",
        "Special marine applications",
      ],
    },
    production: {
      eyebrow: "Production",
      title: "Design, manufacturing, testing, and shipping in one flow",
      description:
        "The process covers engineering, manufacturing, testing, quality control, and shipping. This creates a reliable foundation for international delivery.",
      steps: [
        "Design and engineering",
        "Fabrication and assembly",
        "Testing and quality control",
        "Shipping and installation support",
      ],
    },
    projects: {
      eyebrow: "Projects",
      title: "We will present reference projects with measurable engineering outcomes.",
      description:
        "This area can later be populated with case studies, delivered units, application photos, and project summaries.",
      note: 'For project pages, we can later build a detailed structure around "challenge, solution, equipment, result".',
    },
    export: {
      eyebrow: "Export & Global Structure",
      title: "International operations from Istanbul, supported by Dubai",
      description:
        "The company highlights active export operations and international installation/support. This section can emphasize logistics, regional support, and global delivery capability.",
    },
    news: {
      eyebrow: "News / Content",
      title: "A space for industry content and company updates",
      description:
        "This section can later be used for trade fairs, deliveries, technical articles, and announcements.",
      cta: "Plan the content",
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's shape your project together.",
      description:
        "Use this area for quotes, technical discussions, or international support requests. Next, we can add a multilingual contact form here.",
      locations: ["Istanbul, Turkey", "Dubai, UAE"],
      email: "info@atlantiscrane.com",
      phone: "+90 000 000 00 00",
    },
    footer: {
      description:
        "An engineering-focused manufacturer that designs, produces, tests, and supports cranes for ships and marine platforms.",
      quickLinks: "Quick Links",
    },
  },
  ar: {
    brandTag: "Marine lifting engineering",
    brandClaim: "Marine lifting solutions",
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      products: "المنتجات",
      projects: "المشاريع",
      contact: "اتصل بنا",
    },
    hero: {
      eyebrow: "Marine lifting engineering",
      title: "حلول رافعات آمنة ومعتمدة للسفن والمنصات البحرية.",
      description:
        "تقوم Atlantis Crane بتصميم وتصنيع أنظمة الرفع للتطبيقات البحرية، وتطوير حلول مخصصة، بالإضافة إلى الاختبار وضبط الجودة ودعم التركيب الدولي.",
      primaryCta: "ناقش المشروع",
      secondaryCta: "استعرض المنتجات",
      stats: [
        { value: "3", label: "إعداد لغات" },
        { value: "100%", label: "تركيز على المشاريع الخاصة" },
        { value: "Global", label: "التركيب والدعم" },
      ],
      highlightsTitle: "أبرز النقاط",
      highlights: [
        "فريق واحد للتصميم والتصنيع والاختبار والدعم الميداني",
        "مقرها إسطنبول مع دعم إقليمي ولوجستي في دبي",
        "التركيز على المتانة والسلامة والمعايير الدولية",
      ],
      workingTitle: "آلية العمل",
      working: [
        "منتجات جاهزة + حلول مخصصة",
        "الاختبار وضبط الجودة والشحن",
        "التصدير والدعم الدولي في الموقع",
      ],
    },
    about: {
      eyebrow: "من نحن",
      title: "تصنيع قائم على الهندسة",
      description:
        "تصمم Atlantis Crane وتنتج الرافعات للسفن والمنصات البحرية. وبجانب المنتجات الجاهزة، تطور حلول رفع مخصصة وتتكفل بالاختبار وضبط الجودة والشحن. وتركز الشركة على المتانة والسلامة واعتماد المعايير، مع دعم للتركيب والخدمة الدولية.",
    },
    products: {
      eyebrow: "المنتجات",
      title: "عائلات رافعات لعمليات مختلفة",
      description:
        "يمكن توسيع هذه الصفحة لاحقًا بالمواصفات الفنية والشهادات والتفاصيل حسب كل طراز.",
      items: [
        {
          title: "رافعات الذراع القابلة للطي",
          description:
            "حلول مدمجة للاستخدام المرن والعمليات الآمنة في المساحات الضيقة.",
        },
        {
          title: "الرافعات التلسكوبية",
          description:
            "هياكل قابلة للتعديل لتناسب متطلبات الوصول المختلفة والسيناريوهات التشغيلية.",
        },
        {
          title: "الرافعات ذات الذراع الثابت",
          description:
            "تصاميم متينة للتشغيل المستمر والتطبيقات عالية المتطلبات.",
        },
        {
          title: "أنظمة الرفع المخصصة",
          description:
            "حلول هندسية مصممة وفق متطلبات المشروع واحتياجات الاعتماد.",
        },
      ],
    },
    sectors: {
      eyebrow: "القطاعات / الاستخدامات",
      title: "الاستخدام في المشاريع البحرية والبحرية المفتوحة والساحلية",
      items: [
        "التحميل والتفريغ على السفن",
        "العمليات البحرية والبحر المفتوح",
        "الموانئ وأحواض بناء السفن",
        "العمليات على البارجات",
        "مشاريع البناء والساحل",
        "تطبيقات بحرية خاصة",
      ],
    },
    production: {
      eyebrow: "الإنتاج",
      title: "التصميم، التصنيع، الاختبار، والشحن في مسار واحد",
      description:
        "تشمل العملية الهندسة والتصنيع والاختبار وضبط الجودة والشحن. وهذا يوفر أساسًا موثوقًا للتسليم الدولي.",
      steps: [
        "التصميم والهندسة",
        "التصنيع والتجميع",
        "الاختبار وضبط الجودة",
        "الشحن ودعم التركيب",
      ],
    },
    projects: {
      eyebrow: "المشاريع",
      title: "سنقدم المشاريع المرجعية بنتائج هندسية قابلة للقياس.",
      description:
        "يمكن ملء هذه المساحة لاحقًا بدراسات حالة، والوحدات المسلّمة، وصور التطبيقات، وملخصات المشاريع.",
      note: 'يمكننا لاحقًا إعداد قالب تفصيلي للمشاريع بصيغة "التحدي، الحل، المعدات، النتيجة".',
    },
    export: {
      eyebrow: "التصدير والبنية العالمية",
      title: "عمليات دولية من إسطنبول مع دعم من دبي",
      description:
        "تؤكد الشركة نشاطها في التصدير والدعم الدولي للتركيب. ويمكن إبراز شبكة اللوجستيات والدعم الإقليمي وقدرة التسليم العالمية هنا.",
    },
    news: {
      eyebrow: "الأخبار / المحتوى",
      title: "مساحة للمحتوى الصناعي وأخبار الشركة",
      description:
        "يمكن استخدام هذا القسم لاحقًا للمعارض والتسليمات والمقالات التقنية والإعلانات.",
      cta: "لنخطط للمحتوى",
    },
    contact: {
      eyebrow: "اتصل بنا",
      title: "دعنا نشكل مشروعك معًا.",
      description:
        "استخدم هذه المساحة للعروض الفنية أو طلبات الدعم الدولية. في الخطوة التالية يمكننا إضافة نموذج اتصال متعدد اللغات هنا.",
      locations: ["إسطنبول، تركيا", "دبي، الإمارات العربية المتحدة"],
      email: "info@atlantiscrane.com",
      phone: "+90 000 000 00 00",
    },
    footer: {
      description:
        "شركة تصنيع هندسية تصمم وتنتج وتختبر وتدعم الرافعات للسفن والمنصات البحرية.",
      quickLinks: "روابط سريعة",
    },
  },
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
