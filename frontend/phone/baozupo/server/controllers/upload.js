const fs = require('fs')
const path = require('path')

class UploadController {
  static async upload (ctx) {
    let id = ctx.state.user._id
    let body = ctx.request.body
    let imgs = body.imgs
    body.imgs = null
    console.log(body)
    for (let i = 0; i < imgs.length; i++) {
      let base64Start = imgs[i].indexOf(',', 0) + 1
      let suffixEnd = imgs[i].indexOf(';base64', 0)
      let suffix = imgs[i].substr(11, suffixEnd - 11)
      let content = imgs[i].substr(base64Start)
      let imgBuff = Buffer.from(content, 'base64')
      let fileName = `${id}#${body.year}${body.month}#${body.roomNum}#${i}.${suffix}`
      let filePath = path.join(__dirname, '../imgStore/', fileName)
      await fs.writeFileSync(filePath, imgBuff)
    }
    ctx.send(null, '上传成功')
  }
}

module.exports = UploadController
