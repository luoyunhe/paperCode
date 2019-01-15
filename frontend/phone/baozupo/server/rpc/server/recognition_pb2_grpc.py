# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
import grpc

import recognition_pb2 as recognition__pb2


class RecognizeStub(object):
  """The greeting service definition.
  """

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.Recognize = channel.unary_unary(
        '/recognition.Recognize/Recognize',
        request_serializer=recognition__pb2.Request.SerializeToString,
        response_deserializer=recognition__pb2.Response.FromString,
        )


class RecognizeServicer(object):
  """The greeting service definition.
  """

  def Recognize(self, request, context):
    """Sends a greeting
    """
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_RecognizeServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'Recognize': grpc.unary_unary_rpc_method_handler(
          servicer.Recognize,
          request_deserializer=recognition__pb2.Request.FromString,
          response_serializer=recognition__pb2.Response.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'recognition.Recognize', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))