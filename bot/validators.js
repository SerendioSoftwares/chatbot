var builder = require('botbuilder');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
var model = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/e8b32b8d-5d2d-4ebd-9d5f-af666c748b12?subscription-key=011183f533c94864b0117e8c16778824&timezoneOffset=0&verbose=true&q=';


var PhoneRegex = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/);
var EmailRegex = new RegExp(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);

var lib = new builder.Library('validators');

lib.dialog('notes', basicPrompterWithExpression(function (input) {
    return input && input.length <= 200;
}));

lib.dialog('size', basicPrompterWithExpressionSize(function (input) {
    return input < 13 && input > 7;
}));

lib.dialog('price', basicPrompterWithExpression(function (input) {
    return (input>30 && input<120);
}));

lib.dialog('qty', basicPrompterWithExpression(function (input) {
    return (input>0 && input<11);
}));

lib.dialog('category', basicPrompterWithExpression(function (input) {
    return (input==="Formal Shoes" || input==="Sports Shoes");
}));

lib.dialog('phonenumber', basicPrompterWithRegex(PhoneRegex));

lib.dialog('email', basicPrompterWithRegex(EmailRegex));

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

function basicPrompterWithExpressionSize(expression) {
    return new builder.IntentDialog()
        .onBegin(function (session, args) {
            // console.log(session);
            
            session.dialogData.retryPrompt = args.retryPrompt;
            session.send(args.prompt);
        }).onDefault(function (session) {
            var input = session.message.text;
            // xhr.open("GET", model+input, false);
            // xhr.send(xhr.responseText);
            // console.log("ffffiu");
            // console.log(xhr.responseText)
            // var json = JSON.parse(xhr.responseText);
            // input=json["entities"][0]["entity"];
            // console.log(input);
            if (expression(input)) {
                session.endDialogWithResult({ response: input });
            } else {
                session.send(session.dialogData.retryPrompt);
            }
        });
}


function basicPrompterWithExpression(expression) {
    return new builder.IntentDialog()
        .onBegin(function (session, args) {
            session.dialogData.retryPrompt = args.retryPrompt;
            session.send(args.prompt);
        }).onDefault(function (session) {
            var input = session.message.text;
            if (expression(input)) {
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