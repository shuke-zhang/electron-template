<script setup lang="ts">
import {
  Back,
} from '@element-plus/icons-vue';

const props = defineProps({
  itemList: {
    type: Array,
    default: () => [],
  },
});

const list = computed(() => props.itemList);
const router = useRouter();

function handleBlack() {
  router.replace('/');
}
</script>

<template>
  <div class="flex justify-space-between">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">
        首页
      </el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item, index) in list" :key="index">
        {{ item }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-button plain type="primary" :icon="Back" size="small" @click="handleBlack">
      返回首页
    </el-button>
  </div>
</template>

<style scoped lang="scss">

</style>
