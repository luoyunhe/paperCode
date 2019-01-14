<template lang="html">
  <div class="query">
    <mt-button size="large" style="margin-top: 20px; background-color: pink;" @click="showAddHIVis">
    添加房屋信息
    </mt-button>
    <mt-button
    type="danger"
    size="large"
    @click="logout"
    style="margin-top: 50px"
    >退出登录</mt-button>
    <mt-popup
    class="hi-popup"
    v-model="addHIVis">
    <div style="position: relative; width: 100%; height: 100%;">
        <div style="margin-top: 20px; font-size: 20px;">请填写房屋信息</div>
        <mt-field label="房屋名：" v-model="houseName"> </mt-field>
        <mt-field label="层数：" v-model="layerSize"> </mt-field>
        <mt-field label="房间数：" v-model="roomSize"> </mt-field>
        <div class="btns">
            <mt-button
            type="danger"
            @click="cancel"
            class="btn btn-l"
            >取消
            </mt-button>
            <mt-button
            type="primary"
            @click="addHouseInfo"
            class="btn btn-r"
            >保存
            </mt-button>
        </div>
    </div>
    </mt-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addHIVis: false,
      houseName: "",
      layerSize: "",
      roomSize: ""
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("token_exp");
      this.$router.push("/login");
    },
    showAddHIVis() {
      this.addHIVis = true;
    },
    cancel() {
      this.addHIVis = false;
    },
    addHouseInfo() {
      let houseName = this.houseName;
      111;
      let layerSize = parseInt(this.layerSize);
      let roomSize = parseInt(this.roomSize);
      if (this.houseName === "" || isNaN(layerSize) || isNaN(roomSize)) {
        this.$toast({
          message: "都不能为空喔",
          duration: 2000
        });
        return;
      }
      this.$axios
        .post("/api/add-house", {
          houseName,
          layerSize,
          roomSize
        })
        .then(res => {
          if (res.code === "000001") {
            this.$toast({
              message: "添加成功",
              duration: 2000
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.addHIVis = false;
    }
  }
};
</script>

<style scoped>
.hi-popup {
  height: 100%;
  width: 100%;
}
.hi-popup .btns {
  position: absolute;
  width: 100%;
  bottom: 50px;
}
.btn {
  width: 120px;
  margin-top: 0%;
}
.btn-l {
  margin-right: 60px;
}
</style>