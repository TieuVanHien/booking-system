/** @type {import('next').NextConfig} */
module.exports = {
  experimental: { css: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
};
