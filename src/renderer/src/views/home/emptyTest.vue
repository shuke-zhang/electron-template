<script setup lang="ts">
import type { OrderWeightAdd } from '@renderer/model/order-weight';
import type { FormInstance, InputNumberInstance } from 'element-plus';

import { addOrderWeight } from '@renderer/api/order-weight';
import { Calculator } from '@renderer/utils/helpers/Calculator';

const props = defineProps({
  emptyTestForm: {
    type: Object as PropType<OrderWeightAdd>,
    required: true,
  },
  visible: {
    type: Boolean,
  },
});

const emit = defineEmits(['update:visible', 'success', 'close']);

const visible = useVModel(props, 'visible', emit);
const formRef = ref<FormInstance>();
const gwRef = ref<InputNumberInstance>();
const form = ref({
  lw: 0,
  hookWeight: 0,
  chainWeight: 0,
  pulleyWeight: 0,
  gw: 0,
});
const loading = ref(false);
const emptyTestForm = computed(() => props.emptyTestForm);
const validateGw = (rule: any, value: any, callback: any) => {
  console.log(rule);
  if (value <= emptyTestForm.value!.lw!) {
    callback(new Error('毛重不能小于等于皮重'));
  }
  else {
    callback();
  }
};
const rules = reactive({

  gw: [{ required: true, validator: validateGw, trigger: 'change' }],
});

const getLw = computed(() => {
  // 滑轮重量
  const { pulleyWeight, chainNum, chainWeight, hookNum, hookWeight } = emptyTestForm.value;
  return pulleyWeight! + (chainNum! * chainWeight!) + (hookNum! * hookWeight!);
});

function submit() {
  console.log('结算1');
  if (!formRef.value) return;
  console.log('结算2');

  formRef.value.validate().then(() => {
    const nwWeight = Number(new Calculator(form.value.gw).subtract(emptyTestForm.value?.lw || 0).getResult() || 0);
    const nw = (nwWeight) <= 0 ? 0 : (nwWeight);
    const data = {
      ...emptyTestForm.value,
      gw: form.value.gw,
      lw: getLw.value,
      nw,

    };

    console.log(data);

    addOrderWeight(data as OrderWeightAdd).then(() => {
      emit('update:visible', false);
      emit('success');
      form.value = {
        lw: 0,
        hookWeight: 0,
        chainWeight: 0,
        pulleyWeight: 0,
        gw: 0,
      };
    });
  });
}

function cancel() {
  form.value = {
    lw: 0,
    hookWeight: 0,
    chainWeight: 0,
    pulleyWeight: 0,
    gw: 0,
  };
  emit('update:visible', false);
  emit('close');
}

watch(() => visible.value, () => {
  if (visible.value) {
    setTimeout(() => {
      if (gwRef.value) {
        gwRef.value?.focus();
      }
    }, 100);
  }
});

onMounted(() => {
});
</script>

<template>
  <el-dialog
    v-model="visible"
    title="保存称重"
    width="500"
    align-center
    append-to-body
    :close-on-click-modal="false"
    @close="cancel"
  >
    <el-form
      ref="formRef"
      label-position="right"
      label-width="auto"
      :model="form"
      :rules="rules"
      style="max-width: 600px"
      @submit.prevent
    >
      <el-form-item label="毛重(Kg)" prop="gw">
        <el-input-number
          ref="gwRef"
          v-model="form.gw"
          style="width: 100%;"
          focus
          :min="0"
          controls-position="right"
          :step=".1"
          placeholder="请输入"
          @keyup.enter.prevent="submit"
        ></el-input-number>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="submit"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
