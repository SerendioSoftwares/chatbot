var WooCommerceAPI = require('woocommerce-api');

var WooCommerce = new WooCommerceAPI({
    url: 'http://192.168.1.19', // Your store URL
    consumerKey: 'ck_a539ec4744f0e631a1a9a961cf868f1480646c1d', // Your consumer key
    consumerSecret: 'cs_75519a7d7e53f6842b52c9049e646edc6bf5ab68', // Your consumer secret
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

    result: function(param)
    {
        if (param==='categories')
        {
            return categories_result;
        }
        else if(param==='attributes')
        {
            return attributes_result
        }
        else if(param==='products')
        {
            return products_result
        }
    },
    fetch_woo:  function()
    {


        	 WooCommerce.get('products/categories',  function(err, data, res) {
      			console.log("Fetched Categories");
      			categories_result=JSON.parse(res);  			
    		});

            WooCommerce.get('products/attributes', function(err, data, res) {
                console.log("Fetched Attributes");
                attributes_result=JSON.parse(res);
                console.log(attributes_result);
                
            });

            WooCommerce.get('products?per_page=100', function(err, data, res) {
                console.log("Fetched Products...");
                products_result=JSON.parse(res);
                console.log(products_result[0]);
            });

        
    },

    search: function(category, attributes)
    {
        _cb();
    }



    
};