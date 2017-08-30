var util = require('util');
var builder = require('botbuilder');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xhr = new XMLHttpRequest();
var lib = new builder.Library('shop');



var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8b32b8d-5d2d-4ebd-9d5f-af666c748b12?subscription-key=011183f533c94864b0117e8c16778824&timezoneOffset=0&verbose=true&q=';
var products=[];


lib.dialog('/', [


    function(session, args, next){
        session.message.text=null;
       session.beginDialog('search:/');
        
        
    },


    function (session, args, next) 
    {
        if (session.message.text==="Cart")
        {
            next();
        }
        else if(args.selection==='Modify Selection')
        {
            session.beginDialog('/');
        }
        else
        {
            console.log('------=====FK');
            session.message.text=null;
            // session.beginDialog('prompt1');  
            console.log('------=====FK1');
            var welcomeCard = new builder.Message(session)
            .addAttachment(new builder.HeroCard(session)
            .buttons([
                builder.CardAction.imBack(session, "Shop More", "Shop More"),
                builder.CardAction.imBack(session, "Cart", "Cart")
            ]));

            // if (session.message.text)
            // {
            //     session.endDialog();
            // }
            // else{
            session.beginDialog('validators:cart', {
                prompt: session.send(welcomeCard),
                retryPrompt: session.gettext('Choose from the given options')
            });
            
            // }  
        }
        
    },

    function(session, args, next)
    {
        if (session.message.text==="Cart")
        {
            session.beginDialog('cart:/', {products:products});
        }
        else
        {
            session.beginDialog('/');
        }
    },
    function (session, args, next)
    {

        if (args.response==="Shop More")
        {
            session.beginDialog('/');
        }
        else
        {
            next();
        }
    },
    function (session)
    {
        session.beginDialog('checkout:/');
    },

]);


lib.dialog('prompt1', 
    function (session, args, next) {
                console.log('------=====FK1');
                var welcomeCard = new builder.HeroCard(session)
        .buttons([
            builder.CardAction.imBack(session, "Shop More", "Shop More"),
            builder.CardAction.imBack(session, "Cart", "Cart")
        ]);

        // if (session.message.text)
        // {
        //     session.endDialog();
        // }
        // else{
        session.send(new builder.Message(session)
        .addAttachment(welcomeCard));
        // }
    }

);


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};

var LocalizedRegexCache = {};
function localizedRegex(session, localeKeys) {
    var locale = session.preferredLocale();
    var cacheKey = locale + ":" + localeKeys.join('|');
    if (LocalizedRegexCache.hasOwnProperty(cacheKey)) {
        return LocalizedRegexCache[cacheKey];
    }

    var localizedStrings = localeKeys.map(function (key) { return session.localizer.gettext(locale, key); });
    var regex = new RegExp('^(' + localizedStrings.join('|') + ')', 'i');
    LocalizedRegexCache[cacheKey] = regex;
    return regex;
}