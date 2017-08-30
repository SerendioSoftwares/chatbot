var util = require('util');
var builder = require('botbuilder');
var botUtils = require('../utils');
var siteUrl = require('../site-url');
var orderService = require('../../services/orders');
var shop = require('../backend');
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
        shop.woo().get('customers?email='+args.response, function(err, data, res) {
            session.dialogData.customer=JSON.parse(res)[0];
            console.log(JSON.parse(res));
            next();
        });

    },
    function (session, args, next) {
        //Check if Customer Exists or not
        console.log(session.dialogData.customer)
        if(!session.dialogData.customer)
        {
            session.send("No Delivery Address Found.")
            next();
        } 
        else
        {
            session.send("Your Delivery address is:\n\n" + session.dialogData.customer.shipping);

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
            session.beginDialog('address:/');
        }
    },
    function (session, args)
    {
        session.dialogData.address = args.address;

        var order = session.userData.products;


        // Serialize user address
        var addressSerialized = botUtils.serializeAddress(session.dialogData.address);
        session.userData.address = session.dialogData.address;
        session.userData.customer = session.dialogData.customer;
        // Create order (with no payment - pending)
        // orderService.placePendingOrder(order).then(function (order) {

            // Build Checkout url using previously stored Site url
            console.log('Control')
            // console.log(session.userData.products)
            var checkoutUrl = util.format(
                '%s/checkout?products=%s&address=%s&customer=%s',
                siteUrl.retrieve(),
                encodeURIComponent(JSON.stringify(session.userData.products)),
                encodeURIComponent(addressSerialized),
                encodeURIComponent(session.dialogData.customer));

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


        var message = new builder.Message(session)
            .addAttachment(receiptCard);

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
        card=builder.ReceiptItem.create(session, "$ "+ product.price, product.name +' ('+product.qty+')')
            .image(builder.CardImage.create(session, product.imageUrl));
        output.push(card);
        total+=product.price*product.qty;

    }
    session.userData.total=total;//for checkout
    return new builder.ReceiptCard(session)
        .title("Order No: 1234")
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