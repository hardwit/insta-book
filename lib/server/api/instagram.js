import jwt from 'jsonwebtoken'
import config from './../../config'
import InstaService from '../../services/instagram.service'
import PDFService from '../../services/pdf.service'

const log = require('./../../log')(module)

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

    try {
      log.info(`${username}.zip creation start`)

      await pdf.start(result)

      log.info(`${username}.zip creation end`)

      return res.json({ success: true, data: result })
    } catch (error) {
      log.error(`${username}.zip creation failed: ${error}`)
    }
  },
  createArchive: () => async (req, res) => {
    req.connection.setTimeout(60 * 60 * 10000)

    const data = req.body.data

    const pdf = new PDFService()

    await pdf.start(data)

    return res.json({ success: true, data: '/example.zip' })
  }
}

export default instagram
