/** @type {import('next').NextConfig} */
module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/home' },
      '/register': {
        page: '/register',
        query: { title: 'registration page', __nextDefaultLocale: 'en' }
      },
      '/login': {
        page: '/login',
        query: { title: 'login page', __nextDefaultLocale: 'en' }
      },
      '/user': {
        page: '/user',
        query: { title: 'user page', __nextDefaultLocale: 'en' }
      },
      '/forgotpassword': {
        page: '/forgotpassword',
        query: { title: 'forgotpassword page', __nextDefaultLocale: 'en' }
      }
    };
  },
  theme: {
    extend: {
      colors: {
        yellow: '#F9ED32'
      }
    }
  }
};
