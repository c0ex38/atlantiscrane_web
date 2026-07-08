const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'ar'];
const dir = path.join(__dirname, 'src/app/lib/i18n/dictionaries');

const newContactFields = {
  tr: {
    formTitle: "Mesaj Gönderin",
    formDesc: "Teklif talebi, teknik destek veya genel sorularınız için aşağıdaki formu kullanabilirsiniz. Uzman mühendislik ekibimiz en kısa sürede size dönüş yapacaktır.",
    namePlaceholder: "Adınız Soyadınız",
    emailPlaceholder: "E-posta Adresiniz",
    subjectPlaceholder: "Konu (Örn: 8 Ton Vinç Teklifi)",
    messagePlaceholder: "Mesajınız...",
    sendBtn: "MESAJI GÖNDER",
    hqTitle: "Genel Merkez & Üretim",
    branchTitle: "Bölgesel Ofis & Lojistik",
    addressIstanbul: "Evliya Çelebi Mah. Tersaneler Cad. No: 1\nTuzla, İstanbul / Türkiye",
    addressDubai: "Dubai Maritime City, B-12\nDubai / United Arab Emirates",
  },
  en: {
    formTitle: "Send a Message",
    formDesc: "Use the form below for quote requests, technical support, or general inquiries. Our expert engineering team will get back to you as soon as possible.",
    namePlaceholder: "Full Name",
    emailPlaceholder: "Email Address",
    subjectPlaceholder: "Subject (e.g., 8 Ton Crane Quote)",
    messagePlaceholder: "Your Message...",
    sendBtn: "SEND MESSAGE",
    hqTitle: "Headquarters & Production",
    branchTitle: "Regional Office & Logistics",
    addressIstanbul: "Evliya Celebi Mah. Tersaneler Cad. No: 1\nTuzla, Istanbul / Turkey",
    addressDubai: "Dubai Maritime City, B-12\nDubai / United Arab Emirates",
  },
  ar: {
    formTitle: "إرسال رسالة",
    formDesc: "استخدم النموذج أدناه لطلبات عروض الأسعار أو الدعم الفني أو الاستفسارات العامة. سيعود إليك فريق الهندسة الخبير لدينا في أقرب وقت ممكن.",
    namePlaceholder: "الاسم الكامل",
    emailPlaceholder: "عنوان البريد الإلكتروني",
    subjectPlaceholder: "الموضوع (مثل: عرض أسعار رافعة 8 طن)",
    messagePlaceholder: "رسالتك...",
    sendBtn: "إرسال رسالة",
    hqTitle: "المقر الرئيسي والإنتاج",
    branchTitle: "المكتب الإقليمي والخدمات اللوجستية",
    addressIstanbul: "Evliya Celebi Mah. Tersaneler Cad. No: 1\nTuzla, Istanbul / Turkey",
    addressDubai: "مدينة دبي الملاحية، B-12\nدبي / الإمارات العربية المتحدة",
  }
};

for (const loc of locales) {
  const filePath = path.join(dir, `${loc}.ts`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find contact block
  const contactMatch = content.match(/contact:\s*\{([\s\S]*?)\},\n\s*footer:/);
  if (contactMatch) {
    const contactBlock = contactMatch[1];
    
    // Check if we already added it
    if (!contactBlock.includes('formTitle:')) {
      const fields = newContactFields[loc];
      const newFieldsStr = `
    formTitle: "${fields.formTitle}",
    formDesc: "${fields.formDesc}",
    namePlaceholder: "${fields.namePlaceholder}",
    emailPlaceholder: "${fields.emailPlaceholder}",
    subjectPlaceholder: "${fields.subjectPlaceholder}",
    messagePlaceholder: "${fields.messagePlaceholder}",
    sendBtn: "${fields.sendBtn}",
    hqTitle: "${fields.hqTitle}",
    branchTitle: "${fields.branchTitle}",
    addressIstanbul: "${fields.addressIstanbul}",
    addressDubai: "${fields.addressDubai}",`;
      
      const newContactBlock = contactBlock.trim() + ',' + newFieldsStr + '\n  ';
      const replacement = `contact: {
    ${newContactBlock}
  },
  footer:`;
      
      content = content.replace(/contact:\s*\{[\s\S]*?\},\n\s*footer:/, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${loc}.ts`);
    } else {
      console.log(`${loc}.ts already has the new fields.`);
    }
  } else {
    console.log(`Could not find contact block in ${loc}.ts`);
  }
}
