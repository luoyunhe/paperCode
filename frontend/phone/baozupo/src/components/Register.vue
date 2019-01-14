<template lang="html">
  <div class="register">
    <section>
      <mt-field
       label="用户名"
        placeholder="请输入用户名"
        type = "text"
        v-model = "userName"
        ></mt-field>
      <mt-field
       label="密码"
       placeholder="请输入密码"
       type="password"
       v-model="password"
        ></mt-field>
    </section>
    <mt-button
     style="margin-top: 40px"
     type="primary"
     size="large"
     @click="register"
     >注册</mt-button>
    <router-link to="login" style="text-decoration: none">
        <mt-button
        style="margin-top: 40px"
        type="primary"
        size="large"
        >返回登录</mt-button>
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
</style>