require('dotenv').config();
const { exec } = require('child_process');


const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;
const passwordOption = mysqlPassword ? `-p${mysqlPassword}` : '';

const createDatabase = `CREATE DATABASE backup;`;
const createTable = `
  CREATE TABLE backup.logging (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    alias VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

exec(`mysql -u ${mysqlUser} ${passwordOption} -e "${createDatabase}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error creating database: ${error.message}`);
    return;
  }
  console.log(`Database created: ${stdout}`);

  exec(`mysql -u ${mysqlUser} ${passwordOption} -e "${createTable}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error creating table: ${error.message}`);
      return;
    }
    console.log(`Table created: ${stdout}`);
  });
});