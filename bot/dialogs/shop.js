var util = require('util');
var builder = require('botbuilder');
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xhr = new XMLHttpRequest();
var lib = new builder.Library('shop');
var cards = require('../cards');



var products=[];


lib.dialog('/', [
    function(session, args, next)
    {
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
            options = ['Shop More', 'Cart'];
            var reply = cards.buttons(session, options);
            session.beginDialog('validators:options', {
                prompt: session.send(reply),
                retryPrompt: session.gettext('Choose from the given options'),
                check: options
            });    
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