var builder = require('botbuilder');



var lib = new builder.Library('cart');

lib.dialog('/', [
    function (session, args, next) {
        console.log(session.userData)        
        if (session.userData.products.length===0)
        {   
             session.send("Looks like your cart is empty!");
              var welcomeCard = new builder.HeroCard(session)
                .buttons([
                    builder.CardAction.imBack(session, "Shop More", "Shop More"),
                ]);
                builder.Prompts.text(session, (new builder.Message(session).addAttachment(welcomeCard)));
                }
        else{
            session.send(new builder.Message(session).addAttachment(createReceiptCard(session)));
            
            var welcomeCard = new builder.HeroCard(session)
            .buttons([
                builder.CardAction.imBack(session, "Shop More", "Shop More"),
                builder.CardAction.imBack(session, "Checkout", "Checkout")
            ]);
            builder.Prompts.text(session, (new builder.Message(session).addAttachment(welcomeCard)));
            }



        // next();
    },


    function (session, args, next) {
        response = args.response;


        
        if (response==='Checkout')
        {
            session.endDialog();
        }
        else if(response==='Shop More') 
        {
            session.endDialogWithResult(args);  
        }
        else if(response==='Modify Cart')
        {
            session.beginDialog('modify');
            
        }
        
    },
    function (session, args, next)
    {
        session.replaceDialog('/');
    }


    
]);


lib.dialog('modify',[
    function(session, args, next)
    {
        var cards = getCardsAttachments(session);

    // create reply with Carousel AttachmentLayout
        var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

        session.send(reply);

        var welcomeCard = new builder.Message(session).addAttachment(new builder.HeroCard(session)
        .buttons([
            builder.CardAction.imBack(session, "Done", "Done")
        ]));

        session.beginDialog('validators:modify', {
            prompt: session.send(welcomeCard),
            retryPrompt: session.gettext('Invalid input, please select a button to continue.')
        });


    },
    function(session, args, next)
    {
        response=args.response;
        if(response==='Done') 
        {
            session.endDialog();  
        }
        else 
        {
            temp=response.split(' ');
            // response=JSON.parse(response);
            console.log(temp);
            console.log(temp[0]);
            session.dialogData.action=temp[0];
            session.dialogData.id=temp[1];


            session.dialogData.response=response;
            if (session.dialogData.action==="Delete")
            {
                session.userData.products.splice(session.dialogData.id,1);
                session.replaceDialog('modify');
            }
            else if (session.dialogData.action==="Edit") {
                next();
            }
            
        }
    },
    function(session, args)
    {
        session.beginDialog('validators:qty', {
            prompt: session.send("How many would you like?"),
            retryPrompt: session.gettext('Enter a number between 1 and 10')
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
    function (session, args)
    {

    },

]);


function getCardsAttachments(session) {
    output=[];
    console.log("Building Cart...");
    for (i in session.userData.products)
    {
        product=session.userData.products[i];
        card=new builder.HeroCard(session)
        .title(product.name)
        .subtitle("Price: $"+product.price + ", " + "Size: "+product.size)
        .text("Quantity: "+product.qty)
        .images([builder.CardImage.create(session, product.imageUrl)])
        .buttons([
            builder.CardAction.imBack(session, 'Edit '+i+ ' . ' + product.name, 'Edit Quantity'),
            builder.CardAction.imBack(session, 'Delete '+i+ ' . '+ product.name, 'Delete')]);
        output.push(card);
    }
    return output;

}

function createReceiptCard(session) {
    console.log("Building Recipt Cart")
    output=[];
    total=0;
    for (i in session.userData.products)
    {
        product=session.userData.products[i];
        card=builder.ReceiptItem.create(session, "$ "+product.price.toString(), product.name +' ('+product.qty+')')
            .image(builder.CardImage.create(session, product.imageUrl));
        output.push(card);
        total+=product.price*product.qty;

    }
    session.userData.total=total;//for checkout
    return new builder.ReceiptCard(session)
        .title('Cart:')
        .facts([
            builder.Fact.create(session, '1234', 'Order Number'),
            // builder.Fact.create(session, 'VISA 5555-****', 'Payment Method')
        ])
        .items(output)
        .tax('$ 0')
        .total('$ '+total.toFixed(2))
        .buttons([
            builder.CardAction.imBack(session,'Modify Cart', 'Modify Cart')
        ]);
}


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};