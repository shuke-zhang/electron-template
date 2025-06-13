import { URL, fileURLToPath } from 'node:url';
import { resolve } from 'path';

import { generatedSvgIconType } from './script/svgIcon';

import vue from '@vitejs/plugin-vue';
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite';
import AutoImport from 'unplugin-auto-import/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isBuild = command === 'build';
  return {
    main: {
      plugins: [externalizeDepsPlugin()],
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@': fileURLToPath(new URL('./src/renderer/src', import.meta.url)),
        },
      },
      define: {
        __DEV__: `${command !== 'build'}`,
        APP_TITLE: JSON.stringify(env.VITE_APP_TITLE),
        APP_API_URL: JSON.stringify(env.VITE_APP_API_URL),
        APP_STATIC_URL: JSON.stringify(env.VITE_APP_STATIC_URL),
      },
      plugins: [
        generatedSvgIconType(isBuild),
        vue(),
        AutoImport({
          include: [
            /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
            /\.vue$/,
            /\.vue\?vue/, // .vue
          ],
          imports: [
            'vue',
            'vue-router',
            '@vueuse/core',
            'pinia',
            {
              '@vueuse/router': [
                'useRouteHash',
                'useRouteParams',
                'useRouteQuery',
              ],
            },
            {
              from: './src/hooks',
              imports: ['DictData'],
              type: true,
            },
          ],
          dts: './types/auto-imports.d.ts',
          dirs: [
            './src/hooks',
            './src/store',
            './src/utils',
          ],
          eslintrc: {
            enabled: false, // Default `false`
            filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
            globalsPropValue: true, // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
          },
        }),
        // svg
        createSvgIconsPlugin({
          iconDirs: [fileURLToPath(new URL('./src/assets/icons', import.meta.url))],
          svgoOptions: isBuild,
          // default
          symbolId: 'icon-[dir]-[name]',
        }),

        Components({
          resolvers: [
            IconsResolver({
              // enabledCollections: ['ep'],
            }),
          ],
          dirs: ['src/components'],
          dts: 'types/components.d.ts',
        }),
        Icons({
          autoInstall: true,
        }),
        // externalizeDepsPlugin({
        //   include: ['serialport']
        // })
      ],
      server: {
        port: Number(env.VITE_APP_PORT),
        host: true,
      },
    },
  };
});
