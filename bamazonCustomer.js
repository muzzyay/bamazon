const mysql = require('mysql');
const inquirer = require('inquirer');
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

    connection.query("SELECT * FROM products", function (err, res) {
        console.table(res);
        inquirer.prompt([{
            type: "input",
            message: "Ented ID number of the product you want to buy.",
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
                console.log("insufficient quantity!");

            } else {
                var updatedQuantity = chosenItem.stock_quantity - parseInt(answer.quantity);
                connection.query("UPDATE products SET ? WHERE ?", [
                    {

                        stock_quantity: updatedQuantity
                    }, {
                        id: parseInt(answer.idNumber)
                    }
                ], function (error) {
                    // if (error) throw error;
                    console.log(updatedQuantity);
                    console.log("Total Cost of your purchase: " + parseInt(answer.quantity) * chosenItem.price);

                })
            };

        });

    });


});





