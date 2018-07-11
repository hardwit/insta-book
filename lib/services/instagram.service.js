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
      const imageUrl = (medium._params.images).sort((prev, next) => prev.width < next.width)[0].url || false

      let carouselMedia = false

      if (Array.isArray(medium._params.carouselMedia) && medium._params.carouselMedia.length) {
        carouselMedia = medium._params.carouselMedia.map(
          images => ({ imageUrl: (images._params.images).sort((prev, next) => prev.width < next.width)[0].url })
        )
      }

      const result = {
        likeCount: medium._params.likeCount,
        caption: medium._params.caption,
        date: medium._params.takenAt,
        imageUrl,
        carouselMedia
      }

      return result
    })

    return photoList
  }
}



