/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Note: autoprefixer is built into Tailwind v4, no longer needed
  },
};

export default config;
