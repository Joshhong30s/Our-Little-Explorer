const path = require('path');

module.exports = {
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'zh',
    localeDetection: false,
  },
  localePath: path.resolve('./public/locales'),
};
