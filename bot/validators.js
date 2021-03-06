var builder = require('botbuilder');
var _ = require('lodash');

// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xhr = new XMLHttpRequest();
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8b32b8d-5d2d-4ebd-9d5f-af666c748b12?subscription-key=011183f533c94864b0117e8c16778824&timezoneOffset=0&verbose=true&q=';
var shop = require('./backend')

var PhoneRegex = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/);
var EmailRegex = new RegExp(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

var lib = new builder.Library('validators');


lib.dialog('cart', basicPrompterWithExpression(function (input) {
    return (input==="Cart" || input==="Shop More");
}));

lib.dialog('qty', basicPrompterWithExpression(function (input, check) {
    return (input>0 && input<=check);
}));

lib.dialog('category', basicPrompterWithExpression(function (input, check) {
    output=check;
    console.log("-----");
    // console.log(check);
    categories=[];
    for (i in output)
    {
        categories.push(output[i].name)
    }
    console.log(categories);
    return (categories.indexOf(input) > -1);
}));

lib.dialog('attributes', basicPrompterWithExpression(function (input, check){
    output=check;
    // console.log(check);
    categories=[]
    for (i in output)
    {
        categories.push(output[i].name)
    }
    console.log(categories);
    return (categories.indexOf(input) > -1);
}));

lib.dialog('options', basicPrompterWithExpression(function (input, check){
    return (check.indexOf(input) > -1);
}));


lib.dialog('problem', basicPrompterWithExpression(function (input) {
    return (input==="Done" || input==="Report Problem" || input==="Check Another Order");
}));

lib.dialog('modify', basicPrompterWithExpression(function (input, check) {
    console.log(input)
    if (input==='Done')
    {
        return true;
    }
    else
    {
        var input=JSON.parse(input);
        console.log(input);
        console.log(check[0].name);

        var flag = false;
        for (i in check)
        {
            if (check[i].name===input.name)
            {
                flag=true;
            }
        }
        console.log(flag);
    }
    return (((input.action==='Edit' || input.action==='Delete')&&(flag)))
}));

lib.dialog('phonenumber', basicPrompterWithRegex(PhoneRegex));

lib.dialog('email',  basicPrompterWithRegex(EmailRegex));



function basicPrompterWithRegex(regex) {
    return new builder.IntentDialog()
        .onBegin(function (session, args) {
            session.dialogData.retryPrompt = args.retryPrompt;
            session.send(args.prompt);
        }).matches(regex, function (session) {
            session.endDialogWithResult({ response: session.message.text });
        }).onDefault(function (session) {
            session.send(session.dialogData.retryPrompt);
        });
}


function basicPrompterWithExpression(expression) {
    return new builder.IntentDialog()
        .onBegin(function (session, args) {
            session.dialogData.retryPrompt = args.retryPrompt;
            session.dialogData.check=args.check;
            session.send(args.prompt);
        }).onDefault(function (session, args) {
            console.log(args);
            var input = session.message.text;
            if (expression(input, session.dialogData.check)) {
                session.endDialogWithResult({ response: input });
            } else {
                session.send(session.dialogData.retryPrompt);
            }
        });
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};

module.exports.PhoneRegex = PhoneRegex;
module.exports.EmailRegex = EmailRegex;





// Add to cart -> icon

// You've selected:
// name
// size



// Where would you like these shoes to be shipped. Specify full address with and building number, locality and zip- code

