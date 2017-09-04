var builder = require('botbuilder');
var cards = require('../cards')


var lib = new builder.Library('cart');

lib.dialog('/', [
    function (session, args, next) 
    {
        if (session.userData.products.length===0)//No products in cart
        {   options=['Shop More'];
            session.send("Looks like your cart is empty!");
            var reply = cards.buttons(session, options);
        }

        else
        {
            options=['Shop More', 'Checkout', 'Modify Cart'];
            session.send(cards.receipt(session));
            var reply = cards.buttons(session, options);
        }
        session.beginDialog('validators:options', {//Common Prompt after If-Else
            prompt: session.send(reply),
            retryPrompt: session.gettext('Please choose a valid option.'),
            check: options
        });

    },


    function (session, args, next) {//Redirect Based on Response
        response = args.response;
        
        if (response==='Checkout')
        {
            session.endDialogWithResult();
        }
        else if(response==='Shop More') 
        {
            session.endDialogWithResult(args);  
        }
        else if(response==='Modify Cart' )
        {
            session.beginDialog('modify');
        }
        
    },

    function(session)//Return to start of dialog after 'Modify Cart' Dialog is Done
    {
        session.replaceDialog('/');
    }
]);


lib.dialog('modify',[
    function(session, args, next)//Show Products in carosel format
    {

        var cards = require('../cards');
        reply = cards.carousel_cart(session, session.userData.products);
        console.log('Output Card Carousel')
        session.send(reply);

        var reply = cards.buttons(session, ['Done']);
        session.beginDialog('validators:modify', {
            prompt: session.send(reply),
            retryPrompt: session.gettext('Please choose a valid option.'),
        });
    },

    function(session, args, next)//Either go back if response is "done" or perform mod for product
    {
        response=args.response;
        if(response==="Done") 
        {
            session.endDialogWithResult();  
        }
        else 
        {
            temp=response.split(' ');
            // response=JSON.parse(response);

            
            session.dialogData.action=temp[0];
            session.dialogData.id=temp[1];
            session.send(session.dialogData.action+": "+temo[2]);

            session.dialogData.response=response;
            if (session.dialogData.action==="Delete")
            {
                session.userData.products.splice(session.dialogData.id,1);
                session.replaceDialog('modify');
            }
            else if (session.dialogData.action==="Edit") {
                session.dialogData.check = session.userData.products[session.dialogData.id].stock_quantity;
                next();
            }
            
        }
    },
    function(session, args)
    {
        session.beginDialog('validators:qty', {
            prompt: session.send("How many would you like?"),
            retryPrompt: session.gettext('Sorry! Enter a number between 1 and '+ session.dialogData.check),
            check: session.dialogData.check
        });
    },
    function(session, args)
    {
        session.userData.products[session.dialogData.id].qty=args.response;
        session.replaceDialog('modify');
    }

]);

lib.dialog('quantity', [
    function (session)
    {
        builder.Prompts.number(session, "How many would you like?")
    },
    function (session, args)
    {
        response=args.response;
        session.endDialogWithResult(args);
    },

]);


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};