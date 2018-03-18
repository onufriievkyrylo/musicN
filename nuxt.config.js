module.exports = {
  mode: 'spa',
  loading: { color: '#41b883' },
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
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
    '~/assets/css/font-awesome.min.css',
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
