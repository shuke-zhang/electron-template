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
    <icon-font name="keyboard-del" size="43" color="#ffd458" />
    <icon-font name="bill-sheng-yi" size="43" color="#00ff37" />

    <div class="grid grid-cols-2 gap-2 my-4">
      <div class="p-2 rounded text-primary bg-primaryContainer flex-center">
        primary
      </div>
      <div class="p-2 rounded text-error bg-onErrorContainer">
        error
      </div>
      <div class="p-2 rounded text-onPrimaryContainer bg-primaryContainer">
        primaryContainer
      </div>
      <div class="p-2 rounded text-onSecondary bg-secondary">
        secondary
      </div>
      <div class="p-2 rounded text-onSecondaryContainer bg-secondaryContainer">
        secondaryContainer
      </div>
      <div class="p-2 rounded text-onTertiary bg-tertiary">
        tertiary
      </div>
      <div class="p-2 rounded text-onTertiaryContainer bg-tertiaryContainer">
        tertiaryContainer
      </div>
      <div class="p-2 rounded text-error bg-onerror">
        error
      </div>
      <div class="p-2 rounded text-onErrorContainer bg-errorContainer">
        errorContainer
      </div>
      <div class="p-2 rounded text-onBackground bg-background">
        background
      </div>
      <div class="p-2 rounded text-onSurface bg-surface">
        surface
      </div>
      <div class="p-2 rounded text-onSurfaceVariant bg-surfaceVariant">
        surfaceVariant
      </div>
      <div class="p-2 rounded text-inverseOnSurface bg-inverseSurface">
        inverseSurface
      </div>
      <div class="p-2 rounded text-inversePrimary bg-inversePrimary">
        inversePrimary
      </div>
      <div class="p-2 rounded text-onPrimaryFixed bg-primaryFixed">
        primaryFixed
      </div>
      <div class="p-2 rounded text-onPrimaryFixedVariant bg-primaryFixedDim">
        primaryFixedDim
      </div>
      <div class="p-2 rounded text-onSecondaryFixed bg-secondaryFixed">
        secondaryFixed
      </div>
      <div class="p-2 rounded text-onSecondaryFixedVariant bg-secondaryFixedDim">
        secondaryFixedDim
      </div>
      <div class="p-2 rounded text-onTertiaryFixed bg-tertiaryFixed">
        tertiaryFixed
      </div>
      <div class="p-2 rounded text-onTertiaryFixedVariant bg-tertiaryFixedDim">
        tertiaryFixedDim
      </div>
      <div class="p-2 rounded text-onSurfaceVariant bg-surfaceDim">
        surfaceDim
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceBright">
        surfaceBright
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainerLowest">
        surfaceContainerLowest
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainerLow">
        surfaceContainerLow
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainer">
        surfaceContainer
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainerHigh">
        surfaceContainerHigh
      </div>
      <div class="p-2 rounded text-onSurface bg-surfaceContainerHighest">
        surfaceContainerHighest
      </div>
    </div>
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

        <el-button class="block w-full" type="primary" style="margin-top: 10px;" :loading="loading" @click="handleSubmit">
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
