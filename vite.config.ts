import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
// base './' + outDir 'docs' works with Pages "Deploy from branch /docs" or GitHub Actions
export default defineConfig({plugins:[react()],base:'./',build:{outDir:'docs',emptyOutDir:true}});
