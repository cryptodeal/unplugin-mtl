import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';
import MtlFileImport from '../src/vite';

export default defineConfig({
  plugins: [Inspect(), MtlFileImport()],
});
