<template lang="html">
  <div class="query">
    <div class="hi-popup" v-show="addHIVis">
        <div class="relative-popup">
            <div style="line-height: 60px; font-size: 30px;">请填写房屋信息</div>
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
    </div>
    <mt-button size="large" style="margin-top: 20px; background-color: #ddd; border: 1px solid #bbb;" @click="showAddHIVis">
    添加房屋信息
    </mt-button>
    <mt-button
    type="danger"
    size="large"
    @click="logout"
    style="margin-top: 50px;"
    >退出登录</mt-button>
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
              duration: 2500
            });
            this.addHIVis = false;
          } else {
            this.$toast({
              message: res.msg,
              duration: 2000
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
div.hi-popup {
  z-index: 2;
  background-color: white;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
}
div.relative-popup {
  height: 100%;
  width: 100%;
  position: relative;
}
.hi-popup .btns {
  position: absolute;
  width: 100%;
  bottom: 60px;
}
.btn {
  width: 120px;
  margin-top: 0%;
}
.btn-l {
  margin-right: 60px;
}
</style>