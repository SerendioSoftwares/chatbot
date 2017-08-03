var builder = require('botbuilder');

var lib = new builder.Library('help');
lib.dialog('/',[ 
	function (session)
	{
		builder.Prompts.text(session, "Type in your Query to get help. \n\n Alternately type in \"order\" or your Order Id to review past orders.");
	},
	function (session, args)
	{

		// session.dialogData.response=session.message.text;
		// check_option(session.message.)//verfication
		// 1:order/ID 
		// 2:Query
	},


]);

// lib.dialog('query',
// [
// 	function (session)
// 	{

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
// 	function (session, args, next) {
// 		console.log('------=====FK1');
// 		var welcomeCard = new builder.HeroCard(session)
//         	.buttons([
//             builder.CardAction.imBack(session, "Other Query", "Other Query"),
//             builder.CardAction.imBack(session, "Begin Shopping!", "Begin Shopping!")
//         ]);

// 		if (session.message.text)
// 		{
// 			session.endDialog();
// 		}
// 		else
// 		{
//         session.send(new builder.Message(session)
//         .addAttachment(welcomeCard));
//     	}
// 	}
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