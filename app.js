const mysql = require("mysql2");
const inquirer = require("inquirer");
const cfonts = require("cfonts"); // Import cfonts

// Create a MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "4bundantly",
  database: "mycompanydb",
});

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");

  // Create a custom font style
  const customFont = cfonts.render("Employee Tracker", {
    font: "block",
    align: "left",
    colors: ["system"],
  });

  // Display the custom font style
  console.log(customFont.string);

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

// Function to add an employee
function addEmployee() {
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter the employee's first name:",
        },
        {
          type: "input",
          name: "lastName",
          message: "Enter the employee's last name:",
        },
        {
          type: "input",
          name: "roleId",
          message: "Enter the role ID for the employee:",
        },
        {
          type: "input",
          name: "managerId",
          message: "Enter the manager's employee ID (or leave empty if none):",
        },
      ])
      .then((answers) => {
        const query =
          "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        db.query(
          query,
          [answers.firstName, answers.lastName, answers.roleId, answers.managerId || null],
          (err, results) => {
            if (err) throw err;
            console.log(`\nEmployee '${answers.firstName} ${answers.lastName}' added.`);
            startApp();
          }
        );
      });
  }
// Function to update an employee's role
function updateEmployeeRole() {
    // Prompt the user to select an employee to update
    inquirer
      .prompt([
        {
          type: "input",
          name: "employeeId",
          message: "Enter the ID of the employee you want to update:",
        },
        {
          type: "input",
          name: "newRoleId",
          message: "Enter the new role ID for the employee:",
        },
      ])
      .then((answers) => {
        // Perform the SQL update query to update the employee's role
        const query =
          "UPDATE employees SET role_id = ? WHERE employee_id = ?";
        db.query(
          query,
          [answers.newRoleId, answers.employeeId],
          (err, results) => {
            if (err) throw err;
            console.log(`\nEmployee's role updated.`);
            startApp();
          }
        );
      });
  }