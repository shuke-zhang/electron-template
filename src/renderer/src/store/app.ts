import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const appConfig = ref<AppConfig | null>(null);

  getAppConfig();

  return {
    appConfig,
    setAppConfig,
  };

  async function getAppConfig() {
    appConfig.value = await window.electron.ipcRenderer.invoke('get-app-config') as AppConfig || null;
  }

  async function setAppConfig(data: AppConfig) {
    try {
      await window.electron.ipcRenderer.invoke('set-app-config', JSON.stringify(data, null, 2));
      await getAppConfig();
    }
    catch (error) {
      throw error;
    }
  }
});
