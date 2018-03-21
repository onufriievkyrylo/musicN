import Axios from 'axios'
import Vue from 'vue'
import routes from './routes.json'

var axios = Axios.create({
  baseURL: `/api/`
})

export const headers = function (headers = {}) {
  Object.keys(headers).forEach(name => {
    axios.defaults.headers.common[name] = headers[name]
  })
}

function parse(route, params) {
  const url = routes[route] || route
  return url.replace(/:(\w+)/g, (match, param) => params[param])
}

async function request(method, route, opts = {}) {
  try {
    const url = parse(route, opts.params)
    delete opts.params
    const { data } = await axios[method](url, opts)
    return data
  } catch (err) {
    console.log(err)
    throw err.response
  }
}

export function get(route, opts) {
  return request('get', route, opts)
}

export function post(route, opts) {
  return request('post', route, opts)
}

export function put(route, opts) {
  return request('put', route, opts)
}

export function del(route, opts) {
  return request('delete', route, opts)
}

const VueAxios = {
  install(vue) {
    vue.prototype.$http = { get, post, put, del }
  }
}

Vue.use(VueAxios)
