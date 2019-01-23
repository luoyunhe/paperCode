<template>
  <div style="margin-top: 20px; background-color:pink;1">
    <div class="image-list">
      <div class="list-default-img" v-show="isPhoto" @click.stop="addPic">
        <img src="../assets/camera.png">
        <div>请选择或者拍照上传照片</div>
        <input
          ref="cameraInput"
          type="file"
          accept="image/jpeg, image/jpg, 1/png"
          capture="camera"
          @change="onFileChange"
          style="display: none;"
        >
      </div>
      <ul class="list-ul" v-show="!isPhoto" style="padding-left: 0">
        <li class="list-li" v-for="(iu, index) in imgUrls">
          <img :src="iu">
          <span class="list-img-close" @click="delImage(index)"></span>
        </li>
        <li class="list-li-add" @click.stop="addPic" v-show="canAdd"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
Vue.use(MintUI);
import Compressor from "compressorjs";
export default {
  data: function() {
    return {
      imgUrls: [],
      base64Imgs: [],
      isPhoto: true,
      canAdd: true
    };
  },
  watch: {
    imgUrls: "toggleAddPic"
  },
  methods: {
    toggleAddPic: function() {
      let vm = this;
      if (vm.imgUrls.length >= 1) {
        vm.isPhoto = false;
      } else {
        vm.isPhoto = true;
      }
      if (vm.imgUrls.length < 2) {
        vm.canAdd = true;
      } else {
        vm.canAdd = false;
      }
    },
    addPic: function(e) {
      let vm = this;
      vm.$refs.cameraInput.click();
      return false;
    },
    blobToDataURL(blob, callback) {
      var a = new FileReader();
      a.onload = function(e) {
        callback(e.target.result);
      };
      a.readAsDataURL(blob);
    },
    onFileChange: function(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files, e);
    },
    createImage: function(files, e) {
      console.log("createImage");
      let vm = this;
      new Compressor(files[0], {
        quality: 0.1,
        success(result) {
          vm.blobToDataURL(result, res => {
            vm.base64Imgs.push(res);
            let url = URL.createObjectURL(result);
            vm.imgUrls.push(url);
          });
        },
        error(err) {
          console.log(err.message);
        }
      });
    },
    delImage: function(index) {
      let vm = this;
      MintUI.MessageBox.confirm("确定删除该图片?").then(
        action => {
          vm.imgUrls.splice(index, 1);
          vm.base64Imgs.splice(index, 1);
        },
        reject => {}
      );
    }
  }
};
</script>
<style scoped>
.list-default-img * {
  display: inline-block;
  vertical-align: middle;
}
.list-default-img img {
  width: 100px;
  height: 100px;
}
.list-li img {
  width: 100px;
  height: 100px;
  margin-left: 4px;
  margin-top: 4px;
}
.list-li {
  display: inline-block;
  position: relative;
}
.list-img-close {
  width: 20px;
  height: 20px;
  background-image: url("../assets/X.svg");
  background-size: 20px 20px;
  position: absolute;
  left: 80px;
  top: 4px;
}
.list-li-add {
  display: inline-block;
  width: 100px;
  height: 100px;
  background-image: url("../assets/plus.svg");
  background-repeat: no-repeat;
  background-position: 20px 20px;
  background-color: #e0e0e0;
}
</style>

