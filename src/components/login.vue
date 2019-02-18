<template>
<div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button @click.prevent="handleLogin()" class="login-button" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const res = await this.$http.post(`login`, this.formdata)
      const {data: {data, meta: {status, msg}}} = res
      if (status === 200) {
        // 账号密码正确 登录成功 跳转
        //   保存token
        this.$message.success(msg)
        localStorage.setItem('token', data.token)
        this.$router.push({
          name: 'home'
        })
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>
.login-wrap{
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-form{
    width: 400px;
    background-color: #fff;
    padding: 30px;
}
.login-button{
    width: 100%;
}

</style>
