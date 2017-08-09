var WooCommerceAPI = require('woocommerce-api');

var WooCommerce = new WooCommerceAPI({
    url: 'http://192.168.2.233', // Your store URL
    consumerKey: 'ck_a539ec4744f0e631a1a9a961cf868f1480646c1d', // Your consumer key
    consumerSecret: 'cs_75519a7d7e53f6842b52c9049e646edc6bf5ab68', // Your consumer secret
    wpAPI: true, // Enable the WP REST API integration
    version: 'wc/v2' // WooCommerce WP REST API version
});



module.exports = {



    test: function (address) {
        WooCommerce.get('orders/38', function(err, data, res){
	    console.log(err);
	    console.log(data);
	    console.log(JSON.parse(res));
		});
    },

    



    
};