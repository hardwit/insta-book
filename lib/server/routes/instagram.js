import api from './../api'

const instagramRoutes = app => {
  app.route('/api/photos').get(api.getPhotos())
  app.route('/api/createArchive').post(api.createArchive())
}

export default instagramRoutes
