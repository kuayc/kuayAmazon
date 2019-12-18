const prompt = require("prompt");
const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "kuayc"
    password: "seowkao22"
    database: "Bamazon"
});
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  prompt.start();
  console.log("Bamazon Shift Manager Menu");
  console.log("Select option.")
  console.log("1. View Products for Sale");
  console.log("2. View Low Inventory");
  console.log("3. Add to Inventory");
  console.log("4. Add New Product");
  prompt.get(["menuSelection"], function (err, result) {
  let menuSelection = parseInt(result.menuSelection);
    switch(menuSelection) {
      case 1:
          console.log("View Products for Sale");
          viewProducts(function(){});
          connection.end();
          break;
      case 2:
          console.log("View Low Inventory");
          viewLowInventory();
          connection.end();
          break;
      case 3:
        console.log("Add to Inventory");
        addInventory();
        break;
      case 4:
        console.log("Add New Product");
        addNewProduct();
        break;
      default:
        console.log("Not a vaild entry");
        connection.end();
    }
  });
});
function viewProducts(callback){
  connection.query('SELECT * FROM Products', function(err, res){
    if(err) throw err;
    console.log("Total FC Inventory is below...\n");
    console.log("  ID  |      Product Name      |  Department Name  |   Price  | In Stock"); 
    for(let i = 0; i < res.length; i++){
      let itemID = res[i].ItemID + ''; // convert to string
      itemID = ("  ID  ", itemID);
      let productName = res[i].ProductName;
      productName = ("      Product Name      ", productName);
      let departmentName = res[i].DepartmentName + '';
      departmentName = ("  Department Name  ", departmentName);
      let price = "$" + res[i].Price.toFixed(2);
      price = ("   Price  ", price);
      let quantity = res[i].StockQuantity + '';
      console.log(itemID + "|" + productName + "|" + departmentName + "|" + price + "|    " + quantity);
    }
    callback();
  });
}
function viewLowInventory(){
  connection.query("SELECT * FROM Products WHERE StockQuantity < 5", function(err, res){
    if(err) throw err;
    console.log("Inventory for Items < 5 In Stock is below");
    console.log("  ID  |      Product Name      |  Department Name  |   Price  | In Stock");
    for(let i = 0; i < res.length; i++){
      let itemID = res[i].ItemID + '';
      itemID = ("  ID  ", itemID);
      let productName = res[i].ProductName;
      productName = ("      Product Name      ", productName);
      let departmentName = res[i].DepartmentName;
      departmentName = ("  Department Name  ", departmentName);
      let price = "$" + res[i].Price.toFixed(2);
      price = ("   Price  ", price);
      let quantity = res[i].StockQuantity + '';
      console.log(itemID + "|" + productName + "|" + departmentName + "|" + price + "|    " + quantity);
    }
    console.log("Better get stowing!")
  });
}
function addInventory(){
  viewProducts(function(){
    prompt.start();
    console.log("Which items to restock?");
    prompt.get(["restockItemID"], function (err, result) {
      var restockItemID = result.restockItemID;
      console.log("You selected to re-stock Item # " + restockItemID);
      console.log("How many items will you restock?");
      prompt.get(["restockCount"], function (err, result) {
        var restockCount = result.restockCount;
        console.log('You selected to re-stock ' + restockCount + ' items.');
        restockCount = parseInt(restockCount);
        if(Number.isInteger(restockCount)){
          connection.query('SELECT StockQuantity FROM Products WHERE ?', [{ItemID: restockItemID}], function(err, res){
            if(res[0] == undefined){
              console.log('Sorry, we found no items with Item ID "' +  restockItemID + '"');
              connection.end();
            }
            else{ 
              let bamazonQuantity = res[0].StockQuantity;
              let newInventory = parseInt(bamazonQuantity) + parseInt(restockCount);
              connection.query('UPDATE Products SET ? WHERE ?', [{StockQuantity: newInventory}, {ItemID: restockItemID}], function(err, res){
                if(err) throw err;
                console.log("Inventory updated")
                connection.end();
              });
            }
          });
        }
        else{
          console.log("Only whole items can be added. Integers only!")
          connection.end();
        }
      });
    });
  });
}
function addNewProduct(){
  prompt.start();
  console.log("Complete the new product details:");
  prompt.get(['ProductName', 'DepartmentName', 'Price', 'Quantity'], function (err, result) {
    let productName = result.ProductName;
    let departmentName = result.DepartmentName;
    let price = result.Price;
    let quantity = result.Quantity;
    connection.query("INSERT INTO Products SET ?", {
      ProductName: productName,
      DepartmentName: departmentName,
      Price: price,
      StockQuantity: quantity
    }, function(err, res){
      if(err){
        console.log("Sorry. The SQL database could not be updated.");
        connection.end();
      }
      else{
        console.log("Inventory updated successfully")
        connection.end();
      }
    });
  });
}
