var builder = require('botbuilder');


var lib = new builder.Library('intelligence');



var recognizer = new builder.LuisRecognizer("https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8b32b8d-5d2d-4ebd-9d5f-af666c748b12?subscription-key=011183f533c94864b0117e8c16778824&verbose=true&timezoneOffset=0&q= ");
lib.recognizer(recognizer);

lib.dialog('search', function (session, args)
	{
		console.log('---------------');
		console.log(session.message)
		console.log( builder.EntityRecognizer.findEntity(session.message.text, 'search'));
		// var search = builder.EntityRecognizer.findEntity(args.intent.entities, 'search');
		// if(search)
      });

// lub.dialog('size', );


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};