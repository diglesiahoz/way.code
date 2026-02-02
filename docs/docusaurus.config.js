module.exports = {
  title: 'Docs',
  url: 'http://localhost',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  themeConfig: {
    navbar: {
      title: 'way.code',
      logo: {
        alt: 'Logo Docs',
        src: 'img/way.png',
      },
      items: [],
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
  },  
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
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
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