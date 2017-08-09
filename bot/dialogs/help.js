var shop = require('../backend');
var builder = require('botbuilder');

var lib = new builder.Library('help');


lib.dialog('/',[ 
	function (session, args, next)
	{
		session.send( "Type in your Query to get help. \n\n Alternately type in \"order\" or your Order ID to review past orders.");
		next();
	},
	function (session, args)
	{


		session.beginDialog('query:/');

	},
	function (session, args)
	{
		var welcomeCard = new builder.Message(session).addAttachment(new builder.HeroCard(session)
        	.buttons([
            builder.CardAction.imBack(session, "Other Query", "Other Query"),
            builder.CardAction.imBack(session, "Restart", "Back")
        ]));

        builder.Prompts.text(session, welcomeCard);	
    },
    function (session, args, next)
    {
    	console.log('----------------------');
		if (session.message.text==='Begin Shopping!')
		{
			session.endDialog();
		}
		else
		{
        	session.replaceDialog('/');
        }
	}
	
]);

// lib.dialog('query',
// [
// 	function (session, args)
// 	{
//         var foodNameEntity = builder.EntityRecognizer.findEntity(args.entities, 'foodName');
// 	},

// 	function (session)
// 	{

// 	}
// ]);

// lib.dialog('order',[
// 	function (session, args)
// 	{
// 		builder.Prompt.text(session, "Enter your Email Id for Customer Verification.");
// 	},
// 	function (session)
// 	{
// 		builder.Prompt.text(session, "");
// 	}
// ]);

// lib.dialog('reprompt',[
	
// 		//ask question or start shopping
	
// 	]);
// function check_option(input)
// {
// 	1:order = 'inherit'
// 	2:orderID
// 	3:Query
// }


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};