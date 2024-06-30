const cron = require('node-cron');

console.log("Starting the cron job script...");


try {
  cron.schedule('* * * * *', () => {
    const currentTime = new Date().toISOString();
    console.log(`Cron job running at ${currentTime}`);
  });

  console.log("Cron job scheduled successfully.");
} catch (error) {
  console.error("Error scheduling the cron job:", error);
}

setInterval(() => {
  console.log("Keeping the process alive...");
}, 5000);
