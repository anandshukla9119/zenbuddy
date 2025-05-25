import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx'], // Add .js and .jsx extensions
  },
  esbuild: {
    loader: 'jsx', // Set the loader for .js files to JSX
    include: /src\/.*\.jsx?$/, // Include both .js and .jsx files in src directory
    exclude: [], // Don't exclude anything
  },
});