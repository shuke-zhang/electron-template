<script setup lang="ts">
import type { SlaughterConfigModel } from '@renderer/model/slaughter-config';
import type { DateModelType, FormInstance } from 'element-plus';
import type { OrderWeightAdd, OrderWeightModel } from '@/model/order-weight';

import {
  Lock,
  Printer,
  Unlock,
} from '@element-plus/icons-vue';
import { addOrderWeight, invalidOrder, listOrderWeight } from '@renderer/api/order-weight';

import { listSlaughterConfig } from '@renderer/api/slaughter-config';
import dayjs from 'dayjs';
import { format } from '@/utils/helpers/format';
import { speak } from '@/utils/helpers/speak';
import EditDialog from './editDialog.vue';
import EmptyTest from './emptyTest.vue';

const serialPortStore = useSerialPortStore();
const { scaleList, activeScale } = storeToRefs(serialPortStore);
const { setActiveScale, openAllSerialport, destroyAllPort, autoOpen } = serialPortStore;
const printVisible = ref(false);

const currentRow = ref();
const appStore = useAppStore();
const formRef = ref<FormInstance>();
const queryRef = ref<FormInstance>();
const list = ref<OrderWeightModel[]>([]);
const total = ref(0);
const isNowTime = ref(false);
const timerId = ref<NodeJS.Timeout>();
const currentType = ref();
const isEdit = ref(false);
/**
 * 保存按钮状态
 */
const formLoading = ref(false);
/**
 * 试运行阶段 保存时弹起弹窗输入毛重的保存
 */
const isEmptyTest = false as const;
const emptyTestVisible = ref(false);
const emptyTestForm = ref({});

const { sys_production_line } = useDicts(['sys_production_line']);
const { currentValue } = storeToRefs(serialPortStore);
const slaughterConfigList = ref<SlaughterConfigModel[]>([]);
// 订单状态
const statusList = [
  { label: '全部', value: 'all' },
  { label: '有效', value: '0,1' },
  { label: '合格', value: '0' },
  { label: '无公害处理', value: '1' },
  { label: '已作废', value: '-1' },
];

const queryParams = ref<ListParamsWrapper<OrderWeightModel>>({
  pageNum: 1,
  pageSize: 9,
  status: statusList[0].value,
  searchValue: '',
  typeId: undefined,
  __range: [...getDate()],
});

const form = ref<OrderWeightAdd>({
  type: '',
  no: '',
  productionLine: '',
  gw: 0,
  lw: 0,
  nw: 0,
  hookNum: 1,
  chainNum: 2,
  remark: '',
  typeId: undefined,
});
/**
 * 宰猪模式
 */
const isDisabled = ref(true);
const slaughterIcon = computed(() => isDisabled.value ? Lock : Unlock);
const loading = ref(false);

// 编辑
const editVisible = ref(false);
const editCurrentRow = ref();

const getLw = computed(() => {
  // 滑轮重量
  const { pulleyWeight, chainNum, chainWeight, hookNum, hookWeight } = form.value;
  return pulleyWeight! + (chainNum! * chainWeight!) + (hookNum! * hookWeight!);
});

function handlePrint(row: OrderWeightModel) {
  printVisible.value = true;
  currentRow.value = row;
}

