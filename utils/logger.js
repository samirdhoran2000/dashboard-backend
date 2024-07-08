const logMemoryUsage = (label) => {
  const memoryUsage = process.memoryUsage();
  console.log(`[${label}] Memory Usage:`, {
    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`,
    arrayBuffers: `${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`,
  });

  console.log("memory usage : ", memoryUsage);
};


export { logMemoryUsage }