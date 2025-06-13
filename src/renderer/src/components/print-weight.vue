<script setup lang="ts">
import type { OrderWeightModel } from '@renderer/model/order-weight';

const props = defineProps({
  order: {
    type: Object as PropType<OrderWeightModel>,
  },
});

const model = defineModel({
  type: Boolean,
});

const orderInfo = computed(() => props.order);

watch(() => orderInfo.value, () => {
  console.log(orderInfo.value, 'orderInfo');
});
</script>

<template>
  <print-dialog
    v-model="model"
  >
    <div
      id="print-content"
      class="flex-center"
    >
      <div
        v-if="orderInfo"
        class="print"
      >
        <div class="title">
          中禄农副产品有限公司
        </div>
        <div class="sub-title">
          白条过磅单
        </div>

        <div style="display: flex;justify-content: space-between;margin: 0.2em auto;">
          <span>磅单编号：{{ orderInfo.order?.orderNo }}</span>
          <span>过磅员：{{ orderInfo.createBy }}</span>
        </div>
        <table
          border="0"
          cellSpacing="0"
          cellPadding="0"
          width="100%"
          bordercolor="#000000"
          style="border-collapse: collapse"
        >
          <tbody>
            <tr>
              <td>
                编号
              </td>
              <td>{{ `${orderInfo.orderInfo?.pigstyNo}-${orderInfo.orderInfo?.pigNo}` }}</td>
              <td>
                <span class="pigsty">{{ orderInfo.pigstyNo }}</span>
                号圈
              </td>
            </tr>

            <tr>
              <td>过磅时间</td>
              <td colspan="2">
                {{ orderInfo.createTime }}
              </td>
            </tr>
            <tr>
              <td>皮处理</td>
              <td colspan="2">
                {{ orderInfo.type }}
              </td>
            </tr>
            <tr>
              <td>毛重</td>
              <td colspan="2">
                {{ `${orderInfo.gw}Kg` }}
              </td>
            </tr>
            <tr>
              <td>皮重</td>
              <td colspan="2">
                {{ `${orderInfo.lw}Kg` }}
              </td>
            </tr>

            <tr>
              <td>净重</td>
              <td colspan="2">
                {{ `${orderInfo.nw}Kg` }}
              </td>
            </tr>

            <tr>
              <td>磅房名称</td>
              <td colspan="2">
                {{ orderInfo.productionLine }}号车间
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </print-dialog>
</template>

<style scoped lang="scss">

</style>

