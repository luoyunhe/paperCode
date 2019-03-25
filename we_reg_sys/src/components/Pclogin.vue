<template lang="html" style="background:red;">
  <div class="login">
    <el-form ref="form" label-width="80px" style="margin-top:10%;">
       <el-form-item label="用户名" style="width: 40%;margin: 0 auto 30px;">
           <el-input v-model="userName" placeholder="请输入用户名"></el-input>
       </el-form-item>
       <el-form-item label="密码" style="width: 40%;margin: 0 auto 30px;">
           <el-input v-model="password" placeholder="请输入密码"></el-input>
       </el-form-item>
    </el-form>
    <el-button type="primary" @click="login" style="width:40%;">登录</el-button>
    <router-link class="tip" to="/pcregister" style="text-decoration: none">现在去注册</router-link>
  </div>
</template>

<script>
export default {
    data() {
        return {
            userName: "lyh",
            password: "lyh",
            toggle: true //!this.$store.state.login.token
        };
    },
    methods: {
        login() {
            if (this.userName === "" || this.password === "") {
                this.$toast({
                    message: "用户名和密码不能为空！",
                    duration: 2000
                });
                return;
            }
            this.$axios
                .post("/api/login", {
                    name: this.userName,
                    password: this.password
                })
                .then(res => {
                    if (res.code === "000001") {
                        localStorage.setItem("token", res.data);
                        localStorage.setItem("token_exp", new Date().getTime());
                        this.$router.push("/pchome/pcrecord");
                    } else {
                        this.$toast({
                            message: `error:  ${res.msg}`,
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
html{width:100%;height:1000px;background:red;}
.login .tip {
    display: block;
    padding: 25px;
    color: rgb(224, 145, 71);
    letter-spacing: 2px;
    font-size: 16px;
}
.el-button{
    width:100%
}
</style>