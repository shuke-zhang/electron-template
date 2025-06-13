import type { Router } from 'vue-router';
import { removeAllPending } from '@renderer/utils';

export function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = { removeAllHttpPending: true };

  router.beforeEach(async () => {
    if (removeAllHttpPending)
      removeAllPending();

    return true;
  });
}
