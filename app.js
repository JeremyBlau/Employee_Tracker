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
  // Perform a SQL query to retrieve departments and display them in a formatted table
}

function viewRoles() {
  // Perform a SQL query to retrieve roles and display them in a formatted table
}

function viewEmployees() {
  // Perform a SQL query to retrieve employees and display them in a formatted table
}

function addDepartment() {
  // Prompt the user to enter a department name and add it to the database
}

function addRole() {
  // Prompt the user to enter role details and add it to the database
}

function addEmployee() {
  // Prompt the user to enter employee details and add them to the database
}

function updateEmployeeRole() {
  // Prompt the user to select an employee and update their role in the database
}
