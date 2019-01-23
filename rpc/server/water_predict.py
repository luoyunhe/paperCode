import numpy as np
import os
import tensorflow as tf
from PIL import Image
import time



NUM_CLASSES_MULTI_DIGIT = 13


class Detector:

    def __init__(self, path_to_ckpt):
        self.score_threshold = 0.7
        self.detection_graph = tf.Graph()

        with self.detection_graph.as_default():

            od_graph_def_multi_digit = tf.GraphDef()
            with tf.gfile.GFile(path_to_ckpt, 'rb') as fid:
                serialized_graph = fid.read()
                od_graph_def_multi_digit.ParseFromString(serialized_graph)
                tf.import_graph_def(
                    od_graph_def_multi_digit, name='multi_digit')

        self.start_graph = self.detection_graph.as_default()
        self.sess = tf.Session(graph=self.detection_graph)


    def close(self):
        self.sess.close()

    def _predict(self, name, image_np):
        image_tensor = self.detection_graph.get_tensor_by_name(
            name+'/'+'image_tensor:0')
        detection_boxes = self.detection_graph.get_tensor_by_name(
            name+'/'+'detection_boxes:0')
        detection_scores = self.detection_graph.get_tensor_by_name(
            name+'/'+'detection_scores:0')
        detection_classes = self.detection_graph.get_tensor_by_name(
            name+'/'+'detection_classes:0')
        num_detections = self.detection_graph.get_tensor_by_name(
            name+'/'+'num_detections:0')

        image_np_expanded = np.expand_dims(image_np, axis=0)

        (boxes, scores, classes, num) = self.sess.run(
            [detection_boxes, detection_scores, detection_classes, num_detections],
            feed_dict={image_tensor: image_np_expanded})

        return boxes, scores, classes, num

    def predict_multi_digit(self, image_np):

        boxes, scores, classes, num = self._predict(
            name='multi_digit', image_np=image_np)

        boxes_value = np.squeeze(boxes)
        classes_value = np.squeeze(classes)
        scores_value = np.squeeze(scores)
        classes_value = np.reshape(classes_value, [-1, 1])
        scores_value = np.reshape(scores_value, [-1, 1])
        boxes_classes = np.concatenate(
            (boxes_value, classes_value, scores_value), axis=1)

        new_boxes = []
        for boxes_classes_item in boxes_classes:
            if boxes_classes_item[-1] < self.score_threshold:
                continue
            new_boxes.append(boxes_classes_item)
        boxes_classes = new_boxes

        boxes_result = sorted(boxes_classes, key=lambda x: x[1])

        result = []
        for boxes_classes_item in boxes_result:
            result_item = int(boxes_classes_item[4])
            if result_item == 10:
                result_item = 0
            if result_item == 11:
                result_item = 'h'
            if result_item == 12:
                result_item = 'm'
            result.append(result_item)

        return result

    def predict(self, image):
        start = time.clock()
        result = self.predict_multi_digit(np.array(image))
        end = time.clock()


        return result


def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape(
        (im_height, im_width, 3)).astype(np.uint8)

