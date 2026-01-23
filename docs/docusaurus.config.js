module.exports = {
  title: 'Docs',
  url: 'http://localhost',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  presets: [
    [
      'classic',
      {
        docs: {
          path: 'md',
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
        },
        blog: false,
      },
    ],
  ],
  plugins: [
    [
      require.resolve('@cmfcmf/docusaurus-search-local'),
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        language: 'es',
      },
    ],
  ],
};