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

function start() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"],
        name: "process"
    }]).then(function (answer) {


        switch (answer.process) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                lowInventory()
                break;
            case "Add to Inventory":
                addInventory()
                break;
            case "Add New Product":
                addProduct();
                break;
            case "EXIT":
                connection.end();
        };

    });
}
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.table(res);
        start();
    })

}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        // console.table(res.filter(elem => elem.stock_quantity < 5));
        console.table(res);
        start();
    })
}

function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        inquirer.prompt([{
            type: "input",
            message: "Enter ID number of the product which you want to add more inventory",
            name: "id",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }, {
            type: "input",
            message: "How many more units of the product do you want to add?",
            name: "addquantity",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }]).then(function (answer) {
            var chosenItem = res.filter(elem => elem.id === parseInt(answer.id))[0];
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: chosenItem.stock_quantity + parseInt(answer.addquantity)
            }, {
                id: parseInt(answer.id)
            }], function (err) {
                console.log(chalk.bold.red("Inventory successfully updated!"));
                start();
            });
        });

    })

}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "productname",
                type: "input",
                message: "What is the name of the product you want to add?"
            },
            {
                name: "departmentname",
                type: "input",
                message: "What is the department name of the new product?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the selling price of the product?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantity",
                type: "input",
                message: "How many of new product do you have in stock?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {

            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.productname,
                    department: answer.departmentname,
                    price: parseInt(answer.price),
                    stock_quantity: parseInt(answer.quantity)
                },
                function (err) {

                    console.log(chalk.red.bold("Your product was created successfully!"));

                    start();
                }
            );
        });
}