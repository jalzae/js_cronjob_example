require('dotenv').config();
const cron = require('node-cron');
const { exec } = require('child_process');
const { log } = require('jalz-cdebug')

log("Starting the cron job script...");

const databases = ["hair", "ecourse"]


const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;
const passwordOption = mysqlPassword ? `-p${mysqlPassword}` : '';

try {
  cron.schedule('0 1 * * *', () => {
    const now = new Date().toISOString();
    log(`Cron job running at ${now}`);

    // MySQL dump command
    for (const database of databases) {
      const dumpCommand = `mysqldump -u ${mysqlUser} ${passwordOption} ${database} > ${database}_${now}.sql`;

      exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing dump: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        log(`MySQL backup completed successfully at ${now}`);
      });

      const insertCommand = `
        INSERT INTO backup.logging (name, alias)
        VALUES ('${database}', '${database}_${now}.sql');
      `;

      exec(`mysql -u ${mysqlUser} ${passwordOption} -e "${insertCommand}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error inserting into table: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        log(`Data inserted into table successfully at ${now}`);
      });
    }
  });

  log("Cron job scheduled successfully.");
} catch (error) {
  console.error("Error scheduling the cron job:", error);
}

// Keep the process alive
setInterval(() => {
  console.log("Keeping the process alive...");
}, 5000);
