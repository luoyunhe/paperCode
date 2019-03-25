<template>
  <div class="baozupo">
    <div style="line-height: 60px; font-size: 25px;">录入水表、电表信息</div>
    <el-form :inline="true" label-width="80px" class="demo-form-inline" style="margin-top: 30px;">
          <el-form-item label="选择年份">
            <el-select v-model="curYear" placeholder="请选择年份">
              <el-option v-for="item in yearoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择月份" style="text-align:left;">
            <el-select v-model="curMon" placeholder="请选择月份">
              <el-option v-for="item in monthoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择楼名">
            <el-select v-model="houseName" placeholder="请选择楼名">
              <el-option v-for="item in HNSlots" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择楼层" style="text-align:left;">
            <el-select v-model="layerNum" placeholder="请选择楼层">
              <el-option v-for="item in LNSlots" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择房号">
            <el-select v-model="roomNum" placeholder="请选择房号">
              <el-option v-for="item in RNSlots" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
          </el-form-item>
    </el-form>
    <photo-selector ref="photoSelector"></photo-selector>
    <el-button type="primary" size="large" @click="upload" style="margin-top:20px;width:67%;">上传处理</el-button>

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
      let val = [];
      if (!state.houseInfo) {
        return val;
      }
      for (let i = 0; i < state.houseInfo.length; i++) {
        let house_value={
            label:'',
            value:''
        }
        house_value.label=state.houseInfo[i].name
        house_value.value=state.houseInfo[i].name
        val.push(house_value);
      }
      return val;
    },
    RNSlots(state) {
      let val = [];
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
          let layer_value={
              label:'',
              value:''
          }
          if (num < 10) {
            layer_value.label="0" + num.toString();
            layer_value.value="0" + num.toString();
            val.push(layer_value);
          } else {
             layer_value.label= num.toString();
             layer_value.value= num.toString();
             val.push(layer_value);
          }
        }
      }
      return val;
    },
    LNSlots(state) {
      let val = [];
      if (!state.houseInfo) {
        return val;
      }
      let houseFound = state.houseInfo.find(h => {
        return h.name === this.houseName;
      });
      if (houseFound) {
        for (let i = 0; i < houseFound.layerSize; i++) {
          let num = i + 1;
          let room_value={
              label:'',
              value:''
          }
          room_value.label= num.toString();
          room_value.value= num.toString();
          val.push(room_value);
        }
      }
      return val;
    }
  }),
  mounted(){
      this.ready();
  },
  data() {
    return {
      yearoptions: [],
      monthoptions: [],
      houseName: "",
      houseSelected: null,
      HNPickerVis: false,
      layerNum: "",
      roomNum: "",
      curYear: null,
      curMon: null,
      
    };
  },
  methods: {
    ready(){
      this.yearoptions = [
        {
          value: '2019',
          label: '2019'
        },
        {
          value: '2018',
          label: '2018'
        },
        {
          value: '2017',
          label: '2017'
        },
        {
          value: '2016',
          label: '2016'
        },
        {
          value: '2015',
          label: '2015'
        },
        {
          value: '2014',
          label: '2014'
        },
        {
          value: '2013',
          label: '2013'
        },
        {
          value: '2012',
          label: '2012'
        },
        {
          value: '2011',
          label: '2011'
        },
        {
          value: '2010',
          label: '2010'
        },


      ],
        this.monthoptions = [
          {
            value: '01',
            label: '1月'
          },
          {
            value: '02',
            label: '2月'
          },
          {
            value: '03',
            label: '3月'
          },
          {
            value: '04',
            label: '4月'
          },
          {
            value: '05',
            label: '5月'
          },
          {
            value: '06',
            label: '6月'
          },
          {
            value: '07',
            label: '7月'
          },
          {
            value: '08',
            label: '8月'
          },
          {
            value: '09',
            label: '9月'
          },
          {
            value: '10',
            label: '10月'
          },
          {
            value: '11',
            label: '11月'
          },
          {
            value: '12',
            label: '12月'
          },
        ]
    },
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

<style scoped>
   .el-button{
       width:100%
   }
   .el-form-item{width:48%;}
</style>