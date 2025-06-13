import type { Directive } from 'vue';

export const permissionDirective: Directive = {
  created(_el, binding) {
    // 下面会介绍各个参数的细节
    if (Array.isArray(binding.value) && binding.value.length) {
      console.log(123);
    }
  },
};

declare const INSTANCE_KEY: unique symbol;

export interface Permission extends HTMLElement {
  [INSTANCE_KEY]?: {
    options: string[]
  }
}

export type vPermission = Directive<Permission, string[]>;
