const mysql = require("mysql");
require("dotenv").config();
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
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
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Veiw all employees",
        "Veiw all employees by department",
        "Veiw all employees by manager",
        "Add employee",
        "Remove employee",
        "Update employee role",
        "Update employee manager",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Veiw all employees":
          findAllEmp();
          break;
        case "Veiw all employees by department":
          findAllEmpByDept();
          break;
        case "Veiw all employees by manager":
          findAllEmpByManager();
          break;
        case "Add employee":
          addEmp();
          break;
        case "Remove employee":
          removeEmp();
          break;
        case "Update employee role":
          updateEmpRole();
          break;
        case "Update employee manager":
          updateEmpManager();
          break;
      }
    });
};
//Veiw all employees
function findAllEmp() {
  const query = `select e.id,e.first_name AS "First Name",e.last_name AS "Last Name", role.title,role.salary,department.name AS "Department",concat(m.first_name, ',' , m.last_name) AS Manager
  from employee e
  inner join employee m on m.id = e.manager_id
  left join role ON e.role_id = role.id 
  left join department on  role.department_id = department.id 
  order by e.id;`;
  connection.query(query, (err, res) => {
    console.table("\n", res);
  });
  runSearch();
}
//Veiw all employees by department
function findAllEmpByDept() {
  const query = `select e.id,e.first_name AS "First Name",e.last_name AS "Last Name", department.name AS "Department"
  from employee e
  left join role ON e.role_id = role.id 
  left join department on  role.department_id = department.id 
  order by e.id;`;
  connection.query(query, (err, res) => {
    console.table("\n", res, "\n");
  });
  runSearch();
}

//Veiw all employees by manager
function findAllEmpByManager() {
  const query = `select e.id,e.first_name AS "First Name",e.last_name AS "Last Name",concat(m.first_name, ',' , m.last_name) AS Manager
  from employee e
  inner join employee m on m.id = e.manager_id
  order by e.id;`;
  connection.query(query, (err, res) => {
    console.table("\n", res);
  });
  runSearch();
}

//Add employee
function addEmp() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employee first name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee last name?",
      },
      {
        name: "role",
        type: "list",
        message: "What is the employee role?",
        choices: getRole(),
      },
      {
        name: "manager",
        type: "list",
        message: "Who is employee manager?",
        choices: getManager(),
      },
    ])
    .then((answer) => {
      let roleId = getRole().indexOf(answer.role);
      let managerId = getManager().indexOf(answer.manager);
      connection.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id)VALUES (?,?,?,?)",
        [answer.firstName, answer.lastName, roleId, managerId],
        (err, res) => {
          console.log(err);
        }
      );
    });
  //  runSearch();
}

var roleArr = [];
function getRole() {
  const query = `select title  from role;`;
  connection.query(query, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
}
var managerArr = [];
function getManager() {
  const query = `select concat(m.first_name, ',' , m.last_name) AS manager
  from employee e
  inner join employee m on m.id = e.manager_id
  order by e.id;`;
  connection.query(query, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      managerArr.push(res[i].manager);
    }
  });
  return managerArr;
}

//Remove employee
 function removeEmp() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "list",
        message: "Which employee do you want to remove?",
        choices: getEmpName()
      },
    ])
    .then((answer) => {
      // connection.query(
      //   "delete FROM employee where ? AND ?",
      //   [
      //     answer.name.split(" ").slice(-1).join(" "),
      //     answer.name.split(" ").slice(0).join(" "),
      //   ],
      //   (err, res) => {
      //     console.log("Removed employee from the database.");
      //   }
      // );
    });
}

//Get employee full name
let empArr = [];
 function getEmpName() {
  const query = `select concat(e.first_name, ' ', e.last_name) AS employeeName from employee e;`;
   connection.query(query, function (err, res)  {
    if(err){
      console.log(err);
    }
    for (let i = 0; i < res.length; i++) {
      empArr.push(res[i].employeeName);
    }
     return empArr;
  });
  return empArr;
}
