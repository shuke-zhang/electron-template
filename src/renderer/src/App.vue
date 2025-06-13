<script lang="ts" setup>
import locale from 'element-plus/dist/locale/zh-cn.mjs';
import Layout from '@/layout/index.vue';
</script>

<template>
  <ElConfigProvider :locale="locale">
    <Layout />
  </ElConfigProvider>
</template>
