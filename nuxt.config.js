module.exports = {
  mode: 'spa',
  loading: { color: '#41b883' },
  env: {
    HOST: process.env.HOST || '0.0.0.0',
    PORT: process.env.PORT || 3000
  },
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { href: "https://fonts.googleapis.com/css?family=Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&amp;subset=cyrillic,cyrillic-ext,latin-ext", rel: "stylesheet" },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/engine.io.js',
    '~/plugins/element.io.js'
  ],
  css: [
    '~/assets/css/main.css',
    'font-awesome/css/font-awesome.min.css',
    'element-ui/lib/theme-chalk/index.css'
  ],
  build: {
    vendor: [
      '~/plugins/axios.js',
      '~/plugins/engine.io.js',
      '~/plugins/element.io.js'
    ],
    extend(config, ctx) {
      if (ctx.isClient) {
        config.node = {
          fs: 'empty'
        }
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
        config.module.rules.push({
          test: /\.node$/,
          use: 'node-loader'
        })
      }
    }
  }
}
