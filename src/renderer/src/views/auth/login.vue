<script setup lang="ts">
import type { FormInstance } from 'element-plus';

const router = useRouter();

const form = ref({
  username: __DEV__ ? 'admin' : '',
  password: __DEV__ ? 'admin123' : '',
});
const _APP_TITLE = APP_TITLE;
const userStore = useUserStore();
const loading = ref(false);
const formRef = ref<FormInstance>();
function handleLogin() {
  formRef.value?.validate().then(() => {
    loading.value = true;
    userStore
      .login(form.value.username, form.value.password)
      .then(() => {
        router.replace('/');
      })
      .finally(() => {
        loading.value = false;
      });
  });
}
</script>

<template>
  <div class="h-full flex justify-center items-center flex-direction-column login-page">
    <el-card :body-style="{ padding: '40px' }">
      <h2>{{ _APP_TITLE }}</h2>
      <div class="login ">
        <el-form ref="formRef" :model="form">
          <el-form-item prop="username" :rules="[{ required: true, message: '用户名不能为空' }]">
            <el-input
              v-model="form.username"
              type="text"
              placeholder="用户名"
              @keydown.enter="handleLogin"
            >
              <template #prefix>
                <i-ep-user />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              show-password
              @keydown.enter="handleLogin"
            >
              <template #prefix>
                <i-ep-lock />
              </template>
            </el-input>
          </el-form-item>

          <el-button :loading="loading" type="primary" style="display: block;width: 100%" @click="handleLogin">
            {{ !loading ? '登录' : '登录中...' }}
          </el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
h2{
  margin: 0;
}

.login {
  // width: 300px;
  padding: 20px 0;
  border: 1rpx solid red;
}

.login-page{
  background-image: url("../../assets/images/login-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
