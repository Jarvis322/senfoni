// Test script for syncProductsWithDatabase function
const { syncProductsWithDatabase } = require('./services/productService');

console.log("Starting product synchronization test...");

syncProductsWithDatabase()
  .then(result => {
    console.log("Synchronization result:", result);
  })
  .catch(error => {
    console.error("Synchronization error:", error);
  }); 