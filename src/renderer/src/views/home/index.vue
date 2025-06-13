<script setup lang="ts">
import type { FormInstance } from 'element-plus';

const router = useRouter();
const appConfig = ref<AppConfig>({} as AppConfig);
const formRef = ref<FormInstance>();
const loading = ref(false);
function handleSubmit() {
  formRef.value
    ?.validate()
    .then(() => {
      loading.value = true;
      console.log('发送请求');
    })
    .then(() => {
      return messageSuccess('保存成功');
    })
    .then(() => {
      router.back();
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>

<template>
  <el-card class="h-full border-box">
    <Breadcrumb :item-list="['系统设置']" />

    <div class="form">
      <el-form
        ref="formRef"
        label-width="6em"
        label-position="top"
        :model="appConfig"
      >
        <el-form-item
          label="测试" prop="pulleyWeight"
          :rules="[
            {
              required: true,
              message: '不能为空',
            },
          ]"
        >
          <el-input-number
            v-model="appConfig.pulleyWeight"
            style="width: 100%;"
            :min="0"
            controls-position="right"
            :step=".1"
            :precision="1"
            placeholder="请输入"
          />
        </el-form-item>

        <el-button class="w-full block" type="primary" style="margin-top: 10px;" :loading="loading" @click="handleSubmit">
          <template #icon>
            <i-ep-check />
          </template>
          保存
        </el-button>
      </el-form>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.form {
  max-width: 400px;
  margin: 100px auto 0;
}

:deep(.el-input-number) .el-input__inner {
  text-align: left !important;
}
</style>
