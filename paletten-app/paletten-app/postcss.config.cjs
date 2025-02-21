// postcss.config.cjs
module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
