const mysql = require("mysql2");
const inquirer = require("inquirer");

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "your_database_name",
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
  startApp();
});

// Function to start the application
function startApp() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then((choice) => {
      switch (choice.action) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          db.end();
          console.log("Exiting the application");
          break;
      }
    });
}

// Implement functions for each user action (e.g., viewDepartments, viewRoles, etc.)

function viewDepartments() {
    const query = "SELECT department_id, department_name FROM departments";
    db.query(query, (err, results) => {
      if (err) throw err;
      console.log("\nList of Departments:");
      console.table(results);
      startApp();
    });
  }

// Function to view all roles
function viewRoles() {
    const query =
      "SELECT roles.role_id, roles.title, roles.salary, departments.department_name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.department_id";
    db.query(query, (err, results) => {
      if (err) throw err;
      console.log("\nList of Roles:");
      console.table(results);
      startApp();
    });
  }

// Function to view all employees
function viewEmployees() {
    const query =
      "SELECT employees.employee_id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.department_name AS department, CONCAT(managers.first_name, ' ', managers.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.role_id LEFT JOIN departments ON roles.department_id = departments.department_id LEFT JOIN employees AS managers ON employees.manager_id = managers.employee_id";
    db.query(query, (err, results) => {
      if (err) throw err;
      console.log("\nList of Employees:");
      console.table(results);
      startApp();
    });
  }

  // Function to add a department
function addDepartment() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "departmentName",
          message: "Enter the name of the department:",
        },
      ])
      .then((answers) => {
        const query = "INSERT INTO departments (department_name) VALUES (?)";
        db.query(query, [answers.departmentName], (err, results) => {
          if (err) throw err;
          console.log(`\nDepartment '${answers.departmentName}' added.`);
          startApp();
        });
      });
  }

// Function to add a role
function addRole() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Enter the title of the role:",
        },
        {
          type: "input",
          name: "salary",
          message: "Enter the salary for the role:",
        },
        {
          type: "input",
          name: "departmentId",
          message: "Enter the department ID for the role:",
        },
      ])
      .then((answers) => {
        const query =
          "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
        db.query(
          query,
          [answers.title, answers.salary, answers.departmentId],
          (err, results) => {
            if (err) throw err;
            console.log(`\nRole '${answers.title}' added.`);
            startApp();
          }
        );
      });
  }

function addEmployee() {
  // Prompt the user to enter employee details and add them to the database
}

function updateEmployeeRole() {
  // Prompt the user to select an employee and update their role in the database
}
