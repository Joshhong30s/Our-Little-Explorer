module.exports = {
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'zh',
    localeDetection: true,
  },
  localePath: typeof window === 'undefined' ? 'public/locales' : '/locales',
};
