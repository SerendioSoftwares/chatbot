var builder = require('botbuilder');



var lib = new builder.Library('cart');

lib.dialog('/', [
    function (session, args, next) {
        var cards = getCardsAttachments(session);

    // create reply with Carousel AttachmentLayout
        var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);

        session.send(reply);
        next();
    },
    function (session, args) {
        builder.Prompts.text(session, 'ask_recipient_last_name');
    },
    function (session, args) {
        session.dialogData.recipientLastName = args.response;
        session.beginDialog('validators:phonenumber', {
            prompt: session.gettext('ask_recipient_phone_number'),
            retryPrompt: session.gettext('invalid_phone_number')
        });
    },
    function (session, args) {
        session.dialogData.recipientPhoneNumber = args.response;
        session.beginDialog('validators:notes', {
            prompt: session.gettext('ask_note'),
            retryPrompt: session.gettext('invalid_note')
        });
    },
    function (session, args) {
        session.dialogData.note = args.response;
        session.beginDialog('sender');
    },
    function (session, args) {
        session.dialogData.sender = args.sender;
        var details = {
            recipient: {
                firstName: session.dialogData.recipientFirstName,
                lastName: session.dialogData.recipientLastName,
                phoneNumber: session.dialogData.recipientPhoneNumber
            },
            note: session.dialogData.note,
            sender: session.dialogData.sender
        };
        session.endDialogWithResult({ details: details });
    }
]);

// Sender details
var UseSavedInfoChoices = {
    Yes: 'yes',
    No: 'edit'
};

function getCardsAttachments(session) {
    output=[];
    console.log("Building Cart...");
    for (i in session.userData.products)
    {
        product=session.userData.products[i];
        card=new builder.HeroCard(session)
        .title(product.name)
        .subtitle("Price: "+product.price + "\n\n" + "Size: "+product.size)
        .text("Quantity: "+product.qty)
        .images([botbuilder.CardImage.create(session, product.imageUrl)])
        .buttons([
            builder.CardAction.imBack(session, {id:i, action:'edit'}, 'Edit Quantity'),
            builder.CardAction.imBack(session, {id:i, action:'delete'}, "Delete")]);
        output.push(card);
    }
    return output;

    return [
        new builder.HeroCard(session)
            .title('Azure Storage')
            .subtitle('Offload the heavy lifting of data center management')
            .text('Store and help protect your data. Get durable, highly available data storage across the globe and pay only for what you use.')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/storage/media/storage-introduction/storage-concepts.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
            ]),

        new builder.ThumbnailCard(session)
            .title('DocumentDB')
            .subtitle('Blazing fast, planet-scale NoSQL')
            .text('NoSQL service for highly available, globally distributed apps—take full advantage of SQL and JavaScript over document and key-value data without the hassles of on-premises or virtual machine-based cloud database options.')
            .images([
                builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/azure/documentdb/media/documentdb-introduction/json-database-resources1.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/documentdb/', 'Learn More')
            ]),

        new builder.HeroCard(session)
            .title('Azure Functions')
            .subtitle('Process events with a serverless code architecture')
            .text('An event-based serverless compute experience to accelerate your development. It can scale based on demand and you pay only for the resources you consume.')
            .images([
                builder.CardImage.create(session, 'https://azurecomcdn.azureedge.net/cvt-5daae9212bb433ad0510fbfbff44121ac7c759adc284d7a43d60dbbf2358a07a/images/page/services/functions/01-develop.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/functions/', 'Learn More')
            ]),

        new builder.ThumbnailCard(session)
            .title('Cognitive Services')
            .subtitle('Build powerful intelligence into your applications to enable natural and contextual interactions')
            .text('Enable natural and contextual interaction with tools that augment users\' experiences using the power of machine-based intelligence. Tap into an ever-growing collection of powerful artificial intelligence algorithms for vision, speech, language, and knowledge.')
            .images([
                builder.CardImage.create(session, 'https://azurecomcdn.azureedge.net/cvt-68b530dac63f0ccae8466a2610289af04bdc67ee0bfbc2d5e526b8efd10af05a/images/page/services/cognitive-services/cognitive-services.png')
            ])
            .buttons([
                builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/cognitive-services/', 'Learn More')
            ])
    ];
}


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};