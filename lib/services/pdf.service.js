import fs from 'fs'
import archiver from 'archiver'
import moment from 'moment'
import jsdom from 'jsdom'
import wkhtmltopdf from 'wkhtmltopdf'

import { generateHTML } from '../helpers/html'

moment.locale('ru')

const { JSDOM } = jsdom

export default class PDFService {
  constructor() {
    this.pdfSession = Math.random()
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
      let currentCount = 0

      data.forEach((photo, index) => {
        const output = fs.createWriteStream(`./public/temp/${index + 1}.pdf`)

        output.on('finish', function() {
          currentCount += 1

          if (currentCount === data.length) {
            resolve()
          }
        })

        if (!photo.carouselMedia) {
          this.createPdf(output, photo)
        } else {
          currentCount += 1
        }
      })
    })
  }

  createPdf(output, photo) {
    const date = moment(photo.date).format('LL')
    const formatedDate = date.slice(0, date.length - 3)

    const params = {
      date,
      imageUrl: photo.imageUrl,
      location: photo.location,
      likeCount: photo.likeCount,
      caption: photo.caption
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
      const output = fs.createWriteStream('./public/example.zip')

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

  async start(data) {
    await this.createPdfFiles(data)
    await this.createArchive()
  }
}
