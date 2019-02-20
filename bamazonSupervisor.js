const mysql = require('mysql');
const inquirer = require('inquirer');
const chalk = require('chalk');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start(){
    inquirer.prompt([{
        type:"list",
        message:"Please choose one: ",
        choices: ["View Product Sales by Department", "Create New Department", "EXIT"],
        name: "choice"
    }]).then(function(answer){

        switch (answer.choice){
            case "View Product Sales by Department":
            view();
            break;
            case "Create New Department":
            newDepartment();
            break;
            case "EXIT":
            connection.end();
        }

    });
}

function newDepartment(){
    inquirer.prompt([{
        type: "input",
        message: "Please enter the name of new department",
        name: "name"
    },
{
    type: "input",
    message: "Please enter over head costs for the new department",
    name: "cost",
    validate: function (value) {
        if (isNaN(value) === false) {
            return true;
        }
        return false;
    }
}]).then(function(answer){
    connection.query("INSERT INTO departments SET ?", {
        department_name: answer.name,
        over_head_costs: answer.cost
    }, function(error){
        console.log(chalk.red.bold("New department added succesfully!"));
        start();
    })
});
}

function view(){
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, SUM(product_sales) AS product_sales, (SUM(product_sales) - departments.over_head_costs ) AS Total_Profit FROM products LEFT JOIN departments on products.department = departments.department_name GROUP BY department ORDER BY departments.department_id asc", function(err, res){
        console.table(res);
        start();
    })
}