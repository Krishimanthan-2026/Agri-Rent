const fs = require('fs');

function revertFile(path) {
  try {
    let content = fs.readFileSync(path, 'utf8');
    
    // Remove useLanguage import completely from context
    content = content.replace(/,\s*useLanguage/, '');
    content = content.replace(/useLanguage,\s*/, '');
    content = content.replace(/import\s*\{\s*useLanguage\s*\}\s*from\s*'\.\.\/context';\n/, '');
    
    // Remove language hooks
    content = content.replace(/\s*const\s*\{\s*t(,\s*language,\s*translateDynamicBulk)?\s*\}\s*=\s*useLanguage\(\);\n/g, '');
    
    // Replace {t('Text')} with Text
    content = content.replace(/\{t\('([^']+)'\)\}/g, '$1');
    
    // Replace {t(variable)} with {variable}
    content = content.replace(/\{t\(([^']+)\)\}/g, '{$1}');
    
    // Replace t('Text') with 'Text'
    content = content.replace(/t\('([^']+)'\)/g, "'$1'");
    
    // Remove dynamic translate effect block if any
    content = content.replace(/\s*const\s*\[translatedOptions.*?;/g, '');
    content = content.replace(/\s*import\('react'\)\.then.*?\n\s*\}\);\n/gs, '');
    
    // Replace translatedOptions with EQUIPMENT_OPTIONS
    content = content.replace(/translatedOptions\[i\] \|\| opt/g, 'opt');
    content = content.replace(/translatedOptions\[EQUIPMENT_OPTIONS\.indexOf\(searchTerm\)\] \|\| searchTerm/g, 'searchTerm');
    
    fs.writeFileSync(path, content, 'utf8');
    console.log(`Reverted ${path}`);
  } catch (err) {
    console.error(`Error processing ${path}:`, err);
  }
}

const filesToRevert = [
  './src/pages/SellerDashboard.jsx',
  './src/pages/AdminDashboard.jsx',
  './src/pages/Profile.jsx',
  './src/pages/UserProfile.jsx',
  './src/pages/About.jsx',
  './src/components/AuthModal.jsx',
  './src/components/AdminAuthModal.jsx',
  './src/components/ChatBot.jsx'
];

filesToRevert.forEach(revertFile);
