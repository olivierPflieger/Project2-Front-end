import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'i5z5rz',
  allowCypressEnv: false,
  
  e2e: {
    setupNodeEvents(on, config) {      
    },
    baseUrl: 'http://localhost:4200',    
  },
});
