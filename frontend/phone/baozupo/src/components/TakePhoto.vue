<template>
  <div class="baozupo">
    <mt-field label="年份：" v-model="curYear" disabled>
      <mt-button
        type="primary"
        size="small"
        @click="YPickerVis = true"
        style="margin-left: 30px"
      >选择年份</mt-button>
    </mt-field>
    <mt-field label="月份：" v-model="curMon" disabled>
      <mt-button
        type="primary"
        size="small"
        @click="MPickerVis = true"
        style="margin-left: 30px"
      >选择月份</mt-button>
    </mt-field>
    <mt-field label="楼号：" v-model="houseName" disabled>
      <mt-button
        type="primary"
        size="small"
        @click="HNPickerVis = true"
        style="margin-left: 30px"
      >选择楼号</mt-button>
    </mt-field>
    <mt-field label="房号：" v-model="roomNum" disabled>
      <mt-button
        type="primary"
        size="small"
        @click="RNPickerVis = true"
        style="margin-left: 30px"
      >选择房号</mt-button>
    </mt-field>
    <photo-selector ref="photoSelector"></photo-selector>
    <mt-button type="primary" size="large" @click="upload" style="margin-top: 50px">上传处理</mt-button>

    <mt-popup v-model="YPickerVis" position="bottom" style="width: 100%">
      <mt-picker :slots="YSlots" @change="onYChange"></mt-picker>
    </mt-popup>
    <mt-popup v-model="MPickerVis" position="bottom" style="width: 100%">
      <mt-picker :slots="MSlots" @change="onMChange"></mt-picker>
    </mt-popup>
    <mt-popup v-model="HNPickerVis" position="bottom" style="width: 100%">
      <mt-picker :slots="HNSlots" @change="onHNChange"></mt-picker>
    </mt-popup>
    <mt-popup v-model="RNPickerVis" position="bottom" style="width: 100%">
      <mt-picker :slots="RNSlots" @change="onRNChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import Vue from "vue";
import PhotoSelector from "@/components/PhotoSelector";
export default {
  name: "TakePhoto",
  components: {
    "photo-selector": PhotoSelector
  },
  mounted: function() {
    let curDate = new Date();
    this.curYear = curDate.getFullYear();
    this.curMon = curDate.getMonth() + 1;
    if (this.curMon < 10) {
      this.curMon = "0" + this.curMon.toString();
    } else {
      this.curMon = this.curMon.toString();
    }
  },
  data() {
    return {
      houseName: "真如苑",
      HNPickerVis: false,
      roomNum: 101,
      RNPickerVis: false,
      YPickerVis: false,
      MPickerVis: false,
      curYear: null,
      curMon: null,
      YSlots: [
        {
          values: ["2018", "2019", "2020", "2021", "2022", "2023"]
        }
      ],
      MSlots: [
        {
          values: [
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
            "08",
            "09",
            "10",
            "11",
            "12"
          ]
        }
      ],
      HNSlots: [
        {
          values: ["真如苑", "荔枝苑", "明湖苑"]
        }
      ],
      RNSlots: [
        {
          flex: 1,
          values: ["1", "2", "3"],
          className: "slot1",
          textAlign: "right"
        },
        {
          divider: true,
          content: "--",
          className: "slot2"
        },
        {
          flex: 1,
          values: ["01", "02", "03", "04", "05", "06"],
          className: "slot3",
          textAlign: "left"
        }
      ]
    };
  },
  methods: {
    upload() {
      let imgs = this.$refs.photoSelector.base64Imgs;
      if (!imgs || imgs.length < 2) {
        this.$toast({
          message: "水表和电表图片各要一张",
          duration: 2000
        });
        return;
      }
      console.log(imgs[0]);
      this.$axios
        .post("/api/upload", {
          houseName: this.houseName,
          roomNum: this.roomNum,
          year: this.curYear,
          month: this.curMon,
          imgs
        })
        .then(res => {
          if (res.code === "000001") {
            // this.$refs.photoSelector.imgs = [];
            // this.$refs.photoSelector.imgUrls = [];
            this.$toast({
              message: "上传成功",
              duration: 1500
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.$toast({
            message: "出现了一些异常，稍后再试呗",
            duration: 1500
          });
        });
    },
    onHNChange(picker, values) {
      this.houseName = values[0];
    },
    onRNChange(picker, values) {
      this.roomNum = values[0] + values[1];
    },
    onYChange(picker, values) {
      this.curYear = values[0];
    },
    onMChange(picker, values) {
      this.curMon = values[0];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
} */
</style>