function getList() {
  if (loading.value)
    return;
  loading.value = true;
  const [
    startDate = '',
    endDate = '',
  ] = [...getDate()] || [];

  const [pigstyNo = '', pigNo = ''] = queryParams.value.no?.split('-') || [];
  const _pigstyNo = Number(pigstyNo);
  const _pigNo = Number(pigNo);
  const _queryParams = {
    ...queryParams.value,
  };
  if (_queryParams.status === statusList[0].value) {
    delete _queryParams.status;
  }
  listOrderWeight({
    ..._queryParams,
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
    })
    .finally(() => {
      loading.value = false;
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
/**
 * 宰猪模式变化
 */
function handleSelectChange() {
  currentType.value = form.value.typeId;
}

/**
 * 定时刷新
 */
function getTimestampDate() {
  timerId.value = setTimeout(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour === 8 && currentMinute === 0) {
      clearTimeout(timerId.value); // 清除定时器
      getTimestampDate();
      return isNowTime.value = true;
    }
    else {
      clearTimeout(timerId.value); // 清除定时器
      getTimestampDate();
      return isNowTime.value = false;
    }
  }, 1000);
}

/**
 * 保存按钮 isEmptyTest-是否需要手动输入毛重
 */
async function handleAdd(status: number) {
  if (formLoading.value)
    return;
  if (isEmptyTest) {
    formRef.value?.validate().then(() => {
      emptyTestForm.value = {
        ...form.value,
        status,
      };
      emptyTestVisible.value = true;
    }).catch(() => {
      formLoading.value = false;
    });
  }
  else {
    formLoading.value = true;
    formRef.value?.validate().then(() => {
      const data = {
        ...form.value,
        status,
        lw: getLw.value,
      };

      return addOrderWeight(data as OrderWeightAdd);
    }).then(() => {
      submitSuccess();
    }).finally(() => {
      formLoading.value = false;
    });
  }
}

function submitSuccess() {
  formRef.value?.resetFields();
  form.value.typeId = currentType.value;
  if (!isEdit.value) {
    messageSuccess('保存成功');
    speak({ text: `${format(slaughterConfigList.value, currentType.value, { labelField: 'name', valueField: 'id' })}保存成功` });
  }

  setDefaultAppConfig();

  getList();
}

/**
 * 设置默认系统配置
 */
function setDefaultAppConfig() {
  form.value.chainNum = 2;
  form.value.hookNum = 1;
  handleLWChange();

  isEdit.value = false;
}

function close() {
  formRef.value?.resetFields();
  form.value.typeId = currentType.value;
  setDefaultAppConfig();
}

function handleEdit(row: OrderWeightModel) {
  isEdit.value = true;
  editCurrentRow.value = row;
  editVisible.value = true;
}

/**
 * 作废
 */
function handleInvalid(row: OrderWeightModel) {
  return confirmWarning('是否确认将当前过磅单作废？')
    .then(() => {
      invalidOrder(row.id!).then(() => {
        messageSuccess('作废成功');
        getList();
      });
    });
}

/**
 * 宰猪模式
 */
function getSlaughterConfigList() {
  listSlaughterConfig({
    pageNum: 1,
    pageSize: 9999,
  }).then((res) => {
    slaughterConfigList.value = res.rows;
    form.value.typeId = res.rows[0]?.id;
    currentType.value = res.rows[0]?.id;
  });
}

/**
 * 是否禁用宰猪模式
 */
function handleLock() {
  isDisabled.value = !isDisabled.value;
}

getSlaughterConfigList();

function handleLWChange() {
  form.value.lw = getLw.value;
  const diff = form.value.gw! - form.value.lw!;
  form.value.nw = (diff) <= 0 ? 0 : (diff);
}

watch(() => isNowTime.value, (val) => {
  if (val) {
    console.log('8点整刷新');
    getList();
  }
});

watch(() => appStore.appConfig, () => {
  if (appStore.appConfig?.lw) {
    form.value.lw = appStore.appConfig?.lw;
  }
  if (appStore.appConfig?.hookWeight) {
    form.value.hookWeight = appStore.appConfig?.hookWeight;
  }
  // 系统配置链条重量

  if (appStore.appConfig?.chainWeight) {
    form.value.chainWeight = appStore.appConfig?.chainWeight;
  }
  // 系统配置滑轮重量
  if (appStore.appConfig?.pulleyWeight) {
    form.value.pulleyWeight = appStore.appConfig?.pulleyWeight;
  }
  if (appStore.appConfig?.productionLine) {
    form.value.productionLine = appStore.appConfig?.productionLine;
  }
  if (appStore.appConfig?.type) {
    form.value.type = appStore.appConfig?.type;
    getList();
  }
  getList();
}, {
  immediate: true,
});

watch([
  () => currentValue.value,
], () => {
  form.value.gw = currentValue.value;
  const diff = currentValue.value - form.value.lw!;
  form.value.nw = (diff) <= 0 ? 0 : (diff);
}, {
  immediate: true,
});

onMounted(() => {
  getTimestampDate();
  if (scaleList.value.length) {
    if (!activeScale.value) {
      setActiveScale(scaleList.value[0].id!);
    }
    if (autoOpen) {
      openAllSerialport();
    }
  }
});

onBeforeUnmount(() => {
  if (autoOpen) {
    destroyAllPort();
  }
  clearTimeout(timerId.value); // 清除定时器
});
</script>

<template>
  <div class="home w-full">
    <electronic-scale />

    <el-card>
      <div class="grid-weight grid grid-cols-3">
        <div class="flex justify-center items-center flex-direction-column item-weight">
          <h3 class="text-primary">
            {{ form.gw?.toFixed(1) }}
          </h3>
          <span class="text-black-2">毛重(kg)</span>
        </div>
        <div class="flex justify-center items-center flex-direction-column item-weight">
          <h3 class="text-primary">
            {{ form.lw?.toFixed(1) }}
          </h3>
          <span class="text-black-2">皮重(kg)</span>
        </div>
        <div class="flex justify-center items-center flex-direction-column item-weight">
          <h3 class="text-primary">
            {{ form.nw?.toFixed(1) }}
          </h3>
          <span class="text-black-2">净重(kg)</span>
        </div>
      </div>
      <el-form
        ref="formRef"
        label-position="left"
        :model="form"
        style="margin-top: 20px;"
        @submit.prevent
      >
        <el-row :gutter="10">
          <el-col :span="3">
            <el-form-item label="生产线" prop="productionLine">
              <el-select v-model="form.productionLine" disabled style="width: 150px;">
                <el-option
                  v-for="item in sys_production_line"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item
              label="宰猪模式"
              prop="typeId"
              :rules="[
                {
                  message: '宰猪模式不能为空',
                  required: true,
                  trigger: ['change'],
                },
              ]"
            >
              <div class="flex full flex-1" style="width: 200px;">
                <el-select
                  v-model="form.typeId"
                  :disabled="isDisabled"
                  placeholder="请选择宰猪模式"
                  @change="handleSelectChange"
                >
                  <el-option
                    v-for="item in slaughterConfigList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
                <el-button :class="{ disabled: isDisabled }" :icon="slaughterIcon" plain @click="handleLock" />
              </div>
            </el-form-item>
          </el-col>

          <el-col :span="2.5">
            <el-form-item
              label="钩子数量"
              prop="hookNum"
              :rules="[
                {
                  message: '钩子数量不能为空',
                  required: true,
                  trigger: ['change'],
                },

              ]"
            >
              <el-input-number
                v-model="form.hookNum" style="width: 100px" placeholder="请输入钩子数量" controls-position="right" :min="1" :max="100"
                class="custom-input-number"
                @focus.prevent="(event:any) => { event.preventDefault();event.target.blur() }"
                @change="handleLWChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="2.5">
            <el-form-item
              label="链条数量"
              prop="chainNum"
              :rules="[
                {
                  message: '链条数量不能为空',
                  required: true,
                  trigger: ['change'],
                },
              ]"
            >
              <el-input-number
                v-model="form.chainNum" style="width: 100px" placeholder="请输入链条数量" controls-position="right" :min="2" :max="100" :precision="0"
                class="custom-input-number"
                @focus.prevent="(event:any) => { event.preventDefault();event.target.blur() }"
                @change="handleLWChange"
              />
            </el-form-item>
          </el-col>

          <el-col :span="3">
            <el-form-item
              label="刺青号"
              prop="no"
              :rules="[
                {
                  message: '刺青号不能为空',
                  required: true,
                  trigger: ['change'],
                },
                {
                  pattern: /^\d+-\d+$/,
                  message: '请输入正确的刺青编号格式，比如“101-1”',
                  required: true,
                  trigger: ['change'],
                },
              ]"
            >
              <el-input
                v-model="form.no"
                placeholder="请输入刺青号"
                @keyup.enter="handleAdd(0)"
              />
            </el-form-item>
          </el-col>

          <el-col :span="3.5">
            <el-form-item
              label="备注"
              prop="remark"
            >
              <el-input
                v-model="form.remark"
                placeholder="请输入备注"
                @keydown.enter="handleAdd(0)"
              />
            </el-form-item>
          </el-col>

          <el-col :span="5.5">
            <el-form-item>
              <div class="grid grid-cols-2 w-full">
                <el-button type="primary" :loading="formLoading" @click="handleAdd(0)">
                  <template #icon>
                    <i-ep-check />
                  </template>
                  保存
                </el-button>
                <el-button plain type="primary" @click="handleAdd(1)">
                  <i-ep-delete />
                  无公害处理
                </el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card v-loading="loading" element-loading-text="加载中...">
      <div class="flex justify-space-between">
        <el-form ref="queryRef" inline :model="queryParams">
          <el-form-item prop="status">
            <el-select
              v-model="queryParams.status"
              style="width: 200px;"
              placeholder="订单状态"
              @keyup.enter="getList"
              @clear="getList"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item prop="searchValue">
            <el-input
              v-model="queryParams.searchValue"
              style="width: 200px;"
              placeholder="待宰商户/买家"
              clearable
              @keyup.enter="getList"
              @clear="getList"
            />
          </el-form-item>
          <el-form-item prop="no">
            <el-input
              v-model="queryParams.no"
              style="width: 200px;"
              placeholder="请输入刺青号"
              clearable
              @keyup.enter="getList"
              @clear="getList"
            />
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
                <i-ep-search />
              </template>
              搜索
            </el-button>
            <el-button @click="queryRef?.resetFields(), getList()">
              <template #icon>
                <i-ep-refresh />
              </template>
              重置
            </el-button>
          </el-form-item>
        </el-form>

        <pagination
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          :total="total"
          layout="total,  prev, pager, next"
          @pagination="getList()"
        />
      </div>
      <el-table border :data="list" style="width: 100%;height: calc(100% - 50px);">
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
        <el-table-column prop="no" label="刺青号" align="center" width="90">
          <template #default="{ row }">
            {{ row.no }}
          </template>
        </el-table-column>
        <el-table-column prop="gw" label="宰猪模式" align="center" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.orderInfo ? format(slaughterConfigList, row.typeId, { labelField: 'name', valueField: 'id' }) : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="gw" label="毛重" align="center" width="80" sortable />

        <el-table-column prop="lw" label="皮重" align="center" width="80" sortable />

        <el-table-column prop="nw" label="净重" align="center" width="80" sortable />

        <el-table-column prop="hookNum" label="钩子数量" align="center" width="100" />

        <el-table-column prop="hookWeight" label="钩子重量(1条)" align="center" width="120" />

        <el-table-column prop="chainNum" label="链条数量" align="center" width="100" />

        <el-table-column prop="chainWeight" label="链条重量(1个)" align="center" width="120" />

        <el-table-column prop="pulleyWeight" label="滑轮重量" align="center" width="100" />

        <el-table-column align="center" label="状态" width="95">
          <template #default="{ row }">
            <el-tag
              :type="`${row.status}` === '0' ? 'success' : `${row.status}` === '1' ? 'warning' : 'danger' "
            >
              {{ `${row.status}` === '0'
                ? '合格'
                : `${row.status}` === '1' ? '无公害处理' : '已作废' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createBy" label="过磅员" align="center" min-width="120" show-overflow-tooltip />

        <el-table-column prop="createTime" label="过磅时间" align="center" width="170" />

        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.remark ? row.remark : '-' }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <div class="flex flex-end">
              <el-button
                v-if="row.status !== '-1'"
                type="primary"
                plain style="display: block;" @click="handleEdit(row)"
              >
                <template #icon>
                  <i-ep-edit />
                </template>
                编辑
              </el-button>

              <el-button
                v-if="row.status !== '-1'"
                type="danger" plain style="display: block;"
                @click="handleInvalid(row)"
              >
                <template #icon>
                  <i-ep-delete />
                </template>
                作废
              </el-button>

              <el-button
                v-else
                type="danger" plain style="display: block;"
                disabled
              >
                已作废
              </el-button>

              <el-button
                :disabled="row.status === '-1'"
                type="primary" plain style="display: block;"
                :icon="Printer"
                @click="handlePrint(row)"
              >
                打印
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- 修改弹窗 -->
  <EditDialog v-model:visible="editVisible" :current-row="editCurrentRow" :slaughter-config-list="slaughterConfigList" @success="submitSuccess" />

  <!-- 手动输入毛重 -->
  <EmptyTest v-model:visible="emptyTestVisible" :empty-test-form="emptyTestForm" @success="submitSuccess" @close="close" />

  <!-- 打印 -->
  <print-weight v-model="printVisible" :order="currentRow" />
</template>

<style scoped lang="scss">
.home {
  display: grid;
  height: 100%;
  gap: 10px;
  box-sizing: border-box;
  grid-template-rows: auto auto 1fr;

  .el-form--inline .el-form-item{
    margin-right: 10px;
  }

  >    background-color: #fff;
  }

}

:deep(.el-card){
  box-sizing: border-box;
}

:deep(.el-card__body){
  height: 100%;
  box-sizing: border-box;
}

.form{
  padding: 10px;
}

.grid-weight{
  gap: 10px;
}
edff
.item-weight{
  background: #EDF0F4;
  height: 90px;
  bo rder-radius: 4px;

  h3{
    margin: 0;
  }

  span{
    font-size: 12px;
    margin-top: 8px;
  }
}

.disabled{
  background-color: #f5f7fa;
}

.test{
  cursor: default;
}

:deep(.custom-input-number  .el-input__inner) {
  cursor: not-allowed;
}

:deep(.custom-input-number  .el-input__wrapper) {
  background-color: #f5f7fa;
  color: #333;
  cursor: not-allowed !important;
  padding-left: 1px;
  padding-right: 33px;
}
</style>
