<template lang="html">
  <div class="query">
    <div style="line-height: 60px; font-size: 25px;">查询水电使用信息</div>
    <el-form :inline="true" label-width="80px" class="demo-form-inline" style="margin-top:30px;">
          <el-form-item label="选择年份">
            <el-select v-model="curYear" placeholder="请选择年份">
              <el-option v-for="item in yearoptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择月份">
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
           <el-form-item>
          </el-form-item>
    </el-form>
    <el-button type="primary" size="large" @click="queryWEInfo" style="margin-top: 30px;width:57%;">查询</el-button>
    <el-button type="primary" size="large" @click="exportToExcel()" style="margin-top: 30px;width:57%;margin-left:0;">导出表格</el-button>
    <div v-show="isShowTable">
        <template>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="layerNum" label="层数" width="180">
            </el-table-column>
            <el-table-column prop="roomNum" label="房间号" width="180">
            </el-table-column>
            <el-table-column prop="LastwaterDegree" label="上个月用水量">
            </el-table-column>
            <el-table-column prop="waterDegree" label="本月用水量">
            </el-table-column>
            <el-table-column prop="LastelectDegree" label="上个月用电量">
            </el-table-column>
            <el-table-column prop="electDegree" label="本月用电量">
            </el-table-column>
            <!--<el-table-column prop="waterFee" label="本月水费">
            </el-table-column>
            <el-table-column prop="electFee" label="本月电费">
            </el-table-column>-->
          </el-table>
        </template>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      HNSlots(state) {
        let val = [];
        if (!state.houseInfo) {
          return val;
        }
        for (let i = 0; i < state.houseInfo.length; i++) {
          let house_value = {
            label: "",
            value: ""
          };
          house_value.label = state.houseInfo[i].name;
          house_value.value = state.houseInfo[i].name;
          val.push(house_value);
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
      yearoptions: [],
      monthoptions: [],
      flag: false,
      houseSelected: null,
      houseName: "",
      curYear: null,
      curMon: null,
      WEInfo: null,
      WEInfo1: null,
      isShowTable: false,
      tableData: [],
      tableData1: [],
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

  mounted() {
    this.ready();
  },
  methods: {
    ready() {
      (this.yearoptions = [
        {
          value: "2019",
          label: "2019"
        },
        {
          value: "2018",
          label: "2018"
        },
        {
          value: "2017",
          label: "2017"
        },
        {
          value: "2016",
          label: "2016"
        },
        {
          value: "2015",
          label: "2015"
        },
        {
          value: "2014",
          label: "2014"
        },
        {
          value: "2013",
          label: "2013"
        },
        {
          value: "2012",
          label: "2012"
        },
        {
          value: "2011",
          label: "2011"
        },
        {
          value: "2010",
          label: "2010"
        }
      ]),
        (this.monthoptions = [
          {
            value: "01",
            label: "1月"
          },
          {
            value: "02",
            label: "2月"
          },
          {
            value: "03",
            label: "3月"
          },
          {
            value: "04",
            label: "4月"
          },
          {
            value: "05",
            label: "5月"
          },
          {
            value: "06",
            label: "6月"
          },
          {
            value: "07",
            label: "7月"
          },
          {
            value: "08",
            label: "8月"
          },
          {
            value: "09",
            label: "9月"
          },
          {
            value: "10",
            label: "10月"
          },
          {
            value: "11",
            label: "11月"
          },
          {
            value: "12",
            label: "12月"
          }
        ]);
    },
    exportToExcel() {
      require.ensure([], () => {
        const { export_json_to_excel } = require("../excel/Export2Excel");
        // const tHeader = ['层数', '房间号', '本月用水读数', '上月用水读数', '本月用电读数', '上月用电读数'];
        // const filterVal = ['layerNum', 'roomNum', 'waterDegree', 'LastwaterDegree', 'electDegree', 'LastelectDegree'];
        const tHeader = [
          "层数",
          "房间号",
          "本月用水读数",
          "上月用水读数",
          "本月用电读数",
          "上月用电读数",
          "水费",
          "电费"
        ];
        const filterVal = [
          "layerNum",
          "roomNum",
          "waterDegree",
          "LastwaterDegree",
          "electDegree",
          "LastelectDegree",
          "waterFee",
          "electFee"
        ];
        let kk = [];

        for (let k = 0; k < this.tableData.length; k++) {
          let c = {
            layerNum: "",
            roomNum: "",
            waterDegree: "",
            electDegree: "",
            LastwaterDegree: "",
            LastelectDegree: "",
            waterFee: "",
            electFee: ""
          };
          c.layerNum = this.tableData[k].layerNum;
          c.roomNum = this.tableData[k].roomNum;
          c.waterDegree = this.tableData[k].waterDegree;
          c.electDegree = this.tableData[k].electDegree;
          c.LastwaterDegree = this.tableData[k].LastwaterDegree;
          c.LastelectDegree = this.tableData[k].LastelectDegree;
          if (c.waterDegree == "" || c.LastwaterDegree == "") {
            c.waterFee = "";
          } else {
            c.waterFee = (c.waterDegree + c.LastwaterDegree) * 4.5;
          }
          if (c.electDegree == "" || c.LastelectDegree == "") {
            c.waterFee = "";
          } else {
            c.electFee = (c.electDegree + c.LastelectDegree) * 1.5;
          }

          kk.push(c);
        }
        const list = kk;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(
          tHeader,
          data,
          this.curYear + "年" + this.curMon + "月" + "水电费"
        );
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    queryWEInfo() {
      this.onHNChange();
      if (!this.houseSelected) {
        this.$toast({
          message: "未选择",
          duration: 2000
        });
        return;
      }
      var Lyear;
      var LMon;
      Lyear = this.curYear;
      switch (this.curMon) {
        case "01":
          LMon = "12";
          Lyear = this.curYear - 1;
          break;
        case "02":
          LMon = "01";
          break;
        case "03":
          LMon = "02";
          break;
        case "04":
          LMon = "03";
          break;
        case "05":
          LMon = "04";
          break;
        case "06":
          LMon = "05";
          break;
        case "07":
          LMon = "06";
          break;
        case "08":
          LMon = "07";
          break;
        case "09":
          LMon = "08";
          break;
        case "10":
          LMon = "09";
          break;
        case "11":
          LMon = "10";
          break;
        case "12":
          LMon = "11";
          break;
      }
      let self = this;
      this.$axios
        .post("/api/query-we-info", {
          year: this.curYear,
          month: this.curMon,
          houseInfo: this.houseSelected
        })
        .then(res => {
          console.log(res);
          if (res.code === "000001") {
            this.WEInfo = res.data;
            this.tableData = res.data;
            this.isShowTable = true;
            this.tableData = [];
            for (let j = 0; j < this.WEInfo.length; ++j) {
              let tab = {};
              tab.waterDegree = this.WEInfo[j].waterDegree;
              tab.electDegree = this.WEInfo[j].electDegree;
              tab.layerNum = this.WEInfo[j].layerNum;
              tab.roomNum = this.WEInfo[j].roomNum;
              this.tableData.push(tab);
            }
            console.log("haha", this.tableData);
          }
        })
        .catch(err => {
          console.log(err);
        });

      this.$axios
        .post("/api/query-we-info", {
          year: Lyear,
          month: LMon,
          houseInfo: this.houseSelected
        })
        .then(res => {
          console.log(res);
          if (res.code === "000001") {
            this.WEInfo1 = res.data;
            var new1 = this.tableData;
            console.log("tb1", this.WEInfo1);
            console.log("tbll", this.WEInfo1.length);
            let len = new1.length;
            this.tableData1 = [];
            for (let j = 0; j < this.WEInfo1.length; ++j) {
              let tab = {};
              console.log("哈哈");
              tab.waterDegree = this.WEInfo1[j].waterDegree;
              tab.electDegree = this.WEInfo1[j].electDegree;
              tab.layerNum = this.WEInfo1[j].layerNum;
              tab.roomNum = this.WEInfo1[j].roomNum;
              this.tableData1.push(tab);
            }
            console.log("hehe", this.tableData1);
            let len1 = this.tableData1.length;
            let flag_check = false;
            let a = {
              layerNum: "",
              roomNum: "",
              waterDegree: "",
              electDegree: "",
              LastwaterDegree: "",
              LastelectDegree: ""
            };
            let b = {
              layerNum: "",
              roomNum: "",
              waterDegree: "",
              electDegree: "",
              LastwaterDegree: "",
              LastelectDegree: ""
            };

            for (let j = 0; j < len1; j++) {
              flag_check = false;
              for (let i = 0; i < len; i++) {
                a = new1[i];
                b = this.tableData1[j];
                if (a.layerNum == b.layerNum && a.roomNum == b.roomNum) {
                  new1[i].LastwaterDegree = b.waterDegree + 1000;
                  new1[i].LastelectDegree = b.electDegree + 1000;
                  flag_check = true;
                  break;
                }
              }
              if (flag_check == false) {
                let tab = {
                  layerNum: "1",
                  roomNum: "1",
                  waterDegree: "",
                  electDegree: "",
                  LastwaterDegree: "100",
                  LastelectDegree: "200"
                };
                tab.LastwaterDegree = this.tableData1[j].waterDegree;
                tab.LastelectDegree = this.tableData1[j].electDegree;
                tab.layerNum = this.tableData1[j].layerNum;
                tab.roomNum = this.tableData1[j].roomNum;
                new1.push(tab);
              }
            }
            console.log("new1", new1);
            function sortLayer(a, b) {
              return a.layerNum - b.layerNum;
            }
            function sortId(a, b) {
              return a.roomNum - b.roomNum;
            }
            new1.sort(sortLayer);
            new1.sort(sortId);
            console.log("new1", new1);
            this.tableData = new1;
            console.log("哈哈", this.tableData);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onHNChange() {
      if (!this.$store.state.houseInfo) {
        return;
      }
      let houseFound = this.$store.state.houseInfo.find(h => {
        return h.name === this.houseName;
      });
      if (houseFound) {
        this.houseSelected = houseFound;
      }
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
.el-button {
  width: 100%;
}
.el-form-item {
  width: 38%;
}
</style>