/** @type {import('next').NextConfig} */
module.exports = {
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/home' },
      '/register': { page: '/register', query: { title: 'registration page' } },
      '/login': { page: '/login', query: { title: 'login page' } },
      '/user': { page: '/user', query: { title: 'user page' } },
      '/forgotpassword': {
        page: '/forgotpassword',
        query: { title: 'forgotpassword page' }
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
