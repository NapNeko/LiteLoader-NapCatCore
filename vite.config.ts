import { UserConfig, defineConfig } from 'vite';
import { resolve } from 'path';
import { PluginOption } from 'vite';
import nodeResolve from '@rollup/plugin-node-resolve';
import { builtinModules } from 'module';
import dts from 'vite-plugin-dts'
import cp from 'vite-plugin-cp';

const external = [];
const nodeModules = [...builtinModules, builtinModules.map(m => `node:${m}`)].flat();

const baseConfigPlugin: PluginOption[] = [nodeResolve(), dts({ rollupTypes: true }), cp({
    targets: [
        { src: './tools/package.json', dest: 'dist' }
    ]
})];
const baseConfig = (mode: string = 'development') => defineConfig({
    resolve: {
        conditions: ['node', 'default'],
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    build: {
        sourcemap: true,
        target: 'esnext',
        minify: false,
        lib: {
            entry: 'src/index.ts',
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: [...nodeModules, ...external]
        },
    },
});
export default defineConfig(({ mode }): UserConfig => {
    return {
        ...baseConfig(mode), plugins: [
            ...baseConfigPlugin]
    };
});