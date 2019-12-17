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


            // Show customer their purchase total (need to query the price info from database)
            var customerTotal;
            connection.query('SELECT Price FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
              
              var buyItemPrice = res[0].Price;
              customerTotal = buyItemQuantity*buyItemPrice.toFixed(2);

              console.log('\nYour total is $' + customerTotal + '.');

              // ------------------------- Re factor for Executive Challenge ------------------------
              // Find the department for the purchase item
              connection.query('SELECT DepartmentName FROM Products WHERE ?', [{ItemID: buyItemID}], function(err, res){
                var itemDepartment = res[0].DepartmentName;
                
                // Find the current Revenue for that department
                connection.query('SELECT TotalSales FROM Departments WHERE ?', [{DepartmentName: itemDepartment}], function(err, res){
                  var totalSales = res[0].TotalSales;

                  // Calculate new sale revenue
                  var totalSales = parseFloat(totalSales) + parseFloat(customerTotal);

                  // Add the revenue from each transaction to the TotalSales column for the related department.
                  connection.query('UPDATE Departments SET ? WHERE ?', [{TotalSales: totalSales}, {DepartmentName: itemDepartment}], function(err, res){
                    if(err) throw err; // Error Handler
                    console.log('Transaction Completed. Thank you!')
                    connection.end(); // end the script/connection

                  }); // end new revenue update query
      
                }); // end current revenue query

              }); // end department name query 
              // -------------------------------------------------------------------------------------
            }); // end customer purchase update query 
          }
          // Insufficient inventory
          else{
            console.log('Sorry... We only have ' +  bamazonQuantity + ' of those items. Order cancelled.');
            connection.end(); // end the script/connection
          }
        }

      }); // end item quantity query

    }); // end of prompt 2

  }); // end of prompt 1

}); // end of main query
