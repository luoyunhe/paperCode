<template lang="html">
  <div class="">
    <mt-header :title="selected" class="header">
    </mt-header>
    <router-view></router-view>
    <mt-tabbar v-model="selected">
        <mt-tab-item id="record">
            <img slot="icon" src="../assets/record.png">
            录入
        </mt-tab-item>
        <mt-tab-item id="query">
            <img slot="icon" src="../assets/query.png">
            查询
        </mt-tab-item>
        <mt-tab-item id="setting">
            <img slot="icon" src="../assets/setting.png">
            设置
        </mt-tab-item>
    </mt-tabbar>   
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected: "record"
    };
  },
  watch: {
    selected(curVal, oldVal) {
      this.$router.push(curVal);
    }
  },
  methods: {}
};
</script>

<style scoped>
.header {
  background-color: pink;
  font-size: 24px;
  line-height: 26px;
  color: #555;
}
.mint-tabbar > .mint-tab-item.is-selected {
  color: black;
  background-color: pink;
}
</style>