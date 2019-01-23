from concurrent import futures
import time
from PIL import Image

import grpc

import recognition_pb2
import recognition_pb2_grpc
import water_predict as wp
import elect_predict as ep

_ONE_DAY_IN_SECONDS = 60 * 60 * 24


def getImgData(filePath):
    imgData = Image.open(filePath)
    imgSize = imgData.size
    targetSize = 500
    if max(imgSize) > targetSize:
        if imgSize[0] > imgSize[1]:
            ratio = float(targetSize)/float(imgSize[0])
            imgSize = (int(targetSize), int(float(imgSize[1])*ratio))
        else:
            ratio = float(targetSize)/float(imgSize[1])
            imgSize = (int(float(imgSize[0])*ratio), int(targetSize))
        imgData = imgData.resize(imgSize)
    return imgData


class Recognitioner(recognition_pb2_grpc.RecognizeServicer):
    def __init__(self):
        self.wp = wp.Detector("./pb/water_multi.pb")
        self.ep = ep.Detector("./pb/elect_all.pb", "./pb/elect_multi.pb")

    def __del__(self):
        self.wp.close()
        self.ep.close()

    def Recognize(self, request, context):
        print(request)
        if request.type == recognition_pb2.Request.WATER:
            waterImg = getImgData(request.imgPath)
            waterDegreeArr = self.wp.predict(waterImg)
            print(waterDegreeArr)
            waterDegree = 0
            for item in waterDegreeArr:
                if type(item) == int:
                    waterDegree = waterDegree * 10 + item
            waterDegree = waterDegree / 10
            print(waterDegree)
            return recognition_pb2.Response(degree=waterDegree)
        else:
            electImg = getImgData(request.imgPath)
            electDegreeArr = self.ep.predict(electImg)
            print(electDegreeArr)

            return recognition_pb2.Response(degree=electDegreeArr[1])

    def closeTfSession(self):
        self.wp.close()


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    recognition_pb2_grpc.add_RecognizeServicer_to_server(
        Recognitioner(), server)
    server.add_insecure_port('[::]:50000')
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    serve()
