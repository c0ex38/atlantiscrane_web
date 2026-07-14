import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import * as dotenv from 'dotenv';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import tr from '../../frontend/src/app/lib/i18n/dictionaries/tr';
import en from '../../frontend/src/app/lib/i18n/dictionaries/en';
import ar from '../../frontend/src/app/lib/i18n/dictionaries/ar';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || 'info@atlantiscrane.com';
  const password = process.env.ADMIN_PASSWORD || 'Atlnts**2026-+';

  console.log('Seeding database...');

  // 1. Seed Admin User
  const passwordHash = await argon2.hash(password);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      isActive: true,
    },
  });
  console.log(`Admin user seeded: ${admin.email}`);

  // 2. Seed Products
  const productsData = [
    {
      slug: 'model-01',
      title: {
        tr: '8 Ton Hidrolik Katlanır Bomlu Vinç',
        en: '8 Ton Hydraulic Knuckle Boom Crane',
        ar: 'رافعة بحرية بوم مفصلي 8 طن',
      },
      shortIntro: {
        tr: 'Dar güvertelerde ve kısıtlı alanlarda maksimum esneklik ve depolama kolaylığı sağlayan hidrolik katlanır tasarımlar.',
        en: 'Hydraulic knuckle boom designs providing maximum flexibility and storage ease in narrow decks and restricted areas.',
        ar: 'تصميمات هيدروليكية مفصلية توفر أقصى درجات المرونة وسهولة التخزين في الطوابق الضيقة والمnaطق المقيدة.',
      },
      description: {
        tr: '8 Ton Hidrolik Katlanır Bomlu Vinç, ağır yüklerin güvenli, kontrollü ve pratik şekilde kaldırılması, taşınması ve konumlandırılması için tasarlanmış profesyonel bir vinç sistemidir. Katlanabilir bom yapısı sayesinde kullanım dışında kompakt bir form alır; çalışma sırasında ise farklı erişim mesafelerinde etkili kaldırma performansı sunar.\n\nBu vinç; özellikle denizcilik, gemi üstü operasyonlar, tersane, liman, inşaat ve endüstriyel saha uygulamaları için uygundur.',
        en: 'The 8 Ton Hydraulic Knuckle Boom Crane is a professional crane system designed for the safe, controlled, and practical lifting, transporting, and positioning of heavy loads. Thanks to its foldable boom structure, it takes a compact form when not in use; during operation, it offers effective lifting performance at various outreach distances.\n\nThis crane is particularly suitable for marine, shipboard operations, shipyards, ports, construction, and industrial field applications.',
        ar: 'الرافعة البحرية الهيدروليكية ذات الذراع المفصلي بوزن 8 طن هي نظام رافعة احترافي مصمم للرفع الآمن والمحكم والعملي ونقل ووضع الحمولات الثقيلة. بفضل هيكل الذراع القابل للطي، فإنها تتخذ شكلاً مضغوطاً عند عدم الاستخدام؛ وأثناء التشغيل، توفر أداء رفع فعال على مسافات وصول مختلفة.\n\nهذه الرافعة مناسبة بشكل خاص للتطبيقات البحرية وعمليات السفن وأحواض بناء السفن والموانئ والبناء والتطبيقات الميدانية الصناعية.',
      },
      usage: {
        tr: 'Bu vinç, ağır ekipmanların, malzemelerin veya yüklerin bir noktadan başka bir noktaya kaldırılıp taşınmasını sağlar. Katlanır bom sistemi sayesinde dar alanlarda daha verimli çalışır ve kullanılmadığında minimum yer kaplar.',
        en: 'This crane enables heavy equipment, materials, or loads to be lifted and moved from one point to another. Thanks to the knuckle boom system, it works more efficiently in tight spaces and occupies minimum space when not in use.',
        ar: 'تتيح هذه الرافعة رفع ونقل المعدات أو المواد أو الأحمال الثقيلة من نقطة إلى أخرى. بفضل نظام الذراع المفصلي, فإنها تعمل بكفاءة أكبر في المساحات الضيقة وتشغل الحد الأدنى من المساحة عند عدم الاستخدام.',
      },
      capacity: { tr: '1.5 - 25 Ton', en: '1.5 - 25 Tons', ar: '١.٥ - ٢٥ طن' },
      outreach: { tr: '6 - 24 Metre', en: '6 - 24 Meters', ar: '٦ - ٢٤ متر' },
      features: {
        tr: [
          'Hidrolik çalışma sistemi ile güçlü ve kontrollü kaldırma performansı sağlar.',
          'Katlanabilir bom yapısı sayesinde kompakt kullanım ve kolay depolama imkânı sunar.',
          'Yüksek manevra kabiliyeti ile dar alanlarda etkili operasyon.',
          'Güvenlik valfleri ve aşırı yük koruma sistemleri ile donatılmıştır.',
        ],
        en: [
          'Provides powerful and controlled lifting performance with its hydraulic operating system.',
          'Offers compact usage and easy storage capability due to its foldable boom structure.',
          'Effective operation in narrow spaces with high maneuverability.',
          'Equipped with safety valves and overload protection systems.',
        ],
        ar: [
          'يوفر أداء رفع قوي ومحكم من خلال نظام التشغيل الهيدروليكي.',
          'يوفر استخداماً مضغوطاً وإمكانية تخزين سهلة بفضل هيكل الذراع القابل للطي.',
          'تشغيل فعال في المساحات الضيقة مع قدرة عالية على المناورة.',
          'مزودة بصمامات أمان وأنظمة حماية من الحمل الزائد.',
        ],
      },
      loadChart: [
        { outreach: '2.50 m', capacity: '3200 kg' },
        { outreach: '4.15 m', capacity: '2000 kg' },
        { outreach: '5.60 m', capacity: '1455 kg' },
        { outreach: '7.10 m', capacity: '1150 kg' },
      ],
      image: '/about-facility.png',
    },
    {
      slug: 'model-02',
      title: {
        tr: 'Teleskopik Bomlu Deniz Vinçleri',
        en: 'Telescopic Boom Marine Cranes',
        ar: 'رافعat بحرية تلسكوبية بوم',
      },
      shortIntro: {
        tr: 'Uzun erişim mesafesi ve hassas yük konumlandırma gerektiren operasyonlar için tasarlanmış uzayabilir bomlu vinçler.',
        en: 'Extendable boom cranes designed for operations requiring long outreach and precise load positioning.',
        ar: 'رافعات بوم قابلة للتمديد مصممة للعمليات التي تتطلب مسافة وصول طويلة وتحديد موضع دقيق للحمل.',
      },
      description: {
        tr: 'Teleskopik Bomlu Deniz Vinçleri, özellikle geniş çalışma çapına ihtiyaç duyulan operasyonlarda mükemmel performans gösteren, uzayabilir yapıya sahip üst düzey vinç sistemleridir. Yüksek kaliteli hidrolik bileşenleri ve güçlü gövde yapısı sayesinde ağır deniz şartlarında bile üstün denge ve güvenlik sağlar.',
        en: 'Telescopic Boom Marine Cranes are high-end crane systems with an extendable structure, showing excellent performance especially in operations requiring a wide working radius. Thanks to their high-quality hydraulic components and strong hull structure, they provide superior stability and safety even in heavy sea conditions.',
        ar: 'الرافعات البحرية التلسكوبية هي أنظمة رافعات متطورة بهيكل قابل للتمديد، وتُظهر أداءً ممتازاً خاصة في العمليات التي تتطلب نطاق عمل واسع. بفضل المكونات الهيدروليكية عالية الجودة وهيكل الجسم القوي، فإنها توفر ثباتاً وأماناً فائقين حتى في ظروف البحر القاسية.',
      },
      usage: {
        tr: 'Gemi güvertesinden limana, iskeleden diğer deniz araçlarına kadar uzanan mesafelerde hızlı ve güvenli malzeme aktarımı sağlar.',
        en: "Provides fast and safe material transfer over distances extending from the ship's deck to the port, pier, or other marine vessels.",
        ar: 'يوفر نقل سريع وآمن للمواد عبر مسافات تمتد من سطح السفينة إلى الميناء أو الرصيف أو السفن البحرية الأخرى.',
      },
      capacity: { tr: '2 - 40 Ton', en: '2 - 40 Tons', ar: '٢ - ٤٠ طن' },
      outreach: { tr: '8 - 32 Metre', en: '8 - 32 Meters', ar: '٨ - ٣٢ متر' },
      features: {
        tr: [
          'Kademeli uzayabilen teleskopik bom sistemi.',
          'Deniz suyuna ve korozyona karşı yüksek dayanımlı özel kaplama.',
          'Hassas oransal hidrolik kontrol valfleri.',
          'Zorlu hava koşullarına uygun yapı.',
        ],
        en: [
          'Gradually extendable telescopic boom system.',
          'Special coating with high resistance against seawater and corrosion.',
          'Smooth movement capability with precise proportional hydraulic control valves.',
          'Structure suitable for harsh weather conditions.',
        ],
        ar: [
          'نظام بوم تلسكوبي قابل للتمديد تدريجياً.',
          'طلاء خاص ذو مقاومة عالية ضد مياه البحر والتآكل.',
          'قدرة حركة سلسة مع صمامات تحكم هيدروليكية تناسبية دقيقة.',
          'هيكل مناسب للظروف الجوية القاسية.',
        ],
      },
      loadChart: [
        { outreach: '4.00 m', capacity: '5000 kg' },
        { outreach: '8.00 m', capacity: '2500 kg' },
        { outreach: '12.00 m', capacity: '1500 kg' },
        { outreach: '16.00 m', capacity: '1000 kg' },
      ],
      image: '/about-facility.png',
    },
    {
      slug: 'model-03',
      title: {
        tr: 'Sabit Bomlu Deniz Vinçleri',
        en: 'Stiff Boom Marine Cranes',
        ar: 'رافعات بحرية بوم ثابت',
      },
      shortIntro: {
        tr: 'Güverte üstü genel yük, servis ve malzeme transfer operasyonları için yüksek dayanımlı, minimum bakım gerektiren sabit çözümler.',
        en: 'High-strength, low-maintenance fixed solutions for on-deck general cargo, service, and material transfer operations.',
        ar: 'حلول ثابتة عالية القوة ومنخفضة الصيانة للعمليات العامة للبضائع والخدمات ونقل المواد على سطح السفينة.',
      },
      description: {
        tr: 'Sabit Bomlu Deniz Vinçleri, daha az karmaşık mekanizmaya sahip olmaları sayesinde çok düşük bakım maliyetleri sunan, zorlu deniz koşullarına dayanıklı standart kaldırma ekipmanlarıdır.',
        en: 'Stiff Boom Marine Cranes are standard lifting equipment resistant to harsh marine conditions, offering very low maintenance costs thanks to having less complex mechanisms.',
        ar: 'الرافعات البحرية ذات الذراع الثابت هي معدات رفع قياسية مقاومة للظروف البحرية القاسية، وتقدم تكاليف صيانة منخفضة للغاية بفضل وجود آليات أقل تعقيداً.',
      },
      usage: {
        tr: 'Sabit mesafeli ve genel amaçlı yükleme, boşaltma işlemlerinde kullanılır. Liman içi servis botlarında ve standart güverte operasyonlarında tercih edilir.',
        en: 'Used in fixed-distance and general-purpose loading and unloading operations. Preferred in in-port service boats and standard deck operations.',
        ar: 'تستخدم في عمليات التحميل والتفريغ للأغراض العامة وعلى مسافات ثابتة. يُفضل استخدامها في قوارب خدمة الموانئ وعمليات السطح القياسية.',
      },
      capacity: { tr: '1 - 15 Ton', en: '1 - 15 Tons', ar: '١ - ١٥ طن' },
      outreach: { tr: '5 - 20 Metre', en: '5 - 20 Meters', ar: '٥ - ٢٠ متر' },
      features: {
        tr: [
          'Az hareketli parça ile minimum bakım gereksinimi.',
          'Sürekli ve ağır çalışma şartlarına uygun güçlü konstrüksiyon.',
          'Kullanımı kolay manuel veya oransal kumanda paneli.',
          'Acil durdurma ve limit siviç donanımları.',
        ],
        en: [
          'Minimum maintenance requirement with fewer moving parts.',
          'Strong construction suitable for continuous and heavy working conditions.',
          'Easy-to-use manual or proportional control panel.',
          'Emergency stop and limit switch equipment.',
        ],
        ar: [
          'الحد الأدنى من متطلبات الصيانة مع أجزاء متحركة أقل.',
          'بنية قوية مناسبة لظروف العمل المستمرة والشاقة.',
          'لوحة تحكم يدوية أو تناسبية سهلة الاستخدام.',
          'معدات الإيقاف في حالات الطوارئ ومفتاح الحد.',
        ],
      },
      loadChart: [
        { outreach: '3.00 m', capacity: '10000 kg' },
        { outreach: '6.00 m', capacity: '5000 kg' },
        { outreach: '9.00 m', capacity: '3300 kg' },
        { outreach: '12.00 m', capacity: '2500 kg' },
      ],
      image: '/about-facility.png',
    },
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      // Seed must never overwrite content or publication state managed in admin.
      update: {},
      create: product,
    });
  }
  console.log('Products seeded.');

  // 3. Seed Projects & References
  const projectsData = [
    {
      title: {
        tr: 'Abu Dhabi Liman Genişletmesi',
        en: 'Abu Dhabi Port Expansion',
        ar: 'توسعة ميناء أبوظبي',
      },
      client: {
        tr: 'National Marine Dredging',
        en: 'National Marine Dredging',
        ar: 'الشركة الوطنية للجرف البحري',
      },
      category: {
        tr: 'Liman & Altyapı',
        en: 'Port & Infrastructure',
        ar: 'الموانئ والبنية التحتية',
      },
      description: {
        tr: 'Ağır hizmet tipi teleskopik bomlu vinçlerin römorkörlere entegrasyonu ve zorlu sıcaklık şartlarında saha testleri.',
        en: 'Integration and field testing of heavy-duty telescopic boom cranes onto tugboats under extreme temperature conditions.',
        ar: 'دمج واختبار ميداني لرافعat بوم تلسكوبية للخدمة الشاقة على قوارب القطر تحت ظروف درجات الحرارة القصوى.',
      },
      image: '/about-facility.png',
    },
    {
      title: {
        tr: 'Kuzey Denizi Araştırma Gemisi',
        en: 'North Sea Research Vessel',
        ar: 'سفينة أبحاث بحر الشمال',
      },
      client: {
        tr: 'Polaris Maritime',
        en: 'Polaris Maritime',
        ar: 'بولاريس ماريتيم',
      },
      category: {
        tr: 'Offshore & Araştırma',
        en: 'Offshore & Research',
        ar: 'المناطق البحرية والأبحاث',
      },
      description: {
        tr: 'Kutup şartlarında çalışabilen, aktif dalga sönümlemeli (AHC) derin deniz ROV fırlatma ve kurtarma vinci tasarımı.',
        en: 'Design of a deep-sea ROV launch and recovery crane with Active Heave Compensation (AHC) capable of operating in polar conditions.',
        ar: 'تصميم رافعة إطلاق واستعادة مركبات ROV للمياه العميقة مع تعويض الرفع النشط (AHC) قادرة على العمل في الظروف القطبية.',
      },
      image: '/about-facility.png',
    },
  ];

  for (let i = 0; i < projectsData.length; i++) {
    const item = projectsData[i];
    const idNum = i + 1;
    // Seed as project
    await prisma.project.upsert({
      where: { id: `00000000-0000-0000-0000-00000000000${idNum}` },
      update: item,
      create: {
        id: `00000000-0000-0000-0000-00000000000${idNum}`,
        ...item,
      },
    });

    // Seed as reference
    await prisma.reference.upsert({
      where: { id: `00000000-0000-0000-0000-00000000001${idNum}` },
      update: item,
      create: {
        id: `00000000-0000-0000-0000-00000000001${idNum}`,
        ...item,
      },
    });
  }
  console.log('Projects and References seeded.');

  // 4. Seed Settings
  const settingsData = [
    {
      key: 'site_content',
      value: { tr, en, ar },
    },
    {
      key: 'contact_email',
      value: { email: 'info@atlantiscrane.com' },
    },
    {
      key: 'contact_phone',
      value: { phone: '+90 216 123 45 67' },
    },
    {
      key: 'address_istanbul',
      value: {
        tr: 'Evliya Çelebi Mah. Tersaneler Cad. No: 1, Tuzla, İstanbul / Türkiye',
        en: 'Evliya Celebi Mah. Tersaneler Cad. No: 1, Tuzla, Istanbul / Turkey',
        ar: 'إيفليا شلبي، شارع ترسانيلار رقم ١، توزلا، إسطنبول / تركيا',
      },
    },
    {
      key: 'address_dubai',
      value: {
        tr: 'Dubai Maritime City, B-12, Dubai / Birleşik Arap Emirlikleri',
        en: 'Dubai Maritime City, B-12, Dubai / United Arab Emirates',
        ar: 'مدينة دبي الملاحية، B-12، دبي / الإمارات العربية المتحدة',
      },
    },
    {
      key: 'about_page',
      value: {
        tr: {
          hero: {
            title1: "Denizcilik Sektörünü\n",
            titleHighlight: "Geleceğe\u00a0",
            title2: "Taşıyoruz",
            description: "Gemi, yat ve açık deniz platformları için tasarlanmış yüksek mühendislik ürünü deniz vinçleri."
          },
          story: {
            eyebrow: "Kim Olduğumuz",
            title1: "Tersanenin ",
            titleHighlight: "kalbinden ",
            title2: "gelen güç.",
            p1: "2001 yılında İstanbul Tuzla'da, Türk gemi inşa sanayisinin tam merkezinde kurulan Atlantis Crane, yirmi yılı aşkın süredir deniz vinçlerinin tasarımında ve üretiminde küresel standartların öncüsüdür.",
            p2: "Her projede mühendislik önce gelir: DNV, Lloyd's Register ve Bureau Veritas sertifikasyonuyla desteklenen ürünlerimiz, en zorlu deniz koşullarına karşı güvenle çalışır.",
            p3: "İstanbul'dan Dubai'ye uzanan servis ağımızla kurulum sonrası desteği de aynı kararlılıkla sürdürüyoruz.",
            badgeTitle: "Tuzla, İstanbul",
            badgeSubtitle: "Ana Üretim Tesisi"
          },
          mission: {
            eyebrow: "Misyonumuz",
            title1: "Denizin en zorlu koşullarında bile ",
            titleHighlight: "durmayan güç ",
            title2: "üretmek.",
            description: "Atlantis Crane, küresel tersanelerin en kritik yük kaldırma ihtiyaçlarını karşılamak için mühendislik ve üretim süreçlerini sürekli geliştirir. Her ürün bu misyonun somutlaşmış halidir."
          }
        },
        en: {
          hero: {
            title1: "Carrying the Maritime Industry into the\n",
            titleHighlight: "Future",
            title2: "",
            description: "High-engineered marine cranes designed for vessels, yachts, and offshore platforms."
          },
          story: {
            eyebrow: "Who We Are",
            title1: "Power originating from the ",
            titleHighlight: "heart ",
            title2: "of the shipyard.",
            p1: "Founded in 2001 in Tuzla, Istanbul, right at the center of the Turkish shipbuilding industry, Atlantis Crane has been a pioneer in global standards for the design and production of marine cranes for over two decades.",
            p2: "Engineering comes first in every project: Backed by DNV, Lloyd's Register, and Bureau Veritas certification, our products operate safely against the harshest marine conditions.",
            p3: "With our service network extending from Istanbul to Dubai, we maintain the same determination in post-installation support.",
            badgeTitle: "Tuzla, Istanbul",
            badgeSubtitle: "Main Production Facility"
          },
          mission: {
            eyebrow: "Our Mission",
            title1: "Producing ",
            titleHighlight: "unstoppable power ",
            title2: "even in the toughest sea conditions.",
            description: "Atlantis Crane continuously develops its engineering and production processes to meet the most critical load lifting needs of global shipyards. Every product is the embodiment of this mission."
          }
        },
        ar: {
          hero: {
            title1: "نحمل الصناعة البحرية إلى\n",
            titleHighlight: "المستقبل",
            title2: "",
            description: "رافعات بحرية هندسية متطورة مصmمة للسفن واليخوت والمنصات البحرية."
          },
          story: {
            eyebrow: "من نحن",
            title1: "قوة تنبع من ",
            titleHighlight: "قلب ",
            title2: "حوض بناء السفن.",
            p1: "تأسست شركة Atlantis Crane في عام 2001 في توزلا، إسطنبول، في قلب صناعة بناء السفن التركية، وكانت رائدة في المعايير العالمية لتصميم وإنتاج الرافعات البحرية لأكثر من عقدين.",
            p2: "تأتي الهندسة أولاً في كل مشروع: بدعم من شهادات DNV و Lloyd's Register و Bureau Veritas، تعمل منتجاتنا بأمان ضد أقسى الظروف البحرية.",
            p3: "مع شبكة خدماتنا التي تمتد من إسطنبول إلى دبي، نحافظ على نفس التصميم في دعم ما بعد التركيب.",
            badgeTitle: "توزلا، إسطنبول",
            badgeSubtitle: "منشأة الإنتاج الرئيسية"
          },
          mission: {
            eyebrow: "مهمتنا",
            title1: "إنتاج ",
            titleHighlight: "قوة لا تتوقف ",
            title2: "حتى في أقسى الظروف البحرية.",
            description: "تقوم شركة Atlantis Crane باستمرار بتطوير عملياتها الهندسية والإنتاجية لتلبية احتياجات رفع الأحمال الأكثر أهمية لأحواض بناء السفن العالمية. كل منتج هو تجسيد لهذه المهمة."
          }
        }
      }
    },
    {
      key: 'home_page',
      value: {
        tr: {
          hero: {
            videoUrl: "/hero-loop.mp4",
            eyebrow: "Marine lifting engineering",
            title: "Gemi ve deniz platformları için güvenli, sertifikalı vinç çözümleri.",
            description: "Atlantis Crane, hazır ürünlerin yanında müşteriye özel kaldırma sistemleri geliştiren, test eden ve uluslararası kurulum desteği sağlayan mühendislik odaklı bir üretici.",
            primaryCta: "Proje Konuşalım",
            secondaryCta: "Ürünleri İncele"
          },
          about: {
            eyebrow: "Temel Felsefemiz",
            title: "Uluslararası standartlarda modern mühendislik.",
            subtitleHighlight: "Mühendislik,",
            subtitle: "kaldırdığımız her şeyin temelindedir.",
            description: "Atlantis Crane, Türk gemi inşa sanayisinin kalbi olan İstanbul Tuzla'da, en zorlu deniz koşullarına dayanacak şekilde son teknoloji ekipmanlar tasarlayan mühendislik odaklı bir Türk üreticidir. Birleşik Arap Emirlikleri ve Körfez tersanelerinde yaygın servis ağımızla hizmetinizdeyiz.",
            primaryBtn: "HİKAYEMİZ",
            secondaryBtn: "ÜRETİM TESİSİMİZ"
          },
          sectors: {
            eyebrow: "Sektörler / Kullanım Alanları",
            title: "Denizcilik, offshore ve kıyı projelerinde kullanım"
          },
          standards: {
            eyebrow: "Zorlu Deniz Şartları İçin Tasarlandı",
            title: "Atlantis Mühendislik Standartları"
          },
          exportNetwork: {
            eyebrow: "Küresel Varlık",
            title: "Global İhracat Ağımız",
            subtitle: "Beş kıtada sertifikalı deniz kaldırma çözümleri sunuyoruz. Sol taraftaki haritadan veya listeden etkileşimli olarak ihracat pazarlarimizi inceleyebilirsiniz."
          }
        },
        en: {
          hero: {
            videoUrl: "/hero-loop.mp4",
            eyebrow: "Marine lifting engineering",
            title: "Safe, certified crane solutions for vessels and offshore platforms.",
            description: "Atlantis Crane is an engineering-driven manufacturer that designs, tests, and provides international installation support for tailor-made lifting systems alongside standard products.",
            primaryCta: "Discuss Project",
            secondaryCta: "Inspect Products"
          },
          about: {
            eyebrow: "Our Core Philosophy",
            title: "Modern engineering at international standards.",
            subtitleHighlight: "Engineering",
            subtitle: "is at the core of everything we lift.",
            description: "Based in Tuzla, Istanbul—the heart of the Turkish shipbuilding industry—Atlantis Crane is an engineering-oriented manufacturer designing cutting-edge equipment to withstand the harshest marine conditions. We serve you with a widespread service network in the UAE and Gulf shipyards.",
            primaryBtn: "OUR STORY",
            secondaryBtn: "PRODUCTION FACILITY"
          },
          sectors: {
            eyebrow: "Sectors / Applications",
            title: "Use in maritime, offshore, and coastal projects"
          },
          standards: {
            eyebrow: "Designed for Harsh Marine Environments",
            title: "Atlantis Engineering Standards"
          },
          exportNetwork: {
            eyebrow: "Global Presence",
            title: "Our Global Export Network",
            subtitle: "We deliver certified marine lifting solutions across five continents. You can explore our export markets interactively using the map or the list on the left."
          }
        },
        ar: {
          hero: {
            videoUrl: "/hero-loop.mp4",
            eyebrow: "هندسة الرفع البحري",
            title: "حلول رافعات آمنة ومعتمدة للسفن والمنصات البحرية.",
            description: "إن شركة Atlantis Crane هي جهة تصنيع موجهة هندسياً تقوم بتصميم واختبار وتقديم دعم التركيب الدولي لأنظمة الرفع المخصصة جنباً إلى جنب مع المنتجات القياسية.",
            primaryCta: "مناقشة المشروع",
            secondaryCta: "تفحص المنتجات"
          },
          about: {
            eyebrow: "فلسفتنا الأساسية",
            title: "الهندسة الحديثة بالمعايير الدولية.",
            subtitleHighlight: "الهندسة",
            subtitle: "هي جوهر كل شيء نرفعه.",
            description: "يقع مقر شركة Atlantis Crane في توزلا، إسطنبول - قلب صناعة بناء السفن التركية - وهي جهة تصنيع موجهة نحو الهندسة تصمم معدات متطورة لتحمل أقسى الظروف البحرية. نحن نخدمك بشبكة خدمات واسعة الانتشار في دولة الإمارات العربية المتحدة وأحواض بناء السفن في الخليج.",
            primaryBtn: "قصتنا",
            secondaryBtn: "منشأة الإنتاج"
          },
          sectors: {
            eyebrow: "القطاعات / التطبيقات",
            title: "الاستخدام في المشاريع البحرية والساحلية ومشاريع الأفشور"
          },
          standards: {
            eyebrow: "مصممة للبيئات البحرية القاسية",
            title: "معايير هندسة أتلانتس"
          },
          exportNetwork: {
            eyebrow: "تواجد عالمي",
            title: "شبكة التصدير العالمية لدينا",
            subtitle: "نحن نقدم حلول رفع بحري معتمدة عبر القارات الخمس. يمكنك استكشاف أسواق التصدير لدينا بشكل تفاعلي باستخدام الخريطة أو القائمة الموجودة على اليسار."
          }
        }
      }
    },
    {
      key: 'site_common',
      value: {
        tr: {
          footer: {
            description: "Gemi ve deniz platformları için vinç tasarlayan, üreten, test eden ve uluslararası kurulum desteği sağlayan mühendislik odaklı bir üretici.",
            allRightsReserved: "© 2026 ATLANTİS CRANE. TÜM HAKLARI SAKLIDIR."
          },
          contact: {
            title: "Projenizi birlikte şekillendirelim.",
            description: "Teklif, teknik görüşme veya uluslararası destek talepleri için bu alanı kullanabiliriz. Bir sonraki adımda burada çok dilli iletişim formu kurabiliriz.",
            formTitle: "Mesaj Gönderin",
            formDesc: "Teklif talebi, teknik destek veya genel sorularınız için aşağıdaki formu kullanabilirsiniz. Uzman mühendislik ekibimiz en kısa sürede size dönüş yapacaktır.",
            namePlaceholder: "Adınız Soyadınız",
            emailPlaceholder: "E-posta Adresiniz",
            subjectPlaceholder: "Konu (Örn: 8 Ton Vinç Teklifi)",
            messagePlaceholder: "Mesajınız...",
            sendBtn: "MESAJI GÖNDER",
            hqTitle: "Genel Merkez & Üretim",
            branchTitle: "Bölgesel Ofis & Lojistik"
          },
          ctaSection: {
            eyebrow: "Denizcilik projelerinizi güçlendirmeye hazır mısınız?",
            title: "Teknik Detayları\nMühendislerimizle Görüşün",
            description: "Gemi güverte yerleşiminiz ve klas kuruluşu gereksinimleriniz doğrultusunda özel olarak hazırlanmış 3D CAD mühendislik modelleri, yük diyagramları ve sertifikalı teklifler hazırlıyoruz.",
            primaryBtn: "TEKLİF AL",
            secondaryBtn: "İLETİŞİM"
          }
        },
        en: {
          footer: {
            description: "An engineering-oriented manufacturer that designs, produces, tests, and provides international installation support for cranes on vessels and marine platforms.",
            allRightsReserved: "© 2026 ATLANTİS CRANE. ALL RIGHTS RESERVED."
          },
          contact: {
            title: "Let's shape your project together.",
            description: "We can use this space for requests, technical discussions, or international support requests. We can set up a multilingual contact form here in the next step.",
            formTitle: "Send a Message",
            formDesc: "You can use the form below for quote requests, technical support, or general inquiries. Our expert engineering team will get back to you as soon as possible.",
            namePlaceholder: "Your Name and Surname",
            emailPlaceholder: "Your Email Address",
            subjectPlaceholder: "Subject (e.g. 8 Ton Crane Quote)",
            messagePlaceholder: "Your Message...",
            sendBtn: "SEND MESSAGE",
            hqTitle: "Headquarters & Production",
            branchTitle: "Regional Office & Logistics"
          },
          ctaSection: {
            eyebrow: "Ready to power your maritime projects?",
            title: "Discuss Technical Details\nWith Our Engineers",
            description: "We prepare custom 3D CAD engineering models, load charts, and certified quotes tailored to your ship deck layout and class society requirements.",
            primaryBtn: "GET A QUOTE",
            secondaryBtn: "CONTACT"
          }
        },
        ar: {
          footer: {
            description: "جهة تصنيع موجهة نحو الهندسة تقوم بتصميم وإنتاج واختبار وتقديم دعم التركيب الدولي للرافعات على السفن والمنصات البحرية.",
            allRightsReserved: "© ٢٠٢٦ أتلانتس كرين. جميع الحقوق محفوظة."
          },
          contact: {
            title: "دعنا نشكل مشروعك معاً.",
            description: "يمكننا استخدام هذه المساحة للطلبات أو المناقشات الفنية أو طلبات الدعم الدولي. يمكننا إعداد نموذج اتصال متعدد اللغات هنا في الخطوة التالية.",
            formTitle: "إرسال رسالة",
            formDesc: "يمكنك استخدام النموذج أدناه لطلبات عروض الأسعار أو الدعم الفني أو الاستفسارات العامة. سيعود إليك فريقنا الهندسي الخبير في أقرب وقت ممكن.",
            namePlaceholder: "اسمك الكامل",
            emailPlaceholder: "عنوان بريدك الإلكتروني",
            subjectPlaceholder: "الموضوع (مثال: عرض سعر رافعة 8 طن)",
            messagePlaceholder: "رسالتك...",
            sendBtn: "إرسال الرسالة",
            hqTitle: "المقر الرئيسي والإنتاج",
            branchTitle: "المكتب الإقليمي واللوجستيات"
          },
          ctaSection: {
            eyebrow: "هل أنت مستعد لتمكين مشاريعك البحرية؟",
            title: "ناقش التفاصيل الفنية\nمع مهندسينا",
            description: "نحن نعد نماذج هندسية ثلاثية الأبعاد مخصصة ومخططات تحميل وعروض أسعار معتمدة مصممة خصيصاً لتخطيط سطح السفينة ومتطلبات مجتمع الفئة الخاصة بك.",
            primaryBtn: "احصل على عرض سعر",
            secondaryBtn: "اتصل بنا"
          }
        }
      }
    }
  ];

  for (const setting of settingsData) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: {
        key: setting.key,
        value: setting.value,
      },
    });
  }
  console.log('Settings seeded.');

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
