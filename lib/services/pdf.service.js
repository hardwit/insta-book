import fs from 'fs'
import archiver from 'archiver'
import moment from 'moment'
import jsdom from 'jsdom'
import wkhtmltopdf from 'wkhtmltopdf'
import nodemailer from 'nodemailer'
import config from './../config'

import { generateHTML } from '../helpers/html'

moment.locale('ru')

const { JSDOM } = jsdom

export default class PDFService {
  constructor(username) {
    this.username = username
  }

  removeFiles(dirPath) {
    try {
      var files = fs.readdirSync(dirPath)
    } catch (e) {
      return
    }

    if (files.length > 0)
      for (var i = 0; i < files.length; i++) {
        var filePath = dirPath + '/' + files[i]
        if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath)
        else rmDir(filePath)
      }
  }

  createPdfFiles(data = []) {
    const dir = './public/temp'

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }

    return new Promise(resolve => {
      let page = 1

      let currentIndex = 0

      const iterate = index => {
        const photo = data[index]

        if (index === data.length) {
          resolve()

          return
        }

        if (!photo.carouselMedia) {
          const output = fs.createWriteStream(`./public/temp/${page}.pdf`)

          output.on('finish', function() {
            iterate(++currentIndex)
          })

          this.createPdf(output, photo, page)

          page += 1
        } else {
          let carouselCurrentCount = 0

          photo.carouselMedia.forEach(carouselPhoto => {
            const output = fs.createWriteStream(`./public/temp/${page}.pdf`)

            output.on('finish', function() {
              carouselCurrentCount += 1

              if (carouselCurrentCount === photo.carouselMedia.length) {
                iterate(++currentIndex)
              }
            })

            this.createPdf(output, { ...photo, ...carouselPhoto }, page)

            page += 1
          })
        }
      }

      iterate(currentIndex)
    })
  }

  createPdf(output, photo, page) {
    const date = moment(photo.date).format('LL')
    const formatedDate = date.slice(0, date.length - 3)

    const params = {
      date,
      imageUrl: photo.imageUrl,
      location: photo.location,
      likeCount: photo.likeCount,
      caption: photo.caption,
      page
    }

    const dom = new JSDOM(generateHTML(params), {
      runScripts: 'dangerously',
      resources: 'usable'
    })

    wkhtmltopdf(dom.serialize(), {
      noPdfCompression: true,
      dpi: 300,
      imageQuality: 100
    }).pipe(output)
  }

  createArchive() {
    return new Promise(resolve => {
      const archiveName = `./public/${this.username}.zip`

      const output = fs.createWriteStream(archiveName)

      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      })

      output.on('close', () => {
        this.removeFiles('public/temp/')
        resolve()
      })

      archive.pipe(output)

      archive.directory('public/temp/', false)
      archive.finalize()
    })
  }

  sendMailWithArchiveName() {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secureConnection: false,
      requiresAuth: true,
      domains: ['gmail.com', 'googlemail.com'],
      auth: {
        user: config.get('email:user'),
        pass: config.get('email:password')
      }
    })

    var mailOptions = {
      from: '"Insta Book" <englishforinsta@gmail.com>',
      to: 'iamzalant@gmail.com',
      subject: 'Archive',
      text: 'Ссылка',
      html: `<a href="http://185.195.26.110:8080/${this.username}.zip">Скачать архив</a>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error)
      }
    })
  }

  async start(data) {
    await this.createPdfFiles(data)
    await this.createArchive()
    await this.sendMailWithArchiveName()
  }
}
