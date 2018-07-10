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
                .translate(465,-10 )
                .moveDown(2)
            doc
                .image('./image/heart.jpg', {
                    align: 'center',
                    valign: 'centre',
                    width: 20
                } )
                .translate(-465,3 )
                .moveDown(-2.7)
            doc
              .font('./fonts/ProximaNova-LightIt.ttf')
              .fontSize(14)
              // .fontStyle(italic)
              .text(`10 июля 2018`, { align: 'left' })
                .translate(-45,0 )

            doc
              .fontSize(14)
              .text(`${photo.likeCount}`, { align: 'right' })
                .translate(45,0 )
                .moveDown(-1,5)
            doc
            .font('./fonts/ProximaNova-LightIt.ttf')
            .fontSize(14)
            .text(`Воронеж`, { align: 'left' })
            .moveDown(1)
            doc
              .font('./fonts/ProximaNova-Regular.ttf')
              .fontSize(16)
              .text(`${photo.caption}`, { align: 'left' })
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

const data = [
    {
        caption: '#maksVa',
        imageUrl:
            'https://scontent-arn2-1.cdninstagram.com/vp/b10ef946279c0b27f4e8eebfe915fb4e/5BC91985/t51.2885-15/e35/31296736_1710248885730133_2921205290361683968_n.jpg?se=8&ig_cache_key=MTc2OTY5Njg4ODk5MzgxNTY3OA%3D%3D.2',
        likeCount: 12
    },
    {
        caption: '#title',
        imageUrl:
            'https://scontent-arn2-1.cdninstagram.com/vp/15086933d8f8c0adce6b96d148d4c77d/5BEBBA46/t51.2885-15/e15/16789115_1886124245000473_5828374619010105344_n.jpg?ig_cache_key=MTQ1MDc1MjA1NTk5MTMzMzIwNw%3D%3D.2',
        likeCount: 5
    }

]

const pdf = new PDFService()
pdf.createPdfFiles(data)