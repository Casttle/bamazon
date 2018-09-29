const mysql = require("mysql");
const cTable = require('console.table');
var inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect((err) => {
    if (err) throw err;
});

const tasks = () => {
    inquirer.prompt([
        {
            name: "query",
            type: "list",
            message: " Hello Manger. What would you like to do?",
            choices: [" View Products for Sale", " View Low Inventory", " Add to Inventory", " Add New Product", "Exit"]
        }
    ]).then((task) => {
        switch (task.query) {
            case " View Products for Sale":
                return logTable();
            case " View Low Inventory":
                return lowInventory();
            case " Add to Inventory":
                return addInventory();
            case " Add New Product":
                return addProduct();
            case " Exit":
                return exit();
        }
    })
};

tasks();

const logTable = () => {
    connection.query('SELECT * FROM products', (queryErr, queryRes) => {
        if (queryErr) throw queryErr;
        const table = cTable.getTable("\n||---------Welcome BAMAZON Manager!!---------||", queryRes);
        console.log("\n");
        console.log(table);
        tasks();
    });

};

const lowInventory = () => {
    connection.query('SELECT * FROM products', (queryErr, queryRes) => {
        if (queryErr) throw queryErr;
        var lowQ = new Array;
        for (i = 0; i < queryRes.length; i++) {
            if (queryRes[i].stock_quantity <= 5) {
                lowQ.push(queryRes[i]);
            }
        };
        const table = cTable.getTable("\n||---------Low Inventory Items---------||", lowQ);
        console.log("\n");
        console.log(table);
        tasks();
    });
};

const addInventory = () => {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: " What is the item_id? ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "amount",
            type: "input",
            message: " How much would you like to add? ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then((addInvo) => {
        connection.query('SELECT * FROM products', (queryErr, queryRes) => {
            if (queryErr) throw queryErr;
            const itemSelected = queryRes[addInvo.id - 1];
            const invoAddition = parseInt(itemSelected.stock_quantity) + parseInt(addInvo.amount);

            // console.log(itemSelected.product_name + "  "+ invoAddition);
            let query = connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: invoAddition
                    },
                    {
                        item_id: itemSelected.item_id
                    }
                ]
            );
            console.log(`\n Added ${addInvo.amount} units to ${itemSelected.product_name}\n`);
            tasks();
        });
    });
};

const addProduct = () => {
    inquirer.prompt([
        {
            name: "newName",
            type: "input",
            message: "Name of product? "
        },
        {
            name: "newPrice",
            type: "input",
            message: "How much will it sell for? ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "newInvo",
            type: "input",
            message: "How much is in inventory? ",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "confirm",
            message: "Is everything correct?",
            name: "confirm",
            default: true
        }
    ]).then((newItem) => {
        connection.query('SELECT * FROM products', (queryErr, queryRes) => {
            if (newItem.confirm) {
                var query = connection.query("INSERT INTO products SET ?",
                    {
                        product_name: newItem.newName,
                        price: newItem.newPrice,
                        stock_quantity: newItem.newInvo
                    },
                    function (err, res) {
                        console.log(res.affectedRows + " product inserted!\n");
                        tasks();
                    }
                );
            } else {
                console.log("   Restarting");
                tasks();
            }
        });
    });
};
const exit = () => {
    console.log("\nHave a good day :)");
    connection.end();
}