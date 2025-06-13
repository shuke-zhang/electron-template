<script setup lang="ts">
import type { OrderWeightModel } from '@renderer/model/order-weight';
import type { SlaughterConfigModel } from '@renderer/model/slaughter-config';
import type { DateModelType, FormInstance } from 'element-plus';

import { format } from '@/utils/helpers/format';
import { listOrderWeight } from '@renderer/api/order-weight';
import { listSlaughterConfig } from '@renderer/api/slaughter-config';
import dayjs from 'dayjs';
import { ElTable } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: Object,
  },
});

const emit = defineEmits<{
  'update:modelValue': [OrderWeightModel];
}>();

const appStore = useAppStore();

const tattooPicker = useVModel(props, 'modelValue', emit);

/**
 * 表格ref
 */
const singleTableRef = ref<InstanceType<typeof ElTable>>();
const list = ref<OrderWeightModel[]>([]);
const slaughterConfigList = ref<SlaughterConfigModel[]>([]);
const loading = ref(false);
const queryRef = ref<FormInstance>();
const queryParams = ref<ListParamsWrapper<OrderWeightModel>>({
  pageNum: 1,
  pageSize: 10,
  searchValue: '',
  typeId: undefined,
  __range: [...getDate()],
});
const total = ref(0);

/**
 * 选择
 */
function handleClick(row: OrderWeightModel) {
  singleTableRef.value!.setCurrentRow(row);
  tattooPicker.value = row;
}

/**
 * 刺青列表
 */
function getList() {
  if (loading.value) return;
  loading.value = true;
  const [
    startDate = '',
    endDate = '',
  ] = queryParams.value.__range || [];

  const [pigstyNo = '', pigNo = ''] = queryParams.value.no?.split('-') || [];
  const _pigstyNo = Number(pigstyNo);
  const _pigNo = Number(pigNo);
  listOrderWeight({
    ...queryParams.value,
    __range: undefined,
    startDate: `${startDate} 08:00:00`,
    endDate: `${endDate} 07:59:59`,
    pigstyNo: isNaN(_pigstyNo) || _pigstyNo == 0 ? undefined : _pigstyNo,
    pigNo: isNaN(_pigNo) || _pigNo == 0 ? undefined : _pigNo,
    productionLine: appStore.appConfig?.productionLine,
  })
    .then((res) => {
      list.value = res.rows.map((e) => {
        return {
          ...e,
          no: `${e.pigstyNo}-${e.pigNo}`,
        };
      });
      total.value = res.total;
    }).finally(() => {
      loading.value = false;
    });
}

/**
 * 获取宰猪模式列表
 */
function getSlaughterConfigList() {
  listSlaughterConfig({
    pageNum: 1,
    pageSize: 9999,
  }).then((res) => {
    slaughterConfigList.value = res.rows;
  });
}
function getDate() {
  const isBefore8am = dayjs().isBefore(dayjs(`${now()} 08:00`));
  const startDate = isBefore8am ? dayjs().startOf('day').subtract(1, 'day') : dayjs().startOf('day');
  const endDate = startDate.add(1, 'day');

  return [
    startDate.format('YYYY-MM-DD'),
    endDate.format('YYYY-MM-DD'),
  ] as [DateModelType, DateModelType];
}
function now() {
  return dayjs().format('YYYY-MM-DD');
}

watch(() => appStore.appConfig, () => {
  if (appStore.appConfig?.type) {
    getList();
  }
}, {
  immediate: true,
});

onMounted(() => {
  getList();
});

getSlaughterConfigList();
</script>

<template>
  <el-form ref="queryRef" inline :model="queryParams">
    <el-form-item prop="searchValue">
      <el-input
        v-model="queryParams.searchValue"
        style="width: 200px;"
        placeholder="待宰商户/买家"
        clearable
        @keyup.enter="getList"
        @clear="getList"
      ></el-input>
    </el-form-item>
    <el-form-item prop="no">
      <el-input
        v-model="queryParams.no"
        style="width: 200px;"
        placeholder="请输入刺青号"
        clearable
        @keyup.enter="getList"
        @clear="getList"
      ></el-input>
    </el-form-item>

    <el-form-item prop="typeId">
      <el-select
        v-model="queryParams.typeId"
        style="width: 200px;"
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

    <el-form-item>
      <el-button type="primary" @click="getList()">
        <template #icon>
          <i-ep-search></i-ep-search>
        </template>
        搜索
      </el-button>
      <el-button @click="queryRef?.resetFields(), getList()">
        <template #icon>
          <i-ep-refresh></i-ep-refresh>
        </template>
        重置
      </el-button>
    </el-form-item>
  </el-form>

  <ElTable ref="singleTableRef" highlight-current-row border :data="list" style="width: 100%;height: 40vh">
    <el-table-column prop="no" label="刺青号" align="center" width="90">
      <template #default="{ row }">
        {{ row.no }}
      </template>
    </el-table-column>

    <el-table-column prop="gw" label="毛重" align="center" width="80" />
    <el-table-column prop="nw" label="净重" align="center" width="80" />
    <el-table-column prop="createTime" label="过磅时间" align="center" width="170" />
    <el-table-column align="center" label="状态" width="95">
      <template #default="{ row }">
        <el-tag :type="`${row.status}` === '0' ? 'success' : `${row.status}` === '1' ? 'warning' : 'danger' ">
          {{ `${row.status}` === '0' ? '合格' : `${row.status}` === '1' ? '无公害处理' : '急宰' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="lw" label="皮重" align="center" width="80" />

    <el-table-column label="订单号" align="center" width="180">
      <template #default="{ row }">
        {{ row.order?.orderNo }}
      </template>
    </el-table-column>

    <el-table-column label="待宰商户" align="center" min-width="180" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.orderSeller.type === '0' ? row.orderSeller.companyName : row.orderSeller.name }}
      </template>
    </el-table-column>
    <el-table-column prop="orderBuyer.leaderName" label="买家" align="center" min-width="180" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.orderBuyer.type === '0' ? row.orderBuyer.companyName : row.orderBuyer.name }}
      </template>
    </el-table-column>

    <el-table-column prop="gw" label="宰猪模式" align="center" min-width="120" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.orderInfo ? format(slaughterConfigList, row.typeId, { labelField: 'name', valueField: 'id' }) : '-' }}
      </template>
    </el-table-column>

    <el-table-column prop="createBy" label="过磅员" align="center" min-width="120" show-overflow-tooltip />

    <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip>
      <template #default="{ row }">
        {{ row.remark ? row.remark : '-' }}
      </template>
    </el-table-column>

    <el-table-column align="center" label="操作" width="120" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" plain style="display: block;margin: 0 auto;" @click="handleClick(row)">
          选择
        </el-button>
      </template>
    </el-table-column>
  </ElTable>

  <pagination
    v-model:page="queryParams.pageNum"
    v-model:limit="queryParams.pageSize"
    :total="total"
    layout="total,  prev, pager, next"
    class="pagination"
    @pagination="getList()"
  />
</template>

<style scoped lang="scss">
.pagination{
  display: flex;
  justify-content: end;
  margin-top: 20px;
}

:deep( .row-name){
  --el-table-tr-bg-color: #ecf5ff;
}
</style>
