const path = require('path')
var PROTO_PATH = path.join(__dirname, '/../protos/recognition.proto')

var grpc = require('grpc')
var protoLoader = require('@grpc/proto-loader')
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  })
var proto = grpc.loadPackageDefinition(packageDefinition)
var recognitionProto = proto.recognition
var client = new recognitionProto.Recognize('localhost:50000', grpc.credentials.createInsecure())

function recognize (request) {
  return new Promise((resolve, reject) => {
    client.Recognize({
      imgPath: request.imgPath,
      type: request.type
    }, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

module.exports = { recognize }

// client.Recognize({
//   imgPath: '/mypath',
//   type: 0
// }, function (err, response) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(response)
//   }
// })
