import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// run package config
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': process.env
    },
    plugins: [react()],
    base: '/',
    resolve: {
      alias: [{ find: '@', replacement: '/src' }],
    },
  };
});
