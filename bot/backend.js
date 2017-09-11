var WooCommerceAPI = require('woocommerce-api');

var WooCommerce = new WooCommerceAPI({
    url: 'http://wordpress.serendio.com', // Your store URL
    consumerKey: 'ck_74e2c7500bfd8612b1f1d7484ae94e3975d8aaf0', // Your consumer key
    consumerSecret: 'cs_60426098c597edbcbae7e9fec486c4b90cccabf8', // Your consumer secret
    wpAPI: true, // Enable the WP REST API integration
    version: 'wc/v2' // WooCommerce WP REST API version
});

var categories_result=null;
var attributes_result=null;
var products_result=null;


module.exports = {



    woo: function (address) {
        return WooCommerce;

    },

    woo_products: function(category_id)
    {
        return new Promise(function(resolve, reject) {
        WooCommerce.get('products?category='+category_id, function(err, data, res) {
        console.log("Fetched Products From Woo");
        products_result=JSON.parse(res);        
        resolve(products_result);
        });
      });
    },
    woo_categories: function()
    {
        return new Promise(function(resolve, reject) {
        WooCommerce.get('products/categories', function(err, data, res) {
        console.log("Fetched Categories From Woo");
        categories_result=JSON.parse(res);        
        resolve(categories_result);
        });
      });
    },
    woo_variations : function(parent)
    {
        return new Promise(function(resolve, reject) {
        WooCommerce.get('products/'+parent.id+'/variations', function(err, data, res) {
        console.log("Fetched Products From Woo");
        variations_result=JSON.parse(res);        
        resolve(variations_result);
        });
      });
    },
    woo_customer : function(customer)
    {
        return new Promise(function(resolve, reject) {
        WooCommerce.get('customers?email='+customer, function(err, data, res) {
        console.log("Fetched Customer From Woo");
        customer=JSON.parse(res);      
        resolve(customer);
        });
      });
    },

};