<template>
  <div class="baozupo">
    <div style="line-height: 60px; font-size: 25px;">录入水表、电表信息</div>
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
    <mt-field label="楼名：" v-model="houseName" disabled>
      <mt-button
        type="primary"
        size="small"
        @click="HNPickerVis = true"
        style="margin-left: 30px"
      >选择楼名</mt-button>
    </mt-field>
    <mt-field label="楼层：" v-model="layerNum" disabled>
      <mt-button
        type="primary"
        size="small"
        @click="LNPickerVis = true"
        style="margin-left: 30px"
      >选择楼层</mt-button>
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
    <mt-popup v-model="LNPickerVis" position="bottom" style="width: 100%">
      <mt-picker :slots="LNSlots" @change="onLNChange"></mt-picker>
    </mt-popup>
    <mt-popup v-model="RNPickerVis" position="bottom" style="width: 100%">
      <mt-picker :slots="RNSlots" @change="onRNChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import Vue from "vue";
import PhotoSelector from "@/components/PhotoSelector";
import { mapState } from "vuex";
export default {
  name: "TakePhoto",
  components: {
    "photo-selector": PhotoSelector
  },
  beforeMount: function() {
    this.$axios
      .get("/api/get-user-info")
      .then(res => {
        this.$store.commit("updateInfo", res.data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: mapState({
    HNSlots(state) {
      let val = [{ values: [] }];
      if (!state.houseInfo) {
        return val;
      }
      for (let i = 0; i < state.houseInfo.length; i++) {
        val[0].values.push(state.houseInfo[i].name);
      }
      return val;
    },
    RNSlots(state) {
      let val = [{ values: [] }];
      if (!state.houseInfo) {
        return val;
      }
      let houseFound = state.houseInfo.find(h => {
        return h.name === this.houseName;
      });
      if (houseFound) {
        this.houseSelected = houseFound;
        for (let i = 0; i < houseFound.roomSize; i++) {
          let num = i + 1;
          if (num < 10) {
            val[0].values.push("0" + num.toString());
          } else {
            val[0].values.push(num.toString());
          }
        }
      }
      return val;
    },
    LNSlots(state) {
      let val = [{ values: [] }];
      if (!state.houseInfo) {
        return val;
      }
      let houseFound = state.houseInfo.find(h => {
        return h.name === this.houseName;
      });
      if (houseFound) {
        for (let i = 0; i < houseFound.layerSize; i++) {
          let num = i + 1;
          val[0].values.push(num.toString());
        }
      }
      return val;
    }
  }),
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
      houseName: "",
      houseSelected: null,
      HNPickerVis: false,
      layerNum: "1",
      roomNum: "01",
      LNPickerVis: false,
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
      //console.log(imgs[0]);
      this.$axios
        .post("/api/upload", {
          houseInfo: this.houseSelected,
          layerNum: this.layerNum,
          roomNum: this.roomNum,
          year: this.curYear,
          month: this.curMon,
          imgs
        })
        .then(res => {
          if (res.code === "000001") {
            console.log(res);
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
      this.roomNum = values[0];
    },
    onLNChange(picker, values) {
      this.layerNum = values[0];
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
