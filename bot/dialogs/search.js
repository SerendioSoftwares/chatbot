var builder = require('botbuilder');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();

// Main dialog with LUIS
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8b32b8d-5d2d-4ebd-9d5f-af666c748b12?subscription-key=011183f533c94864b0117e8c16778824&timezoneOffset=0&verbose=true&q=';

var lib = new builder.Library('search');

lib.dialog('/', [

    function(session, args, next){

        if (!session.dialogData.category)
        {
            session.beginDialog('category');
            
        }
        next();
    },
    
        // Category selected
    function (session, args, next) {
        if (!session.dialogData.category)
        {
            session.dialogData.category=args.response;
        }
       
        // session.send('choose_bouquet_from_category', category);
        if(!session.dialogData.size)
        {
            session.beginDialog('size');
        }
        next();
    },
    function (session, args, next) {
       
        if(!session.dialogData.size)
        {
            session.dialogData.size=args.response;
        }
        if(!session.dialogData.price)
        {
            session.beginDialog('price');
        }
        next();
    },


    function (session, args, next) {


        if(!session.dialogData.price)
        {
            session.dialogData.price=args.response;
        }

        next();

        
    },

    function (session, args, next) 
    {
    	session.dialogData.priceRange=args.response;
        session.beginDialog('product-selection:/', {category: session.dialogData.category, size : session.dialogData.size, price : session.dialogData.price});
    },

    function (session, args, next) 
    {
        // Logic for cart push and update duplicates

        console.log(args);
        if(!args.selection)
        {
            session.replaceDialog('/');
        }

        else{
            session.send("You've selected: \n\n Name: "+ args.selection.name + "\n\n Size: " + args.selection.size + "\n\n Price: $" + args.selection.price );
        flag=false;
        temp=null;
        for (i in session.userData.products)
        {
        	if(session.userData.products[i].name===args.selection.name && session.userData.products[i].size===args.selection.size)
        	{
        		flag=true;
        		temp=i;
        	}
        }
        if (flag)
        {
        	session.userData.products[i].qty+=1;
        }
        else
        {
        	session.userData.products.push(args.selection);
        }

        args.selection=null;
        console.log(session.userData.products);
        session.endDialog();
    }
    }
]);






lib.dialog('category',[
    function(session, args, next)
    {   session.message.text=null;
        var cards = getCardsAttachments(session);
        var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);


        session.beginDialog('validators:category', {
            prompt: session.send(reply),
            retryPrompt: session.gettext('Choose one from the given categories')
        });
    },
    function (session, args)
    {
        console.log('3333333333333333');
        session.endDialogWithResult(args);
    }

    ]);

lib.dialog('size',[
    function(session, args, next)
    {   
        choices=["We have some wonderful choices", "A new range of products are in"];
        session.send(choices[Math.floor(Math.random() * choices.length)] + ", what Size would you like?");
        
        var welcomeCard = new builder.HeroCard(session)
        .buttons([
            builder.CardAction.imBack(session, "8", "8"),
            builder.CardAction.imBack(session, "9", "9"),
            builder.CardAction.imBack(session, "10", "10"),
            builder.CardAction.imBack(session, "11", "11"),
            builder.CardAction.imBack(session, "12", "12"),
        ]);
        session.beginDialog('validators:size', {
            prompt: session.send(new builder.Message(session).addAttachment(welcomeCard)),
            retryPrompt: session.gettext('Choose one between 8 and 12')
        });
    },
    function (session, args)
    {
        session.endDialogWithResult(args);
    }

    ]);

lib.dialog('price',[
    function(session, args, next)
    {  
        choices=["A sale is on this week", "We have products in several price ranges"];
        session.send(choices[Math.floor(Math.random() * choices.length)] + ", which price range are you looking for?");
        var welcomeCard = new builder.HeroCard(session)
        .buttons([
            builder.CardAction.postBack(session, "40", "Less than $40"),
            builder.CardAction.postBack(session, "60", "$40-$60"),
            builder.CardAction.postBack(session, "80", "$60-$80"),
            builder.CardAction.postBack(session, "80", "Above $80"),
        ]);
        session.beginDialog('validators:price', {
            prompt: session.send(new builder.Message(session)
        .addAttachment(welcomeCard)),
            retryPrompt: session.gettext('Choose one from the given options')
        });

        
        next();     
    },
    function (session, args)
    {
        session.endDialogWithResult(args);
    }

    ]);

function getCardsAttachments(session) {
    output=[];

    categories=[
    {title:"Formal", imageUrl:"http://ecx.images-amazon.com/images/I/71DOBJ7r7bL._UL1500_.jpg"}, 
    {title:"Sports", imageUrl:"http://ecx.images-amazon.com/images/I/71jEqzTCmlL._UL1500_.jpg"}];
    for (i in categories)
    {
        product=categories[i];
        card=new builder.HeroCard(session)
        // .title(product.title)
        // .subtitle("Price: "+product.price + "," + "Size: "+product.size)
        // .text("Quantity: "+product.qty)
        .images([builder.CardImage.create(session, product.imageUrl)])
        .buttons([
            builder.CardAction.imBack(session, product.title + " Shoes", product.title + " Shoes")]);
        output.push(card);
    }
    return output;

}


module.exports.createLibrary = function () {
    return lib.clone();
};