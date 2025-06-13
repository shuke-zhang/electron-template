<script lang="ts" setup>
import Layout from '@/layout/index.vue';
import locale from 'element-plus/dist/locale/zh-cn.mjs';
</script>

<template>
  <ElConfigProvider :locale="locale">
    <Layout />
  </ElConfigProvider>
</template>
