import jwt from 'jsonwebtoken'
import config from './../../config'
import InstaService from '../../services/instagram.service'
import PDFService from '../../services/pdf.service'

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

    const pdf = new PDFService(username)

    await pdf.start(result)

    return res.json({ success: true, data: result })
  },
  createArchive: () => async (req, res) => {
    req.connection.setTimeout(60 * 60 * 100000)

    const data = req.body.data

    const pdf = new PDFService()

    await pdf.start(data)

    return res.json({ success: true, data: '/example.zip' })
  }
}

export default instagram
