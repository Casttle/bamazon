const mysql = require("mysql");
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect((err) => {
    if (err) throw err;
    connection.query('SELECT * FROM products', (queryErr, queryRes) => {
        if (queryErr) throw queryErr;
        const table = cTable.getTable("           Bamazon Item Listings", queryRes);
        console.log("\n");
        console.log(table);
        connection.end();
    })
});
