import fs from 'fs'
import archiver from 'archiver'
import moment from 'moment'
import jsdom from 'jsdom'
import wkhtmltopdf from 'wkhtmltopdf'
import nodemailer from 'nodemailer'
import config from './../config'

import { generateHTML } from '../helpers/html'

const log = require('./../log')(module)

moment.locale('ru')

const { JSDOM } = jsdom

export default class PDFService {
  constructor(username) {
    this.username = username
  }

  removeFiles(dirPath) {
    try {
      var files = fs.readdirSync(dirPath)

      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i]
          if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath)
          else rmDir(filePath)
        }
    } catch (e) {
      return
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

        log.info(`${index} of ${data.length} done`)

        if (index === data.length) {
          resolve()

          return
        }

        if (index > data.length) {
          return
        }

        if (!photo.carouselMedia) {
          const callback = () => {
            iterate(++currentIndex)
          }

          this.createPdf(photo, page, callback)

          page += 1
        } else {
          let carouselCurrentCount = 0

          photo.carouselMedia.forEach(carouselPhoto => {
            const callback = () => {
              carouselCurrentCount += 1

              if (carouselCurrentCount === photo.carouselMedia.length) {
                iterate(++currentIndex)
              }
            }

            this.createPdf({ ...photo, ...carouselPhoto }, page, callback)

            page += 1
          })
        }
      }

      iterate(currentIndex)
    })
  }

  createPdf(photo, page, callback) {
    try {
      let output = fs.createWriteStream(`./public/temp/${page}.pdf`)

      output
        .on('finish', () => {
          output = null
          process.nextTick(callback)
        })
        .on('error', err => {
          log.error('wkhtmltopdf error output', err)
          this.createPdf(photo, page, callback)
        })

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

      wkhtmltopdf(
        dom.serialize(),
        {
          noPdfCompression: true,
          dpi: 300,
          imageQuality: 100
        },
        (error, stream) => {
          if (error) {
            log.error('wkhtmltopdf error inside', error)

            fs.unlinkSync(`./public/temp/${page}.pdf`)

            this.createPdf(photo, page, callback)
          }
        }
      ).pipe(output)
    } catch (error) {
      log.error('wkhtmltopdf error', error)

      fs.unlinkSync(`./public/temp/${page}.pdf`)

      this.createPdf(photo, page, callback)
    }
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
      to: 'workinformer@gmail.com',
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
  to: 'workinformer@gmail.com',
  subject: 'Archive',
  text: 'Ссылка',
  html: `<a href="http://185.195.26.110:8080/buzova86.zip">Скачать архив</a>`
}

transporter.sendMail(mailOptions, function(error, info) {
  if (error) {
    return console.log(error)
  } else {
    log.info('ok')
  }
})
