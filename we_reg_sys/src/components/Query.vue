<template lang="html">
  <div class="query">
    
    <div style="line-height: 60px; font-size: 25px;">查询水电使用信息</div>
 
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
    <mt-button type="primary" size="large" @click="queryWEInfo" style="margin-top: 10px">查询</mt-button>
    <div v-show="isShowTable">
        <mt-cell style="text-align: center;"> 
            <span>层数</span>
            <span>房间号</span>
            <span>水</span>
            <span>电</span>
        </mt-cell>
        <div v-for="item in WEInfoShow">
        <mt-cell> 
            <span>
            {{ item.layerNum }}
            </span>
            <span>
            {{ item.roomNum }}
            </span>
            <span>
            {{ item.waterDegree }}
            </span>
            <span>
            {{ item.electDegree }}
            </span>
        </mt-cell>
        </div>
    </div>
    <mt-popup v-model="YPickerVis" position="bottom" style="width: 100%">
      <mt-picker :slots="YSlots" @change="onYChange"></mt-picker>
    </mt-popup>
    <mt-popup v-model="MPickerVis" position="bottom" style="width: 100%">
      <mt-picker :slots="MSlots" @change="onMChange"></mt-picker>
    </mt-popup>
    <mt-popup v-model="HNPickerVis" position="bottom" style="width: 100%">
      <mt-picker :slots="HNSlots" @change="onHNChange"></mt-picker>
    </mt-popup>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      HNSlots(state) {
        let val = [{ values: [] }];
        if (!state.houseInfo) {
          return val;
        }
        for (let i = 0; i < state.houseInfo.length; i++) {
          val[0].values.push(state.houseInfo[i].name);
        }
        return val;
      }
    }),
    WEInfoShow: function() {
      let obj = [];
      let info = this.WEInfo;
      if (!info) {
        return obj;
      }
      for (let i = 0; i < info.length; i++) {
        obj.push({
          layerNum: info[i].layerNum,
          roomNum: info[i].roomNum,
          waterDegree: info[i].waterDegree,
          electDegree: info[i].electDegree
        });
      }
      return obj;
    }
  },
  data() {
    return {
      houseSelected: null,
      houseName: "",
      curYear: null,
      curMon: null,
      HNPickerVis: false,
      YPickerVis: false,
      MPickerVis: false,
      WEInfo: null,
      isShowTable: false,
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
  methods: {
    queryWEInfo() {
      if (!this.houseSelected) {
        this.$toast({
          message: "未选择",
          duration: 2000
        });
        return;
      }
      this.$axios
        .post("/api/query-we-info", {
          year: this.curYear,
          month: this.curMon,
          houseInfo: this.houseSelected
        })
        .then(res => {
          if (res.code === "000001") {
            this.WEInfo = res.data;
            this.isShowTable = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onHNChange(picker, values) {
      this.houseName = values[0];
      if (!this.$store.state.houseInfo) {
        return;
      }
      let houseFound = this.$store.state.houseInfo.find(h => {
        return h.name === this.houseName;
      });
      if (houseFound) {
        this.houseSelected = houseFound;
      }
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

<style scoped>
span {
  display: inline-block;
  height: 20px;
  width: 90px;
}
</style>