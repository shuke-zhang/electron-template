<script setup lang="ts">
import type { FormInstance } from 'element-plus';

const router = useRouter();
const appStore = useAppStore();
const appConfig = ref<AppConfig>({} as AppConfig);
const formRef = ref<FormInstance>();
const loading = ref(false);
const { sys_production_line } = useDicts(['sys_production_line']);

async function init() {
  appConfig.value = { ...(appStore.appConfig || {}) } as AppConfig;
}

function handleSubmit() {
  formRef.value?.
    validate().
    then(() => {
      loading.value = true;
      // 皮重 = 钩子重量 + 链条重量(默认两根) + 滑轮重量
      const data = {
        ...appConfig.value,
        lw: (appConfig.value.chainWeight! * 2) + appConfig.value.hookWeight! + appConfig.value.pulleyWeight!,
      };
      return appStore.setAppConfig(data);
    }).then(() => {
      return messageSuccess('保存成功');
    }).then(() => {
      router.back();
    }).finally(() => {
      loading.value = false;
    });
}
init();
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
        <!-- <el-form-item
          label="皮重(kg)" prop="lw"
          :rules="[
            {
              required: true,
              message: '皮重不能为空',
            },
          ]"
        >
          <el-input-number
            v-model="appConfig.lw"
            style="width: 100%;"
            :min="0"
            controls-position="right"
            :step=".1"
            placeholder="请输入"
          ></el-input-number>
        </el-form-item> -->

        <el-form-item
          label="滑轮重量(Kg)" prop="pulleyWeight"
          :rules="[
            {
              required: true,
              message: '滑轮重量不能为空',
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
          ></el-input-number>
        </el-form-item>

        <el-form-item
          label="钩子重量(Kg)" prop="hookWeight"
          :rules="[
            {
              required: true,
              message: '钩子重量不能为空',
            },
          ]"
        >
          <el-input-number
            v-model="appConfig.hookWeight"
            style="width: 100%;"
            :min="0"
            controls-position="right"
            :step=".1"
            :precision="1"
            placeholder="请输入"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          label="链条重量(Kg)" prop="chainWeight"
          :rules="[
            {
              required: true,
              message: '链条重量不能为空',
            },
          ]"
        >
          <el-input-number
            v-model="appConfig.chainWeight"
            style="width: 100%;"
            :min="0"
            controls-position="right"
            :step=".1"
            :precision="1"
            placeholder="请输入"
          ></el-input-number>
        </el-form-item>

        <el-form-item
          label="生产线"
          prop="productionLine"
          :rules="[
            {
              required: true,
              message: '生产线不能为空',
            },
          ]"
        >
          <el-select v-model="appConfig.productionLine">
            <el-option
              v-for="item in sys_production_line"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
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
.form{
  max-width: 400px;
  margin: 100px auto 0;
}

:deep(.el-input-number)  .el-input__inner{
  text-align: left !important;
}
</style>
