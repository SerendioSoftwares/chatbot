var util = require('util');
var express = require('express');
var router = express.Router();

var orderService = require('./services/orders');
var bot = require('./bot');
var botUtils = require('./bot/utils');
var shop = require('./bot/backend');

/* GET Checkout */
router.get('/', function (req, res, next) {

    var address = botUtils.deserializeAddress(req.query.address);
    

    if (req.query.customer==='false'){
        console.log('************** Customer doesnt exists');
        res.render('customer', {
            customer: req.query.customer,
            products: req.query.products,
            address: address
        });

    }else {
        console.log('************** Customer exists');

        //console.log(customerinfo);
        var customerinfo= botUtils.deserializeAddress(req.query.customerinfo);

        res.render('order', {
            title: 'order',
            products: req.query.products,
            address: address,
            customer: req.query.customer,
            customerinfo: JSON.stringify(customerinfo)
        });
    }

});

/* POST Checkout */
router.post('/', function (req, res, next) {
    var response = req.body;
    var products= req.body.products;
    var address= req.body.address;
    var customer= req.body.customer;
    console.log('--------------------------');
    

    var data = {
        email: response.emailid,
        first_name: response.fname,
        last_name: response.lname,
        username: response.emailid,
        password: 'ABCdef@123',
        billing: {
            first_name: response.fname,
            last_name: response.lname,
            company: '',
            address_1: response.address1,
            address_2: response.address2,
            city: '',
            state: '',
            postcode: response.postalcode,
            country: '',
            email: response.emailid,
            phone: response.phoneno
        },
        shipping: {
            first_name: response.fname,
            last_name: response.lname,
            company: '',
            address_1: response.address1,
            address_2: response.address2,
            city: '',
            state: '',
            postcode: response.postalcode,
            country: ''
        }
    };
    shop.woo().post('customers', data, function(err, data1, result) {
        console.log('Customer created successfully');
        console.log(result);
        
        var customerinfo = data;
        console.log(customerinfo);
        res.render('order', {
        title: 'Serendio Shoes - Customer created successfully',
        products: products,
        address: address,
        customer: customer,
        customerinfo: customerinfo
    });
    });


    
});

router.post('/orders', function (req, resp, next) {

    var address = req.body.address;
    var products = JSON.parse(req.body.products);
    var customer= req.body.customer;
    var customerinfo= JSON.parse(req.body.customerinfo);

    console.log(address);
    console.log(customerinfo[0]);

    var billing = customerinfo[0].billing;
    var shipping = customerinfo[0].shipping;

    var line_items=[];

    for(var i=0; i<products.length; i++){
        var prod={};
        prod.product_id=products[i].id;
        if (products[i].variations != undefined && products[i].variations.length>0) {
            //console.log(products[i].variations);
            prod.variation_id=products[i].variations[0];
        }
        prod.quantity=products[i].qty;
        line_items.push(prod);
    }
    console.log(line_items);

    var data = {
        payment_method: 'bacs',
        payment_method_title: 'Direct Bank Transfer',
        set_paid: true,
        billing: billing,
        shipping: shipping,
        line_items: line_items,
        shipping_lines: [
            {
                method_id: 'flat_rate',
                method_title: 'Flat Rate',
                total: 10
            }
        ]
    };

     shop.woo().post('orders',data, function(err, data, res) {
        
        res=JSON.parse(res);
        console.log(res);
        bot.beginDialog(address, 'checkout:completed', { orderId: res.id });
        return resp.render('completed', {
            title: 'Order created successfully'
          
        });

    });
});

/*

router.post('/login', function (req, resp, next) {

    console.log(req.body);

    shop.woo().get('customers?email='+req.body.emailid, function(err, data, res) {
        var response = JSON.parse(res);
        if (response.length >0){
            console.log('Login success');

            return resp.render('orders', {
                title: 'Serendio Shoes - Login success!!'
            });
        }
        else
        {
            console.log('Invalid login')

            resp.render('login', {
                customer: false,
                address: '',
                products: ''
            });
        }
    });

});
*/


module.exports = router;
