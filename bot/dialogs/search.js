var builder = require('botbuilder');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();

// Main dialog with LUIS
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8b32b8d-5d2d-4ebd-9d5f-af666c748b12?subscription-key=011183f533c94864b0117e8c16778824&timezoneOffset=0&verbose=true&q=';

var lib = new builder.Library('search');

lib.dialog('/', [

    function(session, args, next){
        
        builder.Prompts.text(session, "What would you like?");
        
        
    },
    function (session) {
    	session.dialogData.search=session.message.text;
        session.beginDialog('validators:size', {
            prompt: session.gettext('What size would you like?'),
            retryPrompt: session.gettext('Choose one between 8 and 12')
        });
    },
    function (session, args, next) {
    	session.dialogData.recipientSize=args.response;
        // Retrieve address, continue to shop

        xhr.open("GET", model+session.dialogData.search, false);
        xhr.send(xhr.responseText);
        console.log(xhr.responseText)
        var json = JSON.parse(xhr.responseText);
        input=json["entities"][0]["entity"];
        session.message.text=input;
        var search = builder;
        // console.log("result");
        // console.log(search);
        // search = args.response;
        session.message.search=search;
        session.beginDialog('product-selection:/', {size : session.dialogData.recipientSize});
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
module.exports.createLibrary = function () {
    return lib.clone();
};