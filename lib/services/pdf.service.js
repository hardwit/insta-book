import PDF from 'pdfkit'
import fs from 'fs'
import request from 'request'
import archiver from 'archiver'

export default class PDFService {
  constructor() {
    this.pdfSession = Math.random()
  }

  createPdfFiles(data = []) {
    const dir = './temp'

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
        const output = fs.createWriteStream(`./temp/${index + 1}.pdf`)

        doc.pipe(output)

        output.on('finish', function() {
          currentCount += 1

          if (currentCount === data.length) {
            resolve()
          }
        })

        request(
          {
            url: photo.imageUrl,
            encoding: null
          },
          function(err, response, body) {
            if (err) throw err

            doc
              .image(body, {
                width: 552,
                align: 'center',
                valign: 'center'
              })
              .moveDown(0.5)
            doc
              .font('./fonts/DejaVuSans.ttf')
              .fontSize(15)
              .text(`Количество лайков: ${photo.likeCount}`, { align: 'center' })
              .moveDown(0.5)
            doc
              .font('./fonts/DejaVuSans.ttf')
              .fontSize(15)
              .text('Описание', { align: 'center' })

            doc.end()
          }
        )
      })
    })
  }

  createArchive() {
    return new Promise(resolve => {
      const output = fs.createWriteStream('./example.zip')

      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
      })

      output.on('close', function() {
        resolve()
      })

      archive.pipe(output)

      archive.directory('temp/', false)
      archive.finalize()
    })
  }

  async start(data) {
    await this.createPdfFiles(data)
    await this.createArchive()
  }
}
