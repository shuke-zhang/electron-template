<script setup lang="ts">

</script>

<template>
  <el-card v-loading="false" class="h-full border-box">
    <div class="h-full flex flex-direction-column items-center justify-center">
      <div class="hit-the-floor">
        404
      </div>
      <p>
        页面不见了 <router-link class="text-primary" to="/">
          返回首页
        </router-link>
      </p>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.hit-the-floor {
  color: #fff;
  font-size: 12em;
  font-weight: bold;
  font-family: Helvetica;
  text-align: center;
  text-shadow:
    0 1px 0 #ccc,
    0 2px 0 #c9c9c9,
    0 3px 0 #bbb,
    0 4px 0 #b9b9b9,
    0 5px 0 #aaa,
    0 6px 1px rgba(0 0 0 / 10%),
    0 0 5px rgba(0 0 0 / 10%),
    0 1px 3px rgba(0 0 0 / 30%),
    0 3px 5px rgba(0 0 0 / 20%),
    0 5px 10px rgba(0 0 0 / 25%),
    0 10px 10px rgba(0 0 0 / 20%),
    0 20px 20px rgba(0 0 0 / 15%);
}

:deep(.el-card) {
  box-sizing: border-box;
  height: 100%;
}

:deep(.el-card__body) {
  height: 100%;
  box-sizing: border-box;
}
</style>
