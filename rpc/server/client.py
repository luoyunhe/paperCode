from __future__ import print_function

import grpc

import recognition_pb2
import recognition_pb2_grpc


def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    with grpc.insecure_channel('localhost:50000') as channel:
        stub = recognition_pb2_grpc.RecognizeStub(channel)
        response = stub.Recognize(recognition_pb2.Request(
            imgPath='path/to/img', type=recognition_pb2.Request.ELECT))
        print(response)
        response = stub.Recognize(recognition_pb2.Request(
            imgPath='path/to/img', type=recognition_pb2.Request.WATER))
        print(response)


if __name__ == '__main__':
    run()
