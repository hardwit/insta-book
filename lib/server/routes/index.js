import authRoutes from './auth'
import instagramRoutes from './instagram'

const combineRoutes = routes => app => {
  Object.keys(routes).forEach(route => routes[route](app))
}

const routes = {
  authRoutes,
  instagramRoutes
}

export default combineRoutes(routes)
