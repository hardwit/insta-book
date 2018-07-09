import jwt from 'jsonwebtoken'
import config from './../../config'
import InstaService from '../../services/instagram.service'

const insta = new InstaService()

const instagram = {
  getPhotos: () => async (req, res) => {
    const username = req.query.username

    if (!username) {
      res.json({
        success: false,
        message: 'Please, pass a username.'
      })

      return
    }

    const result = await insta.getPhotosByNickName(username)

    return res.json({ success: true, data: result })
  }
}

export default instagram
