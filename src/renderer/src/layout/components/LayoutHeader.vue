<script setup lang="ts">
defineOptions({
  name: 'LayoutHeader',
});

const userStore = useUserStore();
const { hasSettingPermission } = storeToRefs(userStore);
const title = APP_TITLE;
const router = useRouter();

async function handleLogout() {
  confirmWarning('确定退出登录？').then(() => {
    return userStore.logout();
  }).then(() => {
    return router.replace('/redirect/');
  });
}

function handleCommand(e: 'setting' | 'logout' | 'scale') {
  switch (e) {
    case 'logout':
      handleLogout();
      break;
    case 'setting':
      router.push('/setting');
      break;
    case 'scale':
      router.push('/scale');
      break;
  }
}
</script>

<template>
  <header class="layout-header">
    <div class="layout-header_inner container flex items-center">
      <h3 class="flex-1">
        <router-link to="/">
          {{ title }}
        </router-link>
      </h3>
      <el-dropdown v-if="userStore.user" @command="handleCommand">
        <div class="flex items-center user-info">
          <img class="avater" :src="userStore.avater">
          <span style="margin-left: 10px;">{{ userStore.user?.userName?.toLocaleUpperCase() }}</span>
          <el-icon class="el-icon--right">
            <i-ep-arrow-down />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="hasSettingPermission" command="setting">
              系统设置
            </el-dropdown-item>
            <el-dropdown-item v-if="hasSettingPermission" command="scale">
              磅称管理
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped lang="scss">
  // @import url('@/assets/styles/var.scss');
.layout-header {
  background: white;
  position: sticky;
  box-sizing: border-box;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  animation-duration: 0.1s;
}

.layout-header_inner {
  height: var(--app-header-hight);
  border-bottom: 1px solid #ebebeb;
}

.avater {
  height: 50px;
  width: 50px;
  border-radius: 50px;
}

.user-info:hover {
  cursor: pointer;
}

h3 {
  a {
    text-decoration: none;

    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
