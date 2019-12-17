const prompt = require('prompt');
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "kuayc"
    password: "seowkao22"
    database: "Bamazon"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected");
});
connection.query("SELECT * FROM Products", function(err, res){  
  if(err) throw err;
  console.log("Check out our selection");
  console.log(" ID | Product Name | Department Name | Price | In Stock");
  for(let i=0; i<res.length; i++){
    let productName = res[i].ProductName + '';
    productName = padText("Product Name", productName);
    let departmentName = res[i].DepartmentName + '';
    departmentName = padText("  Department Name  ", departmentName);
    let price = '$' + res[i].Price.toFixed(2) + '';
    price = padText("Price", price);
    let quantity = res[i].StockQuantity + '';
    console.log(itemID + '|' + productName + '|' + departmentName + '|' + price + '|    ' + quantity);
  }
  prompt.start();
  console.log("Which item to buy?");
  prompt.get(["buyItemID"], function (err, result) {
  let buyItemID = result.buyItemID;
  console.log("You selected Item # " + buyItemID + ".");
  console.log("How many do you wish to buy?")
  prompt.get(["buyItemQuantity"], function (err, result) {
  let buyItemQuantity = result.buyItemQuantity;
  console.log("You are buying " + buyItemQuantity + " units.");
  connection.query('SELECT StockQuantity FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
  if(err) throw err;
  if(res[0] == undefined){
  console.log("Sorry, no items with Item ID: " +  buyItemID);
  connection.end();
  }
  else{
  let bamazonQuantity = res[0].StockQuantity;
  if(bamazonQuantity >= buyItemQuantity){
  let newInventory = parseInt(bamazonQuantity) - parseInt(buyItemQuantity);
  connection.query("UPDATE Products SET ? WHERE ?", [{StockQuantity: newInventory}, {ItemID: buyItemID}], function(err, res){
  if(err) throw err;
  });
  let customerTotal;
  connection.query('SELECT Price FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){            
  let buyItemPrice = res[0].Price;
  customerTotal = buyItemQuantity*buyItemPrice.toFixed(2);
  console.log("Your total is $" + customerTotal);     
  }); 
  };
  else{
  console.log("Sorry... We only have " +  bamazonQuantity + " of those items. Order has been cancelled.");
  connection.end();
          }
        }
      });
    });
  });
});
