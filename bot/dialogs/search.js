var builder = require('botbuilder');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();

// Main dialog with LUIS
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8b32b8d-5d2d-4ebd-9d5f-af666c748b12?subscription-key=011183f533c94864b0117e8c16778824&timezoneOffset=0&verbose=true&q=';

var lib = new builder.Library('search');

lib.dialog('/', [

    function(session, args, next){
        
        var cards = getCardsAttachments(session);

        var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);


        session.beginDialog('validators:category', {
            prompt: session.send(reply),
            retryPrompt: session.gettext('Choose one from the given categories')
        });
        next();     

        
        
        
    },
    
        // Category selected
    function (session, args, next) {
       
        // session.send('choose_bouquet_from_category', category);
        session.dialogData.category = session.message.text;
        session.message.text = null;            // remove message so next step does not take it as input
        session.send("What size are you?")
        next();
    },
    function (session) {
        var welcomeCard = new builder.HeroCard(session)
        .buttons([
            builder.CardAction.imBack(session, "8", "8"),
            builder.CardAction.imBack(session, "9", "9"),
            builder.CardAction.imBack(session, "10", "10"),
            builder.CardAction.imBack(session, "11", "11"),
            builder.CardAction.imBack(session, "12", "12"),
        ]);
        session.beginDialog('validators:size', {
            prompt: session.send(new builder.Message(session)
        .addAttachment(welcomeCard)),
            retryPrompt: session.gettext('Choose one between 8 and 12')
        });
        
    },
    function (session, args, next) {
        session.dialogData.recipientSize=args.response;
        console.log("------------")
        console.log(session.userData.category)

        session.send("What Price range are you in for?");
        var welcomeCard = new builder.HeroCard(session)
        .buttons([
            builder.CardAction.imBack(session, "40", "Less than $40"),
            builder.CardAction.imBack(session, "60", "$40-$60"),
            builder.CardAction.imBack(session, "80", "$60-$80"),
            builder.CardAction.imBack(session, "80", "Above $80"),
        ]);
        session.beginDialog('validators:price', {
            prompt: session.send(new builder.Message(session)
        .addAttachment(welcomeCard)),
            retryPrompt: session.gettext('Choose one from the given options')
        });
        

        

        
    },
    function (session, args, next) {
    	session.dialogData.priceRange=args.response;

        // Retrieve address, continue to shop

        // xhr.open("GET", model+session.dialogData.search, false);
        // xhr.send(xhr.responseText);
        // console.log(xhr.responseText)
        // var json = JSON.parse(xhr.responseText);
        // input=json["entities"][0]["entity"];
        // session.message.text=input;
        // var search = builder;

        session.beginDialog('product-selection:/', {category: session.dialogData.category, size : session.dialogData.recipientSize, price : session.dialogData.priceRange});
    },
    function (session, args, next) {
        // Logic for cart push and update duplicates
        console.log('-----');
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
]);




lib.dialog('prompt1', 
	function (session, args, next) {
		        console.log('------=====FK1');
		        var welcomeCard = new builder.HeroCard(session)
        .buttons([
            builder.CardAction.imBack(session, "Shop More", "Shop More"),
            builder.CardAction.imBack(session, "Cart", "Cart")
        ]);

		if (session.message.text)
		{
			session.endDialog();
		}
		else{
        session.send(new builder.Message(session)
        .addAttachment(welcomeCard));
    	}
	}

);



function getCardsAttachments(session) {
    output=[];

    categories=[
    {title:"Formal", imageUrl:"https://img2.cgtrader.com/items/14184/83c0a31caa/formal-shoes-3d-model-max-obj-3ds-c4d.jpg"}, 
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