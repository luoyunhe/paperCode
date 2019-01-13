<template lang="html">
  <div class="login">
    <section>
      <mt-field
       label="用户名"
        placeholder="请输入用户名"
        type = "text"
        v-model = "userName"
        :readonly = '!toggle'
        :disableClear = '!toggle'
        ></mt-field>
      <mt-field
       label="密码"
       placeholder="请输入密码"
       type="password"
       v-model="password"
       :readonly='!toggle'
       :disableClear = '!toggle'
        ></mt-field>
        <router-link class="tip" to="/register">现在去注册</router-link>
    </section>
    <mt-button
     plain
     size="large"
     @click="login"
     v-if='toggle'>登录</mt-button>
    <mt-button
     plain
     size="large"
     @click="logout"
     v-else>退出登录</mt-button>

  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "test",
      password: "test",
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
            this.$router.push("/");
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
    },
    //退出登录按钮
    logout() {}
  }
};
</script>

<style scoped>
.login > section .tip {
  display: block;
  padding: 60px;
  color: rgb(224, 145, 71);
  letter-spacing: 2px;
  font-size: 16px;
}
</style>