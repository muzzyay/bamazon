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
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer.prompt([{
        type: "list",
        message: "Please choose one: ",
        choices: ["SHOPPING", "EXIT"],
        name: "choice"

    }]).then(function (answer) {
        if (answer.choice === "SHOPPING") {
            shop();

        } else {
            connection.end();
        }
    });
}

function shop() {
    connection.query("SELECT * FROM products", function (err, res) {
        connection.query("SELECT id, product_name, price FROM products", function (err, results) {
            console.table(results);
            inquirer.prompt([{
                type: "input",
                message: "Enter ID number of the product you want to buy.",
                name: "idNumber",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }, {
                input: "input",
                message: "How many units of the product would you like to buy?",
                name: "quantity",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }]).then(function (answer) {
                var chosenItem = res.filter(elem => elem.id === parseInt(answer.idNumber))[0];
                if (chosenItem.stock_quantity < parseInt(answer.quantity)) {
                    console.log(chalk.red.bold("insufficient quantity!"));
                    start();

                } else {
                    var updatedQuantity = chosenItem.stock_quantity - parseInt(answer.quantity);
                    connection.query("UPDATE products SET ? WHERE ?", [
                        {

                            stock_quantity: updatedQuantity,
                            product_sales: chosenItem.product_sales + (chosenItem.price * parseInt(answer.quantity))
                        }, {
                            id: parseInt(answer.idNumber)
                        }
                    ], function (error) {


                        console.log(chalk.bgRed.yellow.bold("Total Cost of your purchase: " + parseInt(answer.quantity) * chosenItem.price));
                        start();

                    })
                };

            });
        });


    });
}





