DROP DATABASE IF EXISTS admin_db;
CREATE DATABASE admin_db;

USE admin_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NULL
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NULL,
    salary DECIMAL(10,4),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)  
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

select e.id,e.first_name AS "First Name",e.last_name AS "Last Name", role.title,role.salary,department.name AS "Department",concat(m.first_name, ',' , m.last_name) AS Manager
from employee e
inner join employee m on m.id = e.manager_id
left join role ON e.role_id = role.id 
left join department on  role.department_id = department.id 
order by e.id;

select e.id,e.first_name AS "First Name",e.last_name AS "Last Name", department.name AS "Department"
from employee e
left join role ON e.role_id = role.id 
left join department on  role.department_id = department.id 
order by e.id;

select e.id,e.first_name AS "First Name",e.last_name AS "Last Name",concat(m.first_name, ',' , m.last_name) AS Manager
from employee e
inner join employee m on m.id = e.manager_id
order by e.id;

select concat(m.first_name, ',' , m.last_name) AS Manager
from employee e
inner join employee m on m.id = e.manager_id
order by e.id;

select title  from role;

select concat(e.first_name, ',', e.last_name) AS employee
from employee e;
select concat(e.first_name, ' ', e.last_name) AS employee from employee e;