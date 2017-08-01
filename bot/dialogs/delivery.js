var builder = require('botbuilder');

var Today = 'today';
var Tomorrow = 'tomorrow';

var lib = new builder.Library('delivery');
lib.dialog('date', [
    // function (session) {
    //     session.send('Here are the options');
    // },
    
    function (session, args) {

        
        console.log(session.dialogData.recipientSize)
        builder.Prompts.choice(session, 'choose_delivery_date', [
            session.gettext(Today),
            session.gettext(Tomorrow)
        ]);
    },
    function (session, args) {
        var deliveryDate = args.response.entity === session.gettext(Today) ? new Date() : new Date().addDays(1);
        session.endDialogWithResult({
            deliveryDate: deliveryDate,
            recipientSize: session.dialogData.recipientSize
        });
    }
]);

// Helpers
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};