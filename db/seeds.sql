USE admin_db;

INSERT INTO department (name) 
VALUES ('Sales'),('Engineering'),('Finance'),('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),('Salesperson', 80000, 1), ('Lead Engineer', 150000, 2),('Software Engineer', 120000, 2),('Accountant',125000, 3),
('Legal Team Lead', 250000, 4), ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John','Doe',2,null), ('Mike','Chan',1,null), ('Ashley','Rodriguez',3, null),('Kevin','Tupik',4,null), ('Malia','Brown',2,null), ('Sarah','Lourd',3,null),('Tom','Allen',4,null),('Christian','Eckenrode',1,null);

update employee SET manager_id = 4 WHERE role_id = 2;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Josh','Thacker',1,2)
