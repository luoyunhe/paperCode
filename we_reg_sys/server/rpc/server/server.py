from concurrent import futures
import time

import grpc

import recognition_pb2
import recognition_pb2_grpc

_ONE_DAY_IN_SECONDS = 60 * 60 * 24


class Recognitioner(recognition_pb2_grpc.RecognizeServicer):

    def Recognize(self, request, context):
        print request
        return recognition_pb2.Response(degree=100)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    recognition_pb2_grpc.add_RecognizeServicer_to_server(Recognitioner(), server)
    server.add_insecure_port('[::]:50000')
    server.start()
    try:
        while True:
            time.sleep(_ONE_DAY_IN_SECONDS)
    except KeyboardInterrupt:
        server.stop(0)


if __name__ == '__main__':
    serve()
