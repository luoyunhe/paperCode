import numpy as np
import os
import tensorflow as tf
import cv2
from PIL import Image


NUM_CLASSES_RECT = 2
NUM_CLASSES_MULTI_DIGIT = 11


class Detector:

    def __init__(self, path_to_ckpt_screen, path_to_ckpt_multi_digit):
        self.score_threshold = 0.7
        self.detection_graph = tf.Graph()

        with self.detection_graph.as_default():
            od_graph_def_screen = tf.GraphDef()
            with tf.gfile.GFile(path_to_ckpt_screen, 'rb') as fid:
                serialized_graph = fid.read()
                od_graph_def_screen.ParseFromString(serialized_graph)
                tf.import_graph_def(od_graph_def_screen, name='rect')

            od_graph_def_multi_digit = tf.GraphDef()
            with tf.gfile.GFile(path_to_ckpt_multi_digit, 'rb') as fid:
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

    def predict_rect(self, image):
        image_np = load_image_into_numpy_array(image)
        boxes, scores, classes, num = self._predict(
            name='rect', image_np=image_np)

        height, width = image_np.shape[:2]
        best_box = boxes[0, 0]

        y = int(best_box[0] * height)
        x = int(best_box[1] * width)
        h = int(best_box[2] * height)
        w = int(best_box[3] * width)

        image_crop = np.empty([h - y, w - x, 3], dtype=np.uint8)
        image_crop[:, :, :] = image_np[y:h, x:w, :]

        ratio = float(h-y)/float(w-x)

        return image_crop, ratio

    def preprocess(self, image_np):
        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)

        mean_pix = np.mean(gray)

        threshold = 127.

        if mean_pix < threshold:
            mul = threshold / mean_pix
            shape = gray.shape
            for i in range(shape[0]):
                for j in range(shape[1]):
                    new_value = int(float(gray[i, j]) * mul)
                    if new_value > 255:
                        new_value = 255
                    gray[i, j] = new_value

        merged = cv2.merge([gray, gray, gray])

        return merged

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
            result.append(result_item)

        return result

    def predict(self, image):
        image_rect, ratio = self.predict_rect(image)
        image_preprocessed = self.preprocess(image_rect)
        result = self.predict_multi_digit(image_preprocessed)

        result_number = 0
        for number in result:
            result_number = result_number * 10 + int(number)

        if ratio > 0.38:
            result_number = float(result_number)/100
        else:
            result_number = float(result_number)/10

        return result, result_number


def load_image_into_numpy_array(image):
    (im_width, im_height) = image.size
    return np.array(image.getdata()).reshape(
        (im_height, im_width, 3)).astype(np.uint8)


def create_category_index():
    category_index = {}
    for index in range(10):
        id_name = {'id': index+1,
                   'name':  str(index+1) if index+1 != 10 else '0'}
        category_index[index+1] = id_name
    return category_index
