USE admin_db;

INSERT INTO department (name) 
VALUES ('Sales'),('Engineering'),('Finance'),('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),('Salesperson', 80000, 1), ('Lead Engineer', 150000, 2),('Software Engineer', 120000, 2),('Accountant',125000, 3),
('Legal Team Lead', 250000, 4), ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John','Doe',2,null), ('Mike','Chan',1,null), ('Ashley','Rodriguez',3, null),('Kevin','Tupik',4,null), ('Malia','Brown',2,null), ('Sarah','Lourd',3,null),('Tom','Allen',4,null),('Christian','Eckenrode',1,null);

update employee SET manager_id = 3 WHERE role_id = 2;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Josh','Thacker',1,2);

SELECT * FROM employee;
SELECT * FROM role;
SELECT title FROM role;

update employee SET manager_id = 
(SELECT id FROM employee WHERE first_name = 'Ashley' AND last_name = 'Rodriguez') 
WHERE first_name = 'John' AND last_name = 'Doe';

update employee SET manager_Id = 3 WHERE first_name = 'Mike' AND last_name = 'Chan';

update employee SET role_id = 1 WHERE first_name = 'John' AND last_name = 'Doe';

delete FROM employee where id=13; 
delete FROM employee where first_name = 'dsd' AND last_name = 'sd';
delete FROM employee where first_name = 'John' AND last_name = 'Doe';

select concat(m.first_name, ',' , m.last_name) AS manager
    from employee e
    inner join employee m on m.id = e.manager_id
    order by e.id;

UPDATE employee
SET role_id = (SELECT id FROM role WHERE title = 'Salesperson' ) 
WHERE first_name = 'Kevin' AND last_name = 'Tupik';

