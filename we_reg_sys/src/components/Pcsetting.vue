<template lang="html">
  <div class="query">
    <div class="hi-popup" v-show="addHIVis">
        <div class="relative-popup">
            <div style="line-height: 60px; font-size: 30px;">请填写房屋信息</div>
            <el-form ref="form" label-width="80px" style="margin-top: 30px;">
                 <el-form-item label="房屋名：" style="width: 40%;margin: 0 auto 30px;">
                      <el-input v-model="houseName" placeholder="请输入房屋名"></el-input>
                </el-form-item>
                <el-form-item label="层数:" style="width: 40%;margin: 0 auto 30px;">
                      <el-input v-model="layerSize" placeholder="请输入层数"></el-input>
                </el-form-item>
                <el-form-item label="房间数：" style="width: 40%;margin: 0 auto 30px;">
                      <el-input v-model="roomSize" placeholder="请输入房间数"></el-input>
                </el-form-item>
            </el-form>
            <div class="btns">
                <el-button
                type="danger"
                @click="cancel"
                class="btn btn-l"
                >取消
                </el-button>
                <el-button
                type="primary"
                @click="addHouseInfo"
                class="btn btn-r"
                >保存
                </el-button>
            </div>
        </div>
    </div>
    <div>
    <el-button  type="primary" @click="showAddHIVis" style="margin-top: 50px;width:50%; height: 90px;font-size: 30px;">添加房屋信息
    </el-button>
    <el-button type="danger"  @click="logout" style="margin-top: 50px;width:50%; height: 90px;font-size: 30px;">退出登录</el-button>
    </div>
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
            this.$router.push("/pclogin");
        },
        updateInfo() {
            this.$axios
                .get("/api/get-user-info")
                .then(res => {
                    this.$store.commit("updateInfo", res.data);
                })
                .catch(err => {
                    console.log(err);
                });
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
                        this.updateInfo();
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
    /*height: 100%;*/
    width: 100%;
    overflow: hidden;
    /*top: 0;*/
}

div.relative-popup {
    height: 100%;
    width: 100%;
    position: relative;
}

.hi-popup .btns {
    /*position: absolute;*/
    width: 89%;
    bottom: 60px;
}

.btn {
    width: 120px;
    margin-top: 0%;
}

.btn-l {
    margin-right: 60px;
}
.footer{background:#fff !important;}
</style>