const mysql = require('mysql');
require('dotenv').config();
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: process.env.DB_USER,
  // Your password
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) throw err;
  // runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'Veiw all employees',
        'Veiw all employees by department',
        'Veiw all employees by manager',
        'Add employee',
        'Remove employee',
        'Update employee role',
        'Update employee manager',
      ],
    })
    .then((answer) => {
      switch (answer.action){
        case 'Veiw all employees':
          findAllEmp()
          break;
        case 'Veiw all employees by department':
          findAllEmpByDept()
          break;
        case 'Veiw all employees by manager':
          findAllEmpByManager()
          break;
        case 'Add employee':
          addEmp()
          break;
        case 'Remove employee':
          removeEmp()
          break;
        case 'Update employee role':
          updateEmpRole()
          break;
        case 'Update employee manager':
          updateEmpManager()
          break;
      }
    })
}