var util = require('util');
var express = require('express');
var router = express.Router();

var orderService = require('./services/orders');
var bot = require('./bot');
var botUtils = require('./bot/utils');

/* GET Checkout */
router.get('/', function (req, res, next) {
  // orderId and user address
  // var orderId = 1234;
  var address = botUtils.deserializeAddress(req.query.address);
  console.log('-1-1-1-1')

  // orderService.retrieveOrder(orderId).then(function (order) {
    // Check order exists


    // Check order if order is already processed
    // if (order.payed) {
    //   // Dispatch completion dialog
    //   bot.beginDialog(address, 'checkout:completed', { orderId: '1234' });

    //   // Show completion
    //   return res.render('checkout/completed', {
    //     title: 'Serendio Shoes - Order Processed',
    //     order: order
    //   });
    // }

    // Payment form
    res.render('checkout/index', {
      products: JSON.parse(req.query.products),
      address: address,
      customer: req.query.customer,
      OrderId:1234
    });

  // }).catch(function (err) {
  //   next(err);
  // });

});

/* POST Checkout */
router.post('/', function (req, res, next) {
  // orderId and user address
  var orderId = req.body.orderId;
  // var address = botUtils.deserializeAddress(req.body.address);
  var address = req.body.address;
  console.log('user address is', address);
  console.log(req.body);
  // Payment information
  var paymentDetails = {
    creditcardNumber: req.body.creditcard,
    creditcardHolder: req.body.name
  };
res.render('checkout/completed', {
      title: 'Serendio Shoes - Order processed',
      order: processedOrder
    });


  // Complete order
  orderService.confirmOrder(orderId, paymentDetails).then(function (processedOrder) {

    // Dispatch completion dialog
    bot.beginDialog(address, 'checkout:completed', { orderId: orderId });

    // Show completion
    console.log('=============================================================');
    console.log(processedOrder);

    processedOrder.email = req.body.EmailId;
    processedOrder.name = req.body.name;
    processedOrder.phone = req.body.phone;
        
    return res.render('checkout/completed', {
      title: 'Serendio Shoes - Order processed',
      order: processedOrder
    });

  }).catch(function (err) {
    next(err);
  });
});

module.exports = router;
