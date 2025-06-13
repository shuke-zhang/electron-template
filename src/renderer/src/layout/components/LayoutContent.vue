<script setup lang="ts">
defineOptions({
  name: 'LayoutContent',
});

const layout = ref(false);
const router = useRouter();
router.beforeEach(() => {
  layout.value = false;
});
router.afterEach((a) => {
  layout.value = a.meta.layout !== false;
});
</script>

<template>
  <div class="content-wrapper">
    <main id="content" :class="{ layout }">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/var.scss';

@media screen and (max-width: $screen-md) {
  .content-wrapper {
    grid-template-columns: auto !important;
  }
}

.content-wrapper {
  flex: 1;
  background: #f6f6f6;
}

#content {
  overflow-x: hidden;
  height: calc(100vh);

  &.layout {
    height: var(--app-content-height);
    box-sizing: border-box;
    padding: var(--app-content-padding);
  }
}
</style>
