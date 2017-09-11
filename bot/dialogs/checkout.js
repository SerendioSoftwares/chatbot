var util = require('util');
var builder = require('botbuilder');
var botUtils = require('../utils');
var siteUrl = require('../site-url');
var orderService = require('../../services/orders');
var shop = require('../backend');
var cards = require('../cards');
// Checkout flow
var RestartMessage = 'restart';
var StartOver = 'start_over';
var KeepGoing = 'continue';
var Help = 'help';

var lib = new builder.Library('checkout');

lib.dialog('/', [
    function (session) {
        session.beginDialog('validators:email', {
            prompt: session.gettext('ask_email'),
            retryPrompt: session.gettext('invalid_email')
        }); 
    },
    function (session, args, next) {
        //Check if Customer Exists or not
        shop.woo_customer(args.response).then(function (customer) {
            session.dialogData.customer = customer;
            next();
        });
    },
    function (session, args, next) {

        if(session.dialogData.customer.length===0)//Check if Customer Exists or not (list is empty)
        {
            session.send("No Delivery Address Found.")
            next();
        } 
        else
        {
            session.send("Your Delivery address is:\n\n" + session.dialogData.customer[0].shipping.address_1 + "\n\n" + session.dialogData.customer[0].shipping.address_2 + "\n\n" + session.dialogData.customer[0].shipping.postcode);

            session.beginDialog('validators:options', {
                prompt: session.gettext('Do you wish to proceed with the above address?'),
                retryPrompt: session.gettext('Invalid Input'),
                check: ['No', 'Yes']
            }); 
        }

    },
    function (session, args, next)
    {
        if(args.response==='Yes')
        {
            next();
        }
        else
        {
            session.beginDialog('address:/');//Get address
        }
    },
    function (session, args)
    {
        session.dialogData.address = args.address;
        var order = session.userData.products;
        var customer = false;

        // Serialize user address
        if(session.dialogData.address)
        {
            session.dialogData.address = botUtils.serializeAddress(session.dialogData.address);
        }
        else
        {
            session.dialogData.address = botUtils.serializeAddress(session.dialogData.customer[0].shipping);
        }
        if(session.dialogData.customer.length>0)
        {
            customer = true;
        } 
        var customerInfo = botUtils.serializeAddress(session.dialogData.customer)

            // Build Checkout url using previously stored Site url

            var checkoutUrl = util.format(
                '%s/?products=%s&address=%s&customer=%s&customerinfo=%s',
                siteUrl.retrieve(),
                encodeURIComponent(JSON.stringify(session.userData.products)),
                encodeURIComponent(session.dialogData.address),
                encodeURIComponent(customer),
                encodeURIComponent(customerInfo));

            // var messageText = session.gettext('final_price', order.selection.price);
            var card = new builder.HeroCard(session)
                .text("Title")
                .buttons([
                    builder.CardAction.openUrl(session, checkoutUrl, 'add_credit_card'),
                    builder.CardAction.imBack(session, session.gettext(RestartMessage), RestartMessage)
                ]);

            session.send(new builder.Message(session)
                .addAttachment(card));
        // });
        //Launch Checkout
    }

]);

// Checkout completed (initiated from web application. See /checkout.js in the root folder)
lib.dialog('completed', function (session, args, next) {
    args = args || {};
    var orderId = args.orderId;

    // Retrieve order and create ReceiptCard
    orderService.retrieveOrder(orderId).then(function (order) {
        if (!order) {
            throw new Error(session.gettext('order_not_found'));
        }

        var receiptCard = createReceiptCard(session, orderId);
        var message = new builder.Message(session).addAttachment(receiptCard);

        session.send(message);
        session.endDialog("Thank you for shopping with us.\n\nDetails about the order and other queries can be directed at the support section of the chatbot.")
        // session.endDialog("End");
    }).catch(function (err) {
        session.endDialog(session.gettext('error_ocurred', err.message));
    });
});


function createReceiptCard(session, id) {
    console.log("Building Recipt Cart")
    output=[];
    total=0;
    for (i in session.userData.products)
    {
        product=session.userData.products[i];
        card=builder.ReceiptItem.create(session, "$ "+ product.price, product.name +' ('+ product.qty +')')
            .image(builder.CardImage.create(session, product.imageUrl));
        output.push(card);
        total+=product.price*product.qty;

    }
    session.userData.total=total;//for checkout
    return new builder.ReceiptCard(session)
        .title("Order No: "+id)
        .facts([
            // builder.Fact.create(session, name, 'Name'),
            builder.Fact.create(session, 'Debit/Credit Card', 'Payment Method')
        ])
        .items(output)
        .tax('$ 0')
        .total('$ '+total.toFixed(2))
    ;
}


// Helpers
function offuscateNumber(cardNumber) {
    return cardNumber.substring(0, 4) + ' ****';
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};