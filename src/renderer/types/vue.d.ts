import type { ElLoadingDirective } from 'element-plus';
import type { vShow } from 'vue';

declare module 'vue' {
  interface ComponentCustomProperties {

  }

  export interface ComponentCustomProperties {
    vShow: typeof vShow;
    vLoading: typeof ElLoadingDirective;
  }
}

export {};
