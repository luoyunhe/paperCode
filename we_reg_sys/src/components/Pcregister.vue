<template lang="html">
  <div class="register">
    <el-form ref="form" label-width="80px" style="margin-top:10%;">
       <el-form-item label="用户名" style="width: 40%;margin: 0 auto 30px;">
           <el-input v-model="userName" placeholder="请输入用户名"></el-input>
       </el-form-item>
       <el-form-item label="密码" style="width: 40%;margin: 0 auto 30px;">
           <el-input v-model="password" placeholder="请输入密码"></el-input>
       </el-form-item>
    </el-form>
    <el-button type="primary" @click="register" style="width:40%;">注册</el-button></br>
    <router-link to="pclogin" style="text-decoration: none">
        <el-button type="primary" style="margin-top: 40px;width:40%;">返回登录</el-button>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
      password: ""
      //toggle: true //!this.$store.state.login.token
    };
  },
  methods: {
    register() {
      if (this.userName === "" || this.password === "") {
        return this.$toast({
          message: "用户名和密码不能为空",
          duration: 3000
        });
      }
      this.$axios
        .post("/api/register", {
          name: this.userName,
          password: this.password
        })
        .then(res => {
          if (res.code === "000001") {
            this.$toast("注册成功，请登录");
            this.$router.push("/login");
          } else {
            this.$toast(res.msg);
          }
        })
        .catch(err => {
          console.log(`error: ${err}`);
        });
    }
  }
};
</script>

<style scoped>
    .el-button{
      width:100%
   }
</style>