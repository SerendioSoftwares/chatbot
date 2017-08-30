var uuid = require('uuid');
var fs = require('fs');
var _ = require('lodash');
var Promise = require('bluebird');
var shop = require('../bot/backend');

var OrderService = {
    placePendingOrder: async function (order) {
        var data = {
          payment_method: 'bacs',
          payment_method_title: 'Direct Bank Transfer',
          set_paid: true,
          billing: {
            first_name: 'John',
            last_name: 'Doe',
            address_1: '969 Market',
            address_2: '',
            city: 'San Francisco',
            state: 'CA',
            postcode: '94103',
            country: 'US',
            email: 'john.doe@example.com',
            phone: '(555) 555-5555'
          },
          shipping: {
            first_name: 'John',
            last_name: 'Doe',
            address_1: '969 Market',
            address_2: '',
            city: 'San Francisco',
            state: 'CA',
            postcode: '94103',
            country: 'US'
          },
          line_items: [
            {
              product_id: 34,
              quantity: 2
            },
          ],
          shipping_lines: [
            {
              method_id: 'flat_rate',
              method_title: 'Flat Rate',
              total: 10
            }
          ]
        };
        console.log('11111111111111')
        await shop.woo().postAsync('orders').then(function(result) {
          temp=JSON.parse(res);
          console.log(temp);    
            return temp;
        });
        console.log('22222222222222');
        return Promise.resolve(order);
    },

    retrieveOrder: function (orderId) {
        var orders = this.load();
        var order = _.find(orders, ['id', orderId]);

        return Promise.resolve(order);
    },
    confirmOrder: function (orderId, paymentDetails) {
        var orders = this.load();
        var order = _.find(orders, ['id', orderId]);
        if (!order) {
            return Promise.reject({ error: 'Order ID not found' });
        }

        if (order.payed) {
            return Promise.resolve(order);
        }

        order.payed = true;
        order.paymentDetails = paymentDetails;
        this.save(orders);

        return Promise.resolve(order);
    },

    // persistence
    load: function () {
        var json = fs.readFileSync('./data/orders.json', { encoding: 'utf8' });
        return JSON.parse(json);
    },
    save: function (orders) {
        var json = JSON.stringify(orders);
        fs.writeFileSync('./data/orders.json', json, { encoding: 'utf8' });
    }
};

module.exports = OrderService;