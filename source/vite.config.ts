import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
// Builds straight into the repo root (one level up): index.html + assets/ are the published site.
export default defineConfig({plugins:[react()],base:'./',build:{outDir:'..',emptyOutDir:false,rollupOptions:{output:{format:'iife',entryFileNames:'assets/app.js',assetFileNames:'assets/app[extname]'}}}});
