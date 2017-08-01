var builder = require('botbuilder');



var lib = new builder.Library('cart');

lib.dialog('/', [
    function (session, args, next) {
        var cards = getCardsAttachments(session);

    // create reply with Carousel AttachmentLayout
        var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);
        if (cards.length===0)
        {   

             session.send("Looks like your cart is empty!");
            
        }
        else{
            console.log(cards);
           session.send(reply);
        }
        next();
    },
    function (session, args, next) {

        var welcomeCard = new builder.HeroCard(session)
        .buttons([
            builder.CardAction.imBack(session, "Shop More", "Shop More"),
            builder.CardAction.imBack(session, "Checkout", "Checkout")
        ]);
        session.send(new builder.Message(session)
        .addAttachment(welcomeCard));
        next();     
    },
    function (session, args)
    {
        builder.Prompts.text(session, 'Would you like to Modify Cart,  Checkout, or Shop More? \n\n Click the respective buttons to continue.');

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
                session.replaceDialog('/');
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
        session.replaceDialog('/'); 
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
        console.log(args);
        session.endDialogWithResult(args)
    }
    ]);


function getCardsAttachments(session) {
    output=[];
    console.log("Building Cart...");
    for (i in session.userData.products)
    {
        product=session.userData.products[i];
        card=new builder.HeroCard(session)
        .title(product.name)
        .subtitle("Price: "+product.price + "," + "Size: "+product.size)
        .text("Quantity: "+product.qty)
        .images([builder.CardImage.create(session, product.imageUrl)])
        .buttons([
            builder.CardAction.imBack(session, 'Edit '+i+ ' . ' + product.name, 'Edit Quantity'),
            builder.CardAction.imBack(session, 'Delete '+i+ ' . '+ product.name, 'Delete')]);
        output.push(card);
    }
    return output;

}


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};