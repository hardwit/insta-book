import api from './../api'

const instagramRoutes = app => {
  app.route('/photos').get(api.getPhotos())
}

export default instagramRoutes
