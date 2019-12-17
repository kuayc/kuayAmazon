Summary
-------
This is a nodeJS/mySQL command-line app that clones the business logic of an online retailer.

Node.js Files
-------------
Two JS files simulate the e-commerce engine:
(a) BamazonCustomer.js
(b) BamazonManager.js

(a) BamazonCustomer.js
----------------------
Receives orders from customers and interacts with mySQL to deplete stock from the store's inventory.

(b) BamazonManager.js
---------------------
A warehouse management system that provides a list of options to view/adjust inventory.
A sample of the menu:
View Products for Sale
View Low Inventory
Add to Inventory
Add New Product

MySQL Files
-----------
The JS files above query a MySQL database called Bamazon which is locally hosted on my laptop.
Please refer to the schema.sql file to see how the database was created.
