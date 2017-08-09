var builder = require('botbuilder');

var lib = new builder.Library('query');
var shop = require('../backend');


const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b1439cf5-bc52-47dc-a1d1-0824ab3c8025?subscription-key=011183f533c94864b0117e8c16778824&timezoneOffset=0&q=';
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
lib.recognizer(recognizer);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.matches('order', (session, args) =>{
   var number=null;
   if(args.entities[0])
   {
   	number = args.entities[0].entity;
   }
   
   orderCheck(session, number);
   session.beginDialog('valid');

})

.matches('billing', (session, args) =>{
   session.send('Our Secure Payment Gateway ensures hassle free payment online. Choose from a range of options including Card Payment, Net Banking or Voucher enchashment. In the event that a problem has arisen during payment, kindly contact our sales team.');
   session.endDialog();
})

.matches('delivery', (session, args) =>{
   session.send('Products ordered from our store will be delivered as soon as possible using our trusted delivery partners. Deliver typically takes between 4-7 days, but might take longer if the delivery address is far away from our major warehouse locations.');
   session.endDialog();
})

.matches('quality', (session, args) =>{
   session.send('All items in our store come from reputed manufacturers, obviating the need for further quality inspection. However, if you are concered with the quality of a product received, you may choose to report it (within the window of 7 days from receiving the product), following which the product may be replaced.');
   session.endDialog();
})

.matches('return', (session, args) =>{
   session.send('Returning the product within 1 week of receiving the order will be accepted without any questions. The warranty for the product is covered by the manufacturer. The store cannot be held responsible for any product related issues post the 1 week return window.');
   session.endDialog();
})

.onDefault((session) => {
	session.send(shop.test());
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
    session.endDialog();
});


lib.dialog('/', intents);




lib.dialog('valid',
[
	function (session, args)
	{
		//Do using prompts

        session.beginDialog('validators:email', {
            prompt: session.gettext('What is your Email ID?'),
            retryPrompt: session.gettext('Invalid Email Address, please re-enter.')
        });


	},
	function (session ,args)
	{
		session.userData.email=session.message.text;
		session.beginDialog('order');
	},
	function (session)
	{
		session.endDialog();
	}
]);

lib.dialog('order',
[
	function (session, args, next)
	{
		response=session.message.text;
		console.log(session.userData.order);
		if (session.userData.order===null)
		{	
			//fetch order details
			
			session.beginDialog('list');

		}
		else
		{
			next();
		}

	},
	function (session, args, next)
	{
		//Display order ID details

		session.send("Order ID details");

		var welcomeCard = new builder.HeroCard(session)
            .buttons([
            	builder.CardAction.imBack(session, "Report Problem", "Report Problem"),
                builder.CardAction.imBack(session, "Check Another Order", "Check Another Order"),
                builder.CardAction.imBack(session, "Done", "Done"),   
            ]);


         session.beginDialog('validators:problem', {
            prompt:  session.send(new builder.Message(session).addAttachment(welcomeCard)),
            retryPrompt: session.gettext('Please choose a valid input')
        });

		
	},

	function (session, args, next)
	{
		if (session.message.text==="Report Problem")
		{
			next();//pull up Order
		}
		else if (session.message.text==="Done")
		{
			next();//No change
		}
		else
		{
			session.userData.order=null;
			session.beginDialog('order');	
		}
		
	},
	function (session)
	{
		session.endDialog();
	}
]);


lib.dialog('list',
	[
		function (session, args, next)
		{
			session.send("Here are you previous orders:");

			orders=[
			{orderId:"1234", products:[
{name:'Alestino Formal Shoes (41 UK) For Men Leather Look Shoes FV22Black',  imageUrl: 'http://ecx.images-amazon.com/images/I/81kkGQpnJtL._UL1500_.jpg', price: 99, qty:1},
{name:'Tamarac by Slippers International 7161 Men\'s Camper Moccasin ',  imageUrl: 'http://ecx.images-amazon.com/images/I/61A5BN1Q1CL._UL1500_.jpg', price: 99, qty:5},
]}
			];

			session.send('Done');
			next();
		},
		function (session)
		{
			builder.Prompts.text(session, "Which order do you wish to pull up?");
		},
		function (session, args)
		{
			session.userData.order=session.message.text;
			session.endDialog();
		}

	]);



function orderCheck (session, input)
{

	//Check if in DB, yes= Set session order data
	session.userData.order=input;
	console.log(session.userData.order);
	//No= Do not set session order data

}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};




