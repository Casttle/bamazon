const mysql = require("mysql");
const cTable = require('console.table');
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});
let totalCost = 0;

connection.connect((err) => {
    if (err) throw err;
    console.log("\n-----------Welcome to BAMAZON!!--------------")
});
const logTable = () => {
    connection.query('SELECT * FROM products', (queryErr, queryRes) => {
        if (queryErr) throw queryErr;
        const table = cTable.getTable("           Bamazon Item Listings", queryRes);
        console.log("\n");
        console.log(table);
        howMayIhelpYou();
    });

};
logTable();

const howMayIhelpYou = () => {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Please enter the item_id of what you would like to buy:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "unitsBuying",
            type: "input",
            message: "How many would you like?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then((checkOut) => {
        connection.query('SELECT * FROM products', (queryErr, queryRes) => {
            if (queryErr) throw queryErr;
            const itemSelected = queryRes[checkOut.id - 1];
            const difference = itemSelected.stock_quantity - checkOut.unitsBuying
            const cost = itemSelected.price * checkOut.unitsBuying;
            if (difference < 0) {
                console.log("\nWe're sorry. The demand is to high for us to handle.\n");
                howMayIhelpYou();
            } else {
                let query = connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: difference
                        },
                        {
                            item_id: itemSelected.item_id
                        }
                    ]
                );
                totalCost = totalCost + cost;
                console.log("\nThank you for your purchase.\n\nThat will be $" + cost.toFixed(2) + "\n");
                buyAgain();
            }
        });
    });
};
const buyAgain = () => {
    inquirer.prompt([
        {
            name: "goagain",
            type: "confirm",
            message: "Would you like to buy another item?",
            default: true
        }
    ]).then((again) => {
        if (again.goagain) {
            logTable();
        } else {
            console.log("\nThank you for shoping Bamazon!\n\nYour total bill today is $" + totalCost.toFixed(2) + "\n\nCome back soon.");
            connection.end();
        }
    });
};
