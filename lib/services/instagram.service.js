import _ from 'lodash'

const log = require('./../log')(module)

var Client = require('instagram-private-api').V1
var device = new Client.Device('instabook')
var storage = new Client.CookieMemoryStorage()

import config from './../config'

export default class InstaService {
  constructor() {
    this.session = null

    this.createSession()
  }

  async createSession() {
    this.session = await Client.Session.create(
      device,
      storage,
      config.get('instagram:login'),
      config.get('instagram:password')
    )

    log.info('Instagram session created')
  }

  async getPhotosByNickName(nick) {
    if (!this.session) {
      return null
    }

    const res = await Client.Account.searchForUser(this.session, nick)

    const id = res._params.id

    var feed = new Client.Feed.UserMedia(this.session, id)

    const results = []

    let intermediateResult = await feed.get()

    results.push(intermediateResult)

    while (feed.isMoreAvailable() === true) {
      intermediateResult = await feed.get()

      results.push(intermediateResult)
    }

    const promises = new Array(this.requestCount).fill(feed.get())

    const media = _.flatten(results)

    const photoList = _.map(media, medium => {
      const result = {
        likeCount: medium._params.likeCount,
        caption: medium._params.caption,
        imageUrl: medium._params.images.reduce((res, elem, index, arr) => {
          let prevWidth

          if (!arr[index - 1]) {
            prevWidth = -1
          } else {
            prevWidth = arr[index - 1].width
          }

          if (Number(elem.width) > Number(prevWidth)) {
            return elem && elem.url
          } else {
            return arr[index - 1] && arr[index - 1].url
          }
        }, '')
      }

      return result
    })

    return photoList
  }
}
