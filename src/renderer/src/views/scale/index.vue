<script setup lang="ts">
import type { SerialPortType } from '@renderer/store/serialport';
import type { FormInstance } from 'element-plus';

import { random } from 'lodash-es';
import { format } from '@/utils';

const parityOptions = [
  { value: 'none', label: '不校验' },
  { value: 'even', label: '偶校验' },
  { value: 'odd', label: '奇校验' },
];

const rules = {
  name: [
    { required: true, message: '磅秤名称不能为空', trigger: 'blur' },
  ],
  path: [
    { required: true, message: '串口路径不能为空', trigger: 'blur' },
  ],
  baudRate: [
    { required: true, message: '波特率不能为空', trigger: 'change' },
  ],
  parity: [
    { required: true, message: '校验位不能为空', trigger: 'change' },
  ],
  dataBits: [
    { required: true, message: '数据位不能为空', trigger: 'blur' },
  ],
  stopBits: [
    { required: true, message: '停止位不能为空', trigger: 'blur' },
  ],
};

const visible = ref(false);
const formRef = ref<FormInstance>();
const queryRef = ref<FormInstance>();
const form = ref<Partial<SerialPortType>>({ dataBits: 8, stopBits: 1 });
const serialPortStore = useSerialPortStore();
const { addScale, delScale, updateScale } = useSerialPortStore();
const {
  ports,
  scaleList,
} = storeToRefs(serialPortStore);
const queryParams = ref<Partial<SerialPortType>>({ name: '' });
// const rawList = useLocalStorage<SerialPortType[]>('ports-list', []);
const list = ref<SerialPortType[]>([]);
const _ports = computed(() => {
  return ports.value.map((it) => {
    return {
      ...it,
      disabled: list.value.some(e => e.path == it.path),
    };
  });
});
const loading = ref(false);
async function getList() {
  loading.value = true;
  await sleep(random(200, 900));
  const name = queryParams.value.name;
  if (name) {
    list.value = scaleList.value.filter(e => e.name?.includes(name));
  }
  else {
    list.value = [
      ...scaleList.value,
    ];
  }
  loading.value = false;
}
const selectRows = ref<SerialPortType[]>([]);
function handleSelectionChange(e: SerialPortType[]) {
  selectRows.value = [
    ...e,
  ];
}

function handleAdd() {
  visible.value = true;
  form.value = {};
  formRef.value?.resetFields();
}

function handleUpdate(row: SerialPortType) {
  form.value = {
    ...row,
  };
  visible.value = true;
}
function handleDelete(row?: SerialPortType) {
  const rows = row ? [row] : selectRows.value;
  const ids = rows.map(e => e.id);
  confirmWarning(`确认删除${rows.map(e => e.name).join(',')}?`).then(() => {
    return sleep(random(200, 900));
  }).then(() => {
    delScale(ids);
  }).then(() => {
    messageSuccess('操作成功!');
    visible.value = false;
    formRef.value?.resetFields();
    getList();
  });
}

async function submitForm() {
  formRef.value?.validate()
    .then(() => {
      return sleep(random(200, 900));
    })
    .then(() => {
      if (!form.value.id) {
        addScale({
          ...form.value,
        });
      }
      else {
        updateScale({
          ...form.value,
        });
      }
    })
    .then(() => {
      messageSuccess('操作成功!');
      visible.value = false;
      formRef.value?.resetFields();
      getList();
    });
}
function cancel() {
  visible.value = false;
  formRef.value?.resetFields();
}

interface RestaurantItem {
  value: number
  label: string
}
const _baudRate = [
  110,
  300,
  600,
  1200,
  2400,
  4800,
  9600,
  14400,
  19200,
  38400,
  56000,
  57600,
  115200,
  128000,
  230400,
  256000,
  460800,
  921600,
  1000000,
  2000000,
];

const baudRateList = ref<RestaurantItem[]>(_baudRate.map((value) => {
  return {
    value,
    label: `${value}`,
  };
}));
function querySearch(queryString: string, cb: any) {
  const results = queryString
    ? baudRateList.value.filter((e) => {
        return e.label.startsWith(queryString);
      })
    : baudRateList.value;
  // call callback function to return suggestions
  cb(results);
}

function handleSelect() {}
getList();
</script>

<template>
  <el-card class="h-full border-box">
    <Breadcrumb :item-list="['磅秤管理']" />

    <div style="margin-top: 20px;">
      <el-form
        ref="queryRef"
        inline
        :model="queryParams"
        @submit.prevent
      >
        <el-form-item prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="磅秤名称"
            clearable
            style="width: 199px;"
            @keydown.enter="getList()"
            @clear="getList"
          />
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
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="handleAdd"
          >
            <template #icon>
              <i-ep-plus />
            </template>
            新增
          </el-button>
          <el-button
            style="margin-left: 10px;"
            type="danger"
            plain
            :disabled="!selectRows.length"
            @click="handleDelete()"
          >
            <template #icon>
              <i-ep-delete />
            </template>
            删除
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      border
      style="width: 100%;height: calc(100% - 90px);"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column prop="name" label="磅秤名称" align="center" min-width="120" show-overflow-tooltip />
      <el-table-column prop="path" label="路径" align="center" />
      <el-table-column prop="baudRate" label="波特率" align="center" />
      <el-table-column prop="parity" label="检验位" align="center">
        <template #default="{ row }">
          <el-tag
            :type="row.parity === 'none' ? 'info' : row.parity === 'odd' ? 'warning' : 'success' "
          >
            {{ format(parityOptions, row.parity) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="dataBits" label="数据位" align="center" />
      <el-table-column prop="stopBits" label="停止位" align="center" />
      <el-table-column label="操作" align="center" fixed="right" width="250">
        <template #default="{ row }">
          <el-button type="primary" plain size="small" @click="handleUpdate(row)">
            <template #icon>
              <i-ep-edit />
            </template>
            修改
          </el-button>
          <el-button type="danger" plain size="small" @click="handleDelete(row)">
            <template #icon>
              <i-ep-delete />
            </template>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog
    v-model="visible"
    append-to-body
    :close-on-click-modal="false"
    :title="form.id ? '编辑磅秤' : '新增磅秤'"
    :before-close="cancel"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="磅秤名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入磅秤名称" />
      </el-form-item>
      <el-form-item label="串口路径" prop="path">
        <el-select v-model="form.path" placeholder="请选择串口路径">
          <el-option
            v-for="item in _ports"
            :key="item.path"
            :disabled="item.disabled"
            :label="item.path"
            :value="item.path"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="波特率" prop="baudRate">
        <el-autocomplete
          v-model.number="form.baudRate"
          :fetch-suggestions="querySearch"
          clearable
          placeholder="请输入"
          style="width: 100%;"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item label="校验位" prop="parity">
        <el-select v-model="form.parity" placeholder="请选择校验位">
          <el-option v-for="option in parityOptions" :key="option.value" :label="option.label" :value="option.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="数据位" prop="dataBits">
        <el-input v-model.number="form.dataBits" placeholder="请输入数据位" />
      </el-form-item>
      <el-form-item label="停止位" prop="stopBits">
        <el-input v-model.number="form.stopBits" placeholder="请输入停止位" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" @click="submitForm">
        确 定
      </el-button>
      <el-button @click="cancel">
        取 消
      </el-button>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.form {
  max-width: 400px;
  margin: 100px auto 0;
}

:deep(.el-input-number) .el-input__inner {
  text-align: left !important;
}

:deep(.el-card) {
  box-sizing: border-box;
}

:deep(.el-card__body) {
  height: 100%;
  box-sizing: border-box;
}
</style>
