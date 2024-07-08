const cron = require('node-cron');
const { exec } = require('child_process');

console.log("Starting the cron job script...");

const databases = ["hair", "ecourse"]

try {
  // Schedule the cron job to run at 10:55 every day
  cron.schedule('01 11 * * *', () => {
    const now = new Date().toISOString();
    console.log(`Cron job running at ${now}`);

    // MySQL dump command
    for(const database of databases) {
    const dumpCommand = `mysqldump -u root ${database} > ${database}_${now}.sql`;

    exec(dumpCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing dump: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`MySQL backup completed successfully at ${now}`);
    });
  }
  });

  console.log("Cron job scheduled successfully.");
} catch (error) {
  console.error("Error scheduling the cron job:", error);
}

// Keep the process alive
setInterval(() => {
  console.log("Keeping the process alive...");
}, 5000);
