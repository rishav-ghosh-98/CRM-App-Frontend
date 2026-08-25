import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: true,
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router-dom/")) {
            return "vendor-react";
          }
          if (id.includes("node_modules/chart.js/") || id.includes("node_modules/react-chartjs-2/")) {
            return "vendor-charts";
          }
          if (id.includes("node_modules/bootstrap/") || id.includes("node_modules/react-icons/")) {
            return "vendor-ui";
          }
        },
      },
    },
  },
})
