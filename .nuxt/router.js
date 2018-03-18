import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _4e20f26e = () => import('..\\pages\\about.vue' /* webpackChunkName: "pages_about" */).then(m => m.default || m)
const _28f79d67 = () => import('..\\pages\\chanel\\_token.vue' /* webpackChunkName: "pages_chanel__token" */).then(m => m.default || m)
const _0eb13ce4 = () => import('..\\pages\\index.vue' /* webpackChunkName: "pages_index" */).then(m => m.default || m)



const scrollBehavior = (to, from, savedPosition) => {
  // SavedPosition is only available for popstate navigations.
  if (savedPosition) {
    return savedPosition
  } else {
    let position = {}
    // If no children detected
    if (to.matched.length < 2) {
      // Scroll to the top of the page
      position = { x: 0, y: 0 }
    }
    else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
      // If one of the children has scrollToTop option set to true
      position = { x: 0, y: 0 }
    }
    // If link has anchor, scroll to anchor by returning the selector
    if (to.hash) {
      position = { selector: to.hash }
    }
    return position
  }
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/about",
			component: _4e20f26e,
			name: "about"
		},
		{
			path: "/chanel/:token?",
			component: _28f79d67,
			name: "chanel-token"
		},
		{
			path: "/",
			component: _0eb13ce4,
			name: "index"
		}
    ],
    
    
    fallback: false
  })
}
