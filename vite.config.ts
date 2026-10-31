import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
// base './' keeps assets working under any GitHub Pages repo subpath
export default defineConfig({plugins:[react()],base:'./'});
