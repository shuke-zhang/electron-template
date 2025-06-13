<script setup lang="ts">
import type { OrderWeightModel } from '@renderer/model/order-weight';
import type { SlaughterConfigModel } from '@renderer/model/slaughter-config';
import type { FormInstance } from 'element-plus';

import { updateOrderWeight } from '@renderer/api/order-weight';
import { speak } from '@renderer/utils/helpers/speak';

const props = defineProps({
  visible: {
    type: Boolean,
  },
  currentRow: {
    type: Object as PropType<OrderWeightModel>,
  },
  slaughterConfigList: {
    type: Array as PropType<SlaughterConfigModel[]>,
  },
});

const emit = defineEmits(['update:visible', 'success', 'close']);

const visible = useVModel(props, 'visible', emit);
const { sys_production_line } = useDicts(['sys_production_line']);

const orderLoading = ref(false);
const pigNoRegex = /^\d+-\d+$/;
const orderFormRef = ref<FormInstance>();

const orderForm = ref<OrderWeightModel>({
  isPollution: '0',
  no: undefined,
  gw: undefined,
  lw: undefined,
  nw: undefined,
  remark: undefined,
});

const validatePass = (rule: any, value: any, callback: any) => {
  console.log(rule);

  if (value === '') {
    callback(new Error('刺青号不能为空'));
  }
  else if (!pigNoRegex.test(value)) {
    callback(new Error('请输入正确的刺青编号格式，比如“1001-1”'));
  }
  else {
    callback();
  }
};

const validateGw = (rule: any, value: any, callback: any) => {
  console.log(rule);
  if (value < orderForm.value.lw!) {
    callback(new Error('毛重不能小于皮重'));
  }
  else {
    callback();
  }
};

const validateLw = (rule: any, value: any, callback: any) => {
  console.log(rule);
  if (value > orderForm.value.gw!) {
    callback(new Error('皮重不能大于毛重'));
  }
  else {
    callback();
  }
};

const orderRules = reactive({
  isPollution: [{ required: true, message: '请选择是否无公害处理', trigger: 'blur' }],
  no: [{ required: true, validator: validatePass, trigger: 'blur' }],
  typeId: [{ required: true, message: '请选择宰猪模式', trigger: 'blur' }],
  productionLine: [{ required: true, message: '请选择生产线', trigger: 'blur' }],
  gw: [
    { required: true, validator: validateGw, trigger: 'blur' },
  ],
  lw: [
    { required: true, validator: validateLw, trigger: 'blur' },
  ],

});

async function orderSubmit() {
  if (!orderFormRef.value) return;
  await orderFormRef.value.validate((valid) => {
    if (valid) {
      const data = {
        id: orderForm.value.id,
        no: orderForm.value.no,
        typeId: orderForm.value.typeId,
        status: orderForm.value.isPollution === '1' ? 1 : 0,
        remark: orderForm.value.remark,
        gw: orderForm.value.gw,
        lw: orderForm.value.lw,
        nw: orderForm.value.nw,
        productionLine: orderForm.value.productionLine,

      };
      updateOrderWeight(data).then(() => {
        messageSuccess('编辑成功');
        speak({ text: '编辑成功' });
        orderFormRef.value?.resetFields();
        cancel();
        emit('success');
      }).finally(() => {
        orderLoading.value = false;
      });
    }
  });
}

function cancel() {
  emit('update:visible', false);
  emit('close');
}

watch(() => visible.value, () => {
  if (visible.value) {
    orderForm.value.no = props.currentRow?.no;
    orderForm.value.gw = props.currentRow?.gw;
    orderForm.value.lw = props.currentRow?.lw;
    orderForm.value.nw = props.currentRow?.nw;
    orderForm.value.remark = props.currentRow?.remark;
    orderForm.value.isPollution = props.currentRow?.status;
    orderForm.value.productionLine = props.currentRow?.productionLine;
    orderForm.value.typeId = props.currentRow?.typeId;
    orderForm.value.id = props.currentRow?.id;
  }
});
</script>

<template>
  <el-dialog
    v-model="visible"
    title="修改"
    width="500"
    align-center
    append-to-body
    :close-on-click-modal="false"
  >
    <el-form
      ref="orderFormRef"
      label-position="right"
      label-width="auto"
      :model="orderForm"
      :rules="orderRules"
      style="max-width: 600px"
    >
      <el-form-item label="状态" prop="isPollution">
        <el-radio-group v-model="orderForm.isPollution">
          <el-radio label="0">
            合格
          </el-radio>
          <el-radio label="1">
            无公害处理
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="宰猪模式"
        prop="typeId"
      >
        <el-select
          v-model="orderForm.typeId"
          placeholder="请选择宰猪模式"
        >
          <el-option
            v-for="item in slaughterConfigList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="生产线" prop="productionLine">
        <el-select v-model="orderForm.productionLine" disabled>
          <el-option
            v-for="item in sys_production_line"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="刺青号" prop="no">
        <el-input v-model="orderForm.no" />
      </el-form-item>

      <el-form-item label="毛重(Kg)" prop="gw">
        <el-input
          v-model="orderForm.gw"
          controls-position="right"
          :min="0"
          style="width: 100%"
          disabled
          placeholder="请输入毛重"
        />
      </el-form-item>

      <el-form-item label="皮重(Kg)" prop="lw">
        <el-input
          v-model="orderForm.lw"
          controls-position="right"
          :min="0"
          style="width: 100%"
          disabled
          placeholder="请输入皮重"
        />
      </el-form-item>

      <el-form-item label="净重(Kg)" prop="gw">
        <el-input
          v-model="orderForm.nw"
          controls-position="right"
          :min="0"
          style="width: 100%"
          disabled
          placeholder="请输入净重"
        />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="orderForm.remark" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="orderLoading"
          @click="orderSubmit"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">

</style>
