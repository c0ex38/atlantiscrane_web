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
      eyebrow: "Temel Felsefemiz",
      title: "Uluslararası standartlarda modern mühendislik.",
      subtitleHighlight: "Mühendislik,",
      subtitle: "kaldırdığımız her şeyin temelindedir.",
      description:
        "Atlantis Crane, Türk gemi inşa sanayinin kalbi olan İstanbul Tuzla'da, en zorlu deniz koşullarına dayanacak şekilde son teknoloji ekipmanlar tasarlayan mühendislik odaklı bir Türk üreticidir. Birleşik Arap Emirlikleri ve Körfez tersanelerinde yaygın servis ağımızla hizmetinizdeyiz.",
      primaryBtn: "HİKAYEMİZ",
      secondaryBtn: "ÜRETİM TESİSİMİZ",
      stats: [
        { value: "2001", label: "Kuruluş Yılı", suffix: "" },
        { value: "300", label: "Teslim Edilen Vinç", suffix: "+" },
        { value: "7", label: "Aktif Pazar", suffix: "+ Ülke" },
      ],
      values: [
        { icon: "shield", title: "Küresel Sertifikasyon", description: "DNV, Lloyd's, Bureau Veritas ve ABS standartlarında tasarım ve test." },
        { icon: "gear", title: "Özel Mühendislik", description: "Her proje için müşteriye özel tasarım, hesaplama ve 3D CAD modelleme." },
        { icon: "globe", title: "Uluslararası Kurulum", description: "İstanbul'dan Dubai'ye uzanan saha destek ve kurulum ağı." },
      ],
    },
    products: {
      eyebrow: "Ürün Gruplarımız",
      title: "Endüstriyel Gücün Tanımı",
      exploreAll: "Tüm ürünleri incele",
      viewDetail: "Detayları gör",
      description:
        "Ürün sayfası daha sonra teknik özellikler, sertifikalar ve model bazlı detaylarla genişletilebilir.",
      items: [
        {
          title: "Katlanır Bomlu Deniz Vinçleri",
          description: "Dar güvertelerde ve kısıtlı alanlarda maksimum esneklik ve depolama kolaylığı sağlayan hidrolik katlanır tasarımlar.",
          capacity: "1.5 - 25 Ton",
          outreach: "6 - 24 Metre",
        },
        {
          title: "Teleskopik Bomlu Deniz Vinçleri",
          description: "Uzun erişim mesafesi ve hassas yük konumlandırma gerektiren operasyonlar için tasarlanmış uzayabilir bomlu vinçler.",
          capacity: "2 - 40 Ton",
          outreach: "8 - 32 Metre",
        },
        {
          title: "Sabit Bomlu Deniz Vinçleri",
          description: "Güverte üstü genel yük, servis ve malzeme transfer operasyonları için yüksek dayanımlı, minimum bakım gerektiren sabit çözümler.",
          capacity: "1 - 15 Ton",
          outreach: "5 - 20 Metre",
        },
        {
          title: "Katlanır Teleskopik Deniz Vinçleri",
          description: "Katlanma fonksiyonu ile teleskopik uzama özelliğini birleştiren, çok amaçlı ve yüksek erişimli hibrit kaldırma sistemleri.",
          capacity: "2 - 30 Ton",
          outreach: "7 - 28 Metre",
        },
        {
          title: "Offshore (Açık Deniz) Vinçleri",
          description: "Derin deniz platformları ve sondaj gemileri için dalga sönümleme (AHC) ve patlama korumalı (ATEX) ağır hizmet vinçleri.",
          capacity: "5 - 120 Ton",
          outreach: "12 - 45 Metre",
        },
        {
          title: "Kumanya ve Servis Vinçleri",
          description: "Gemi personelinin günlük malzeme, yedek parça ve kumanya transferi için tasarlanmış kompakt, hızlı ve güvenli kreynler.",
          capacity: "0.5 - 5 Ton",
          outreach: "4 - 15 Metre",
        },
        {
          title: "Filika ve Kurtarma Davitleri",
          description: "Acil durumlarda can kurtarma botlarının ve hızlı kurtarma botlarının (FRC) denize güvenli ve hızlı indirilmesini sağlayan davit sistemleri.",
          capacity: "1.5 - 8 Ton",
          outreach: "3 - 8 Metre",
        },
        {
          title: "A-Frame Kaldırma Sistemleri",
          description: "Araştırma gemileri ve offshore operasyonlarında denizaltı cihazları (ROV), sonarlar ve kablo serim sistemleri için kıç kaldırma çerçeveleri.",
          capacity: "5 - 60 Ton",
          outreach: "4 - 12 Metre",
        },
      ],
    },    sectors: {
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
      rights: "Tüm hakları saklıdır.",
      multilingual: "Çok dilli platform",
    },
    history: {
      eyebrow: "Yılların Birikimi ve Çözüm Ağı",
      title: "Üretim Kronolojimiz",
      items: [
        {
          year: "2001",
          title: "Tuzla'da Kuruluş",
          description: "Yerel Tuzla tersanelerine ambar kapakları ve güverte teçhizatları üreten özel bir çelik imalat atölyesi olarak kuruldu."
        },
        {
          year: "2008",
          title: "İlk Deniz Güverte Vinçleri",
          description: "DNV sertifikalı ilk hidrolik teleskopik deniz vincini üretti. Mühendislik ve Ar-Ge ekibi tamamen kaldırma çözümlerine odaklanacak şekilde genişletildi."
        },
        {
          year: "2015",
          title: "İhracat Ağı ve Dubai Ofisi",
          description: "Uluslararası satış kanalları oluşturuldu. Birleşik Arap Emirlikleri, Abu Dabi ve Dubai limanlarında çalışan açık deniz destek gemileri (OSV) için ilk büyük vinç siparişleri teslim edildi."
        },
        {
          year: "2026",
          title: "Küresel Vinç Üreticisi",
          description: "Dünya çapında ağır hizmet vinçleri teslimatı. Akıllı uzaktan izleme sistemleri, özel katlanır bom tasarımları ve 7/24 liman teknik destek ağının devreye alınması."
        }
      ]
    },
    standards: {
      eyebrow: "Zorlu Deniz Şartları İçin Tasarlandı",
      title: "Atlantis Mühendislik Standartları",
      items: [
        {
          title: "Küresel Sertifikasyon",
          description: "Tüm deniz vinçleri; Lloyd's Register, DNV, Bureau Veritas ve ABS gibi önde gelen uluslararası loyd kuruluşlarının kurallarına uygun olarak tasarlanır, kaynaklanır ve test edilir."
        },
        {
          title: "C5-M Deniz Tipi Boya",
          description: "Yüksek tuzluluk oranına, neme ve UV ışınlarına karşı koruma sağlayan aşırı korozif sınıf kumlama ve çok katmanlı epoksi deniz tipi boyama teknolojisi uygulanır."
        },
        {
          title: "Sonlu Elemanlar Analizi (FEM)",
          description: "Maksimum güvenlik marjını garanti etmek için her kaynak dikişi, silindir bağlantısı ve dönüş çemberi, açık deniz dalga yükleri altında ANSYS sistemleriyle analiz edilir."
        }
      ]
    },
    exportNetwork: {
      eyebrow: "Küresel Varlık",
      title: "Global İhracat Ağımız",
      subtitle: "Beş kıtada sertifikalı deniz kaldırma çözümleri sunuyoruz. Sol taraftaki listeden veya doğrudan haritadan etkileşimli olarak ihracat pazarlarımızı inceleyebilirsiniz.",
      listTitle: "İHRACAT PAZARLARI",
      craneLabel: "Vinç",
      activeOperation: "Aktif Operasyon:",
      items: [
        { country: "Birleşik Arap Emirlikleri", count: 120 },
        { country: "Türkiye", count: 85 },
        { country: "Suudi Arabistan", count: 45 },
        { country: "Amerika Birleşik Devletleri", count: 25 },
        { country: "Katar", count: 22 },
        { country: "Norveç", count: 20 },
        { country: "Azerbaycan", count: 18 },
      ]
    },
    ctaSection: {
      eyebrow: "Denizcilik projelerinizi güçlendirmeye hazır mısınız?",
      title: "Teknik Detayları\nMühendislerimizle Görüşün",
      description: "Gemi güverte yerleşiminiz ve klas kuruluşu gereksinimleriniz doğrultusunda özel olarak hazırlanmış 3D CAD mühendislik modelleri, yük diyagramları ve sertifikalı teklifler hazırlıyoruz.",
      primaryBtn: "TEKLİF AL",
      secondaryBtn: "İLETİŞİM",
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
      eyebrow: "Our Core Philosophy",
      title: "Modern engineering at international standards.",
      subtitleHighlight: "Engineering",
      subtitle: "is at the core of everything we lift.",
      description:
        "Atlantis Crane is an engineering-focused Turkish manufacturer based in Istanbul Tuzla, the heart of the Turkish shipbuilding industry, designing state-of-the-art equipment to withstand the harshest marine conditions. We are at your service with our extensive service network in the United Arab Emirates and Gulf shipyards.",
      primaryBtn: "OUR STORY",
      secondaryBtn: "PRODUCTION FACILITY",
      stats: [
        { value: "2001", label: "Founded", suffix: "" },
        { value: "300", label: "Cranes Delivered", suffix: "+" },
        { value: "7", label: "Active Markets", suffix: "+ Countries" },
      ],
      values: [
        { icon: "shield", title: "Global Certification", description: "Designed and tested under DNV, Lloyd's, Bureau Veritas and ABS standards." },
        { icon: "gear", title: "Custom Engineering", description: "Tailored design, load calculations and 3D CAD modeling for every project." },
        { icon: "globe", title: "International Deployment", description: "Field support and installation network from Istanbul to Dubai." },
      ],
    },
    products: {
      eyebrow: "Catalog",
      title: "Products",
      exploreAll: "Explore the full catalog",
      viewDetail: "View details",
      items: [
        {
          title: "Knuckle Boom Marine Cranes",
          description: "Hydraulic folding designs providing maximum flexibility and ease of storage on tight decks and restricted spaces.",
          capacity: "1.5 - 25 Tons",
          outreach: "6 - 24 Meters",
        },
        {
          title: "Telescopic Boom Marine Cranes",
          description: "Extendable boom cranes designed for operations requiring long outreach and high-precision load positioning.",
          capacity: "2 - 40 Tons",
          outreach: "8 - 32 Meters",
        },
        {
          title: "Stiff Boom Marine Cranes",
          description: "High-durability, minimum maintenance fixed boom solutions for general cargo, service, and supply transfer operations.",
          capacity: "1 - 15 Tons",
          outreach: "5 - 20 Meters",
        },
        {
          title: "Knuckle Telescopic Cranes",
          description: "Hybrid multi-purpose lifting systems combining knuckle folding functionality with telescopic outreach.",
          capacity: "2 - 30 Tons",
          outreach: "7 - 28 Meters",
        },
        {
          title: "Offshore Heavy Lift Cranes",
          description: "Heavy-duty cranes equipped with Active Heave Compensation (AHC) and explosion protection (ATEX) for platforms and drillships.",
          capacity: "5 - 120 Tons",
          outreach: "12 - 45 Meters",
        },
        {
          title: "Provision & Service Cranes",
          description: "Compact, fast, and safe deck cranes designed for daily supplies, spare parts, and provision transfer for vessel crew.",
          capacity: "0.5 - 5 Tons",
          outreach: "4 - 15 Meters",
        },
        {
          title: "Lifeboat & Rescue Davits",
          description: "Davit systems ensuring safe, rapid launch and recovery of lifeboats and Fast Rescue Crafts (FRC) in critical conditions.",
          capacity: "1.5 - 8 Tons",
          outreach: "3 - 8 Meters",
        },
        {
          title: "A-Frame Launch Systems",
          description: "Stern-mounted launch and recovery frames for marine research equipment, underwater ROVs, sonars, and cable laying systems.",
          capacity: "5 - 60 Tons",
          outreach: "4 - 12 Meters",
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
      rights: "All rights reserved.",
      multilingual: "Multilingual platform",
    },
    history: {
      eyebrow: "Years of Experience & Solution Network",
      title: "Production Chronology",
      items: [
        {
          year: "2001",
          title: "Establishment in Tuzla",
          description: "Founded as a specialized steel fabrication workshop producing hatch covers and deck equipment for local Tuzla shipyards."
        },
        {
          year: "2008",
          title: "First Marine Deck Cranes",
          description: "Manufactured the first DNV certified hydraulic telescopic marine crane. The engineering and R&D team was expanded to focus entirely on lifting solutions."
        },
        {
          year: "2015",
          title: "Export Network and Dubai Office",
          description: "International sales channels were established. First major crane orders were delivered for offshore support vessels (OSV) operating in UAE, Abu Dhabi, and Dubai ports."
        },
        {
          year: "2026",
          title: "Global Crane Manufacturer",
          description: "Worldwide delivery of heavy-duty cranes. Deployment of smart remote monitoring systems, custom folding boom designs, and a 24/7 port technical support network."
        }
      ]
    },
    standards: {
      eyebrow: "Designed for Harsh Marine Environments",
      title: "Atlantis Engineering Standards",
      items: [
        {
          title: "Global Certification",
          description: "All marine cranes are designed, welded, and tested in compliance with the rules of leading international classification societies such as Lloyd's Register, DNV, Bureau Veritas, and ABS."
        },
        {
          title: "C5-M Marine Grade Paint",
          description: "Extremely corrosive class sandblasting and multi-layer epoxy marine painting technology is applied to provide protection against high salinity, moisture, and UV rays."
        },
        {
          title: "Finite Element Analysis (FEM)",
          description: "To guarantee maximum safety margins, every weld seam, cylinder connection, and slewing ring is analyzed with ANSYS systems under offshore wave loads."
        }
      ]
    },
    exportNetwork: {
      eyebrow: "Global Presence",
      title: "Our Global Export Network",
      subtitle: "We provide certified marine lifting solutions across five continents. You can interactively explore our export markets from the list on the left or directly on the map.",
      listTitle: "EXPORT MARKETS",
      craneLabel: "Cranes",
      activeOperation: "Active Operation:",
      items: [
        { country: "United Arab Emirates", count: 120 },
        { country: "Turkey", count: 85 },
        { country: "Saudi Arabia", count: 45 },
        { country: "United States of America", count: 25 },
        { country: "Qatar", count: 22 },
        { country: "Norway", count: 20 },
        { country: "Azerbaycan", count: 18 },
      ]
    },
    ctaSection: {
      eyebrow: "Ready to empower your marine projects?",
      title: "Discuss Technical Details\nwith Our Engineers",
      description: "We prepare custom 3D CAD engineering models, load diagrams, and certified proposals tailored to your ship's deck layout and classification society requirements.",
      primaryBtn: "GET A QUOTE",
      secondaryBtn: "CONTACT US",
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
      eyebrow: "فلسفتنا الأساسية",
      title: "هندسة حديثة بمعايير دولية.",
      subtitleHighlight: "الهندسة",
      subtitle: "هي جوهر كل ما نرفعه.",
      description:
        "شركة Atlantis Crane هي شركة تركية مصنعة تركز على الهندسة، ومقرها في إسطنبول توزلا، قلب صناعة بناء السفن التركية، وتقوم بتصميم أحدث المعدات لتحمل أقسى الظروف البحرية. نحن في خدمتكم من خلال شبكة خدماتنا الواسعة في الإمارات العربية المتحدة وأحواض بناء السفن في الخليج.",
      primaryBtn: "قصتنا",
      secondaryBtn: "منشأة الإنتاج",
      stats: [
        { value: "2001", label: "تأسست", suffix: "" },
        { value: "300", label: "رافعات مسلّمة", suffix: "+" },
        { value: "7", label: "أسواق نشطة", suffix: "+ دول" },
      ],
      values: [
        { icon: "shield", title: "شهادة عالمية", description: "مصممة ومختبرة وفق معايير DNV وLloyd's وBureau Veritas وABS." },
        { icon: "gear", title: "هندسة مخصصة", description: "تصميم مخصص وحسابات التحميل ونمذجة CAD ثلاثية الأبعاد لكل مشروع." },
        { icon: "globe", title: "النشر الدولي", description: "شبكة دعم ميداني وتركيب من إسطنبول إلى دبي." },
      ],
    },
    products: {
      eyebrow: "فهرس",
      title: "المنتجات",
      exploreAll: "استكشف الكتالوج الكامل",
      viewDetail: "عرض التفاصيل",
      items: [
        {
          title: "رافعات بحرية ذات ذراع مفصلي",
          description: "تصميمات هيدروليكية قابلة للطي توفر مرونة قصوى وسهولة في التخزين على الأسطح الضيقة والمساحات المحدودة.",
          capacity: "1.5 - 25 طن",
          outreach: "6 - 24 متر",
        },
        {
          title: "رافعات بحرية ذات ذراع تلسكوبي",
          description: "رافعات ذات أذرع قابلة للتمدد مصممة للعمليات التي تتطلب مدى وصول طويلاً وتحديدًا دقيقًا لموقع الحمولة.",
          capacity: "2 - 40 طن",
          outreach: "8 - 32 متر",
        },
        {
          title: "رافعات بحرية ذات ذراع ثابت",
          description: "حلول ذراع ثابتة عالية المتانة وبأقل قدر من الصيانة لعمليات البضائع العامة والخدمات ونقل الإمدادات.",
          capacity: "1 - 15 طن",
          outreach: "5 - 20 متر",
        },
        {
          title: "رافعات مفصلية تلسكوبية",
          description: "أنظمة رفع هجينة متعددة الأغراض تجمع بين وظيفة الطي المفصلي والمد التلسكوبي.",
          capacity: "2 - 30 طن",
          outreach: "7 - 28 متر",
        },
        {
          title: "رافعات المنصات البحرية (Offshore)",
          description: "رافعات للخدمات الشاقة مخصصة للمنصات البحرية العميقة، مجهزة بنظام تعويض الأمواج النشط وحماية من الانفجار للمنصات وسفن الحفر.",
          capacity: "5 - 120 طن",
          outreach: "12 - 45 متر",
        },
        {
          title: "رافعات المؤن والخدمة",
          description: "رافعات سطح مدمجة وسريعة وآمنة مصممة لنقل الإمدادات اليومية وقطع الغيار والمؤن لطاقم السفينة.",
          capacity: "0.5 - 5 طن",
          outreach: "4 - 15 متر",
        },
        {
          title: "رافعات قوارب النجاة والإنقاذ",
          description: "أنظمة دافت تضمن إطلاقًا واستعادة آمنة وسريعة لقوارب النجاة وقوارب الإنقاذ السريعة في الظروف الحرجة.",
          capacity: "1.5 - 8 طن",
          outreach: "3 - 8 متر",
        },
        {
          title: "أنظمة الرفع على شكل A-Frame",
          description: "إطارات إطلاق واستعادة مثبتة في المؤخرة لمعدات الأبحاث البحرية، ومركبات ROV تحت الماء، والسونار.",
          capacity: "5 - 60 طن",
          outreach: "4 - 12 متر",
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
      rights: "جميع الحقوق محفوظة.",
      multilingual: "منصة متعددة اللغات",
    },
    history: {
      eyebrow: "سنوات من الخبرة وشبكة الحلول",
      title: "التسلسل الزمني للإنتاج",
      items: [
        {
          year: "2001",
          title: "التأسيس في توزلا",
          description: "تأسست كورشة متخصصة في تصنيع الصلب لإنتاج أغطية العنابر ومعدات سطح السفن لأحواض بناء السفن المحلية في توزلا."
        },
        {
          year: "2008",
          title: "أول رافعات سطح السفينة",
          description: "تصنيع أول رافعة بحرية تلسكوبية هيدروليكية معتمدة من DNV. تم توسيع فريق الهندسة والبحث والتطوير للتركيز كليًا على حلول الرفع."
        },
        {
          year: "2015",
          title: "شبكة التصدير ومكتب دبي",
          description: "تم إنشاء قنوات بيع دولية. تسليم أول طلبات الرافعات الكبيرة لسفن الدعم البحري (OSV) العاملة في موانئ الإمارات وأبو ظبي ودبي."
        },
        {
          year: "2026",
          title: "مُصنّع رافعات عالمي",
          description: "تسليم رافعات للخدمة الشاقة في جميع أنحاء العالم. نشر أنظمة مراقبة ذكية عن بعد، وتصميمات أذرع طي مخصصة، وشبكة دعم فني للموانئ تعمل على مدار الساعة طوال أيام الأسبوع."
        }
      ]
    },
    standards: {
      eyebrow: "مصمم لبيئات بحرية قاسية",
      title: "معايير هندسة أتلانتس",
      items: [
        {
          title: "شهادة عالمية",
          description: "تم تصميم ولحام واختبار جميع الرافعات البحرية وفقًا لقواعد هيئات التصنيف الدولية الرائدة مثل Lloyd's Register و DNV و Bureau Veritas و ABS."
        },
        {
          title: "طلاء بحري فئة C5-M",
          description: "يتم تطبيق تقنية السفع الرملي شديدة التآكل وطلاء الإيبوكسي البحري متعدد الطبقات لتوفير حماية ضد الملوحة العالية والرطوبة والأشعة فوق البنفسجية."
        },
        {
          title: "تحليل العناصر المحدودة (FEM)",
          description: "لضمان أقصى هوامش الأمان، يتم تحليل كل وصلة لحام، ووصلة أسطوانة، وحلقة دوران باستخدام أنظمة ANSYS تحت أحمال أمواج البحر المفتوح."
        }
      ]
    },
    exportNetwork: {
      eyebrow: "الوجود العالمي",
      title: "شبكة التصدير العالمية",
      subtitle: "نقدم حلول رفع بحرية معتمدة عبر خمس قارات. يمكنك استكشاف أسواق التصدير الخاصة بنا بشكل تفاعلي من القائمة الموجودة على اليسار أو مباشرة على الخريطة.",
      listTitle: "أسواق التصدير",
      craneLabel: "رافعة",
      activeOperation: "العمليات النشطة:",
      items: [
        { country: "الإمارات العربية المتحدة", count: 120 },
        { country: "تركيا", count: 85 },
        { country: "المملكة العربية السعودية", count: 45 },
        { country: "الولايات المتحدة الأمريكية", count: 25 },
        { country: "قطر", count: 22 },
        { country: "النرويج", count: 20 },
        { country: "أذربيجان", count: 18 },
      ]
    },
    ctaSection: {
      eyebrow: "هل أنت مستعد لتعزيز مشاريعك البحرية؟",
      title: "ناقش التفاصيل الفنية\nمع مهندسينا",
      description: "نقوم بإعداد نماذج هندسية ثلاثية الأبعاد (3D CAD) مخصصة، ومخططات تحميل، ومقترحات معتمدة تتناسب مع تخطيط سطح سفينتك ومتطلبات هيئة التصنيف.",
      primaryBtn: "احصل على عرض سعر",
      secondaryBtn: "اتصل بنا",
    },
  },
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

