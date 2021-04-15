DROP DATABASE IF EXISTS admin_db;
CREATE DATABASE admin_db;

USE admin_db;

CREATE TABLE department {
    id INT NOT NULL,
    name VARCHAR(30) NULL,
    PRIMARY KEY (id)
}

CREATE TABLE role {
    id INT NOT NULL,
    title VARCHAR(30) NULL,
    salary DECIMAL(10,4),
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
}

CREATE TABLE employee {
    id INT NOT NULL,
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES employee(id)
    FOREIGN KEY (manager_id) REFERENCES role(id)  
}

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
