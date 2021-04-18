const mysql = require("mysql");
require("dotenv").config();
const inquirer = require("inquirer");
const cTable = require("console.table");
const { async } = require("rxjs");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
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
        "Exit",
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
        case "Exit":
          connection.end();
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
    console.table("\n", res, "\n");
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
    console.table("\n", res, "\n");
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
          console.table("\n Success");
        }
      );
      runSearch();
    });
}

var roleArr = [];
function getRole() {
  const query = `select title from role;`;
  connection.query(query, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
}

var managerArr = [];
const getManager = () => {
  const query = `select concat(e.first_name, ',' , e.last_name) AS manager
  from employee e
  order by e.id;`;
  connection.query(query, (err, res) => {
    for (var i = 0; i < res.length; i++) {
      managerArr.push(res[i].manager);
    }
  });
  return managerArr;
}

//Remove employee
async function removeEmp() {
  inquirer
    .prompt([
      {
        name: "empName",
        type: "list",
        message: "Which employee do you want to remove?",
        choices: await getEmpName(),
      },
    ])
    .then((answer) => {
      connection.query(
        `delete FROM employee where first_name = ? AND last_name = ?`,
        [`${answer.empName.split(" ")[0]}`, `${answer.empName.split(" ")[1]}`],
        (err, res) => {
          if (res) {
            console.log("\n" + "Removed employee from the database.");
          } else {
            console.log(err);
          }
        }
      );
      runSearch();
    });
}

//Get employee full name
function getEmpName() {
  const query = `select concat(e.first_name, ' ', e.last_name) AS employeeName from employee e;`;
  let namePromise = new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      if (err) reject(err);
      let emplArr = res.map((person) => person.employeeName);
      resolve(emplArr);
    });
  });
  return namePromise;
}

//Get employee role
function getEmpRole() {
  const query = `select title from role;`;
  let namePromise = new Promise(function (resolve, reject) {
    connection.query(query, function (err, res) {
      if (err) reject(err);
      let emplArr = res.map((person) => person.title);
      resolve(emplArr);
    });
  });
  return namePromise;
}

//Update employee role
async function updateEmpRole() {
  inquirer
    .prompt([
      {
        name: "empRoleName",
        type: "list",
        message: `Which employee's role do you want to update?`,
        choices: await getEmpName(),
      },
      {
        name: "roleID",
        type: "list",
        message: "Which role do you want to assign?",
        choices: await getEmpRole(),
      },
    ])
    .then((answer) => {
      let roleID = answer.roleID;
      connection.query(
        `update employee SET role_id = (select id from role where title = ?) WHERE first_name = ? AND last_name = ?`,
        [
          roleID,
          `${answer.empRoleName.split(" ")[0]}`,
          `${answer.empRoleName.split(" ")[1]}`,
        ],
        (err, res) => {
          console.log(err);
        }
      );
      runSearch();
    }); 
}

//Update Manager Id
async function updateEmpManager() {
  inquirer
    .prompt([
      {
        name: "empRoleName",
        type: "list",
        message: `Which employee's manager do you want to update?`,
        choices: await getEmpName(),
      },
      {
        name: "managerName",
        type: "list",
        message: "Which manager do you want to assign?",
        choices: await getEmpName(),
      },
    ])
    .then((answer) => {
      let managerId = managerArr.indexOf(answer.managerName);
      console.log(managerArr);
      console.log(managerId);
      connection.query(
        `update employee SET manager_id = ? WHERE first_name = ? AND last_name = ?`,
        [
          managerId,
          `${answer.empRoleName.split(" ")[0]}`,
          `${answer.empRoleName.split(" ")[1]}`,
        ],
        (err, res) => {
          console.log(err);
        }
      );
      runSearch();
    });
}
