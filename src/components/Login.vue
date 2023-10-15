<template>
  <div class="bg">
    <div class="layui-container">
      <div class="admin-login-background">
        <div class="login-form logo-title">
          <h1 style="margin-top: 16px;margin-bottom: 16px;">图书管理系统</h1>
          <el-form :model="form">
            <el-input v-model="form.username" :prefix-icon="User" placeholder="用户名" class="el-input" />
            <el-input v-model="form.password" type="password" :prefix-icon="Unlock" placeholder="密码" autocomplete="off" class="el-input" />
            <el-select v-model="auth" placeholder="请选择用户类型" style="width:100%;" class="el-input">
              <el-option label="管理员" value="0" />
              <el-option label="读者" value="1" />
            </el-select>
            <div style="width: 100%;height:30px;margin-bottom: 16px;">
              <el-input v-model="form.captcha" placeholder="验证码" class="el-input" style="width: 50%;float:left" />
              <img src="../assets/images/captcha.jpg" height="30" style="float: left;padding-left: 5px;">
            </div>
            <el-button type="primary" style="width: 100%;height:35px;margin-bottom: 16px;" @click="submit">登录</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Unlock, User } from '@element-plus/icons-vue'
import router from '../router/router';
const auth = ref('')
const form = reactive({
  username: '',
  password: '',
  captcha: ''
})
function submit() {
  router.push('/LoginIn')
}
</script>

<style scoped>
.el-input {
  margin-bottom: 16px;
}


.logo-title h1 {
  color: #1E9FFF;
  font-size: 25px;
  font-weight: bold;
}

h1 {
  margin: 0;
  padding: 0;
  padding-bottom: 25px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}


.bg {
  width: 100%;
  height: 100vh;
  background: url("../assets/images/loginbg.png") center no-repeat;
  background-size: cover;
}

.layui-container {
  width: 100%;
  height: 100%;
  overflow: hidden
}

.admin-login-background {
  width: 460px;
  height: 300px;
  position: absolute;
  left: 65%;
  top: 45%;
  margin-top: -120px;
  margin-left: -50px;
  opacity: 0.9;
}

.logo-title {
  text-align: center;
  letter-spacing: 2px;
  padding: 14px 0;
}

.logo-title h1 {
  color: #1E9FFF;
  font-size: 25px;
  font-weight: bold;
}

.login-form {
  background-color: #fff;
  border: 1px solid #fff;
  border-radius: 3px;
  padding: 14px 20px;
  box-shadow: 0 0 8px #eeeeee;
}

.login-form .layui-form-item {
  position: relative;
}

.login-form .layui-form-item label {
  position: absolute;
  left: 1px;
  top: 1px;
  width: 38px;
  line-height: 36px;
  text-align: center;
  color: #d2d2d2;
}

.login-form .layui-form-item input {
  padding-left: 36px;
}

.captcha-img img {
  height: 34px;
  border: 1px solid #e6e6e6;
  height: 36px;
  width: 100%;
}
</style>
