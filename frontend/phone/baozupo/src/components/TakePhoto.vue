<template>
  <div class="baozupo">
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
    <photo-selector></photo-selector>

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
import MintUI from "mint-ui";
import "mint-ui/lib/style.css";
import PhotoSelector from "@/components/PhotoSelector";
Vue.use(MintUI);
export default {
  name: "TakePhoto",
  components: {
    "photo-selector": PhotoSelector
  },
  data() {
    return {
      houseName: "真如苑",
      HNPickerVis: false,
      roomNum: 101,
      RNPickerVis: false,
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
    onHNChange(picker, values) {
      this.houseName = values[0];
    },
    onRNChange(picker, values) {
      this.roomNum = values[0] + values[1];
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
