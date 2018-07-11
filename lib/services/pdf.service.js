import PDF from 'pdfkit'
import fs from 'fs'
import request from 'request'
import archiver from 'archiver'
import moment from 'moment'

moment.locale('ru')

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
        const doc = new PDF({
          margins: {
            top: 30,
            left: 30,
            right: 30,
            bottom: 30
          }
        })

        const output = fs.createWriteStream(`./public/temp/${index + 1}.pdf`)

        doc.pipe(output)

        output.on('finish', function () {
          currentCount += 1

          if (currentCount === data.length) {
            resolve()
          }
        })

        if (!photo.carouselMedia) {
          request(
            {
              url: photo.imageUrl,
              encoding: null
            },
            (err, response, body) => {
              if (err) throw err

              this.createPdf(doc, body, photo)
            }
          )
        } else {
          currentCount += 1
        }
      })
    })
  }

  createPdf(doc, body, photo) {
    const date = moment(photo.date).format('LL')
    const formatedDate = date.slice(0, date.length - 3)

    doc
      .image(body, {
        width: 552,
        align: 'center',
        valign: 'center'
      })
      .translate(465, -10)
      .moveDown(2)
    doc
      .image('./image/heart.jpg', {
        align: 'center',
        valign: 'centre',
        width: 20
      })
      .translate(-465, 3)
      .moveDown(-2.7)
    doc
      .font('./fonts/ProximaNova-LightIt.ttf')
      .fontSize(14)
      // .fontStyle(italic)
      .text(formatedDate, { align: 'left' })
      .translate(-45, 0)

    doc
      .fontSize(14)
      .text(`${photo.likeCount}`, { align: 'right' })
      .translate(45, 0)
      .moveDown(-1, 5)
    doc
      .font('./fonts/ProximaNova-LightIt.ttf')
      .fontSize(14)
      .text(`Воронеж`, { align: 'left' })
      .moveDown(1)
    doc
      .font('./fonts/ProximaNova-Regular.ttf')
      .fontSize(16)
      .text(`${photo.caption || ''}`, { align: 'left' })
    doc.end()
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
