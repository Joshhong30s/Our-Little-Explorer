const path = require('path');

module.exports = {
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'zh',
    localeDetection: true,
  },
  localePath: path.resolve('./public/locales'),
};
