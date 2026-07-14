const fs = require('fs');
const path = require('path');

const locales = ['tr', 'en', 'ar'];
const dir = path.join(__dirname, 'src/app/lib/i18n/dictionaries');

for (const loc of locales) {
  const filePath = path.join(dir, `${loc}.ts`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix double comma
  content = content.replace(/\",,/g, '\",');
  
  // Fix unterminated string literal due to newline in addressIstanbul
  content = content.replace(/addressIstanbul:\s*"([^"]*)\n([^"]*)"/g, 'addressIstanbul: "$1\\n$2"');
  
  // Fix unterminated string literal due to newline in addressDubai
  content = content.replace(/addressDubai:\s*"([^"]*)\n([^"]*)"/g, 'addressDubai: "$1\\n$2"');
  
  fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Fixed syntax errors');
