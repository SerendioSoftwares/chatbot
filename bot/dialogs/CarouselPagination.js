var builder = require('botbuilder');

var defaultSettings = {
    showMoreTitle: 'title_show_more',
    showMoreValue: 'show_more',
    selectTemplate: 'select',
    pageSize: 10,
    unknownOption: 'unknown_option'
};

module.exports = {
    create: function (getPageFunc, getItemFunc, itemToCardFunc, settings) {
        // parameter validation
        settings = Object.assign({}, defaultSettings, settings);
        if (typeof getPageFunc !== 'function') {
            throw new Error('getPageFunc must be a function');
        }

        if (typeof getItemFunc !== 'function') 
        {
            throw new Error('getItemFunc must be a function');
        }

        if (typeof itemToCardFunc !== 'function') {
            throw new Error('itemToCardFunc must be a function');
        }

        // map item info into HeroCard
        var asCard = function (session, cardInfo) {
            console.log(cardInfo)
            var card = new builder.HeroCard()
                .title(cardInfo.title)
                .buttons([
                    new builder.CardAction()
                        .type('imBack')
                        .value(session.gettext(settings.selectTemplate) + cardInfo.title )
                        .title(session.gettext(cardInfo.buttonLabel))
                ]);

            if (cardInfo.subtitle) {
                console.log(Math.floor(Math.random()*10));
                if (session.userData.money==="40")
                {
                    console.log("Works----");

                    card = card.subtitle('$' + 40-Math.floor(Math.random() * 10));
                }
                else 
                {
                    temp=(parseInt(session.userData.money) + Math.floor(Math.random() * 10))
                    card=card.subtitle('$' + temp)
                }
            }

            if (cardInfo.imageUrl) {
                card = card.images([new builder.CardImage().url(cardInfo.imageUrl).alt(cardInfo.title)]);
            }

            return card;
        };

        // return dialog handler funciton
        return function (session, args, next) {
            var pageNumber = session.dialogData.pageNumber || 1;
            var input = session.message.text;
            console.log('KKKK-----KKKK');
            console.log(input);
            var selectPrefix = session.gettext(settings.selectTemplate);
            if (input && input.toLowerCase() === session.gettext(settings.showMoreValue).toLowerCase()) {
                // next page
                pageNumber++;
            }
            else if(input==='Modify Selection' )
            {
                return next({selected:input})
            } 

            else if (input && isSelection(input, selectPrefix)) {
                // Validate selection
                var selectedName = input.substring(selectPrefix.length);
                getItemFunc(selectedName).then(function (selectedItem) {
                    if (!selectedItem) {
                        return session.send(settings.unknownOption);
                    }

                    // reset page
                    session.dialogData.pageNumber = null;

                    // return selection to dialog stack
                    return next({ selected: selectedItem });
                });


                return;
            }

            // retrieve from service and send items
            getPageFunc(pageNumber, settings.pageSize).then(function (pageResult) {
                // save current page number
                session.dialogData.pageNumber = pageNumber;

                // items carousel
                var cards = pageResult.items
                    .map(itemToCardFunc)
                    .map(function (cardData) { return asCard(session, cardData); });
                var message = new builder.Message(session)
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(cards);
                session.send(message);

                // more items link
                if (pageResult.totalCount > pageNumber * settings.pageSize) {
                    var moreCard = new builder.HeroCard(session)
                        // .title(settings.showMoreTitle)
                        .buttons([
                            builder.CardAction.imBack(session, session.gettext(settings.showMoreValue), settings.showMoreValue),
                            builder.CardAction.imBack(session, 'Modify Selection' , 'Modify Selection'),
                            // builder.CardAction.imBack(session, 'Change Category' , 'Change Category'),
                            // builder.CardAction.imBack(session, 'Change Size' , 'Change Size'),
                            // builder.CardAction.imBack(session, 'Change Price Range' , 'Change Price Range')

                        ]);
                    session.send(new builder.Message(session).addAttachment(moreCard));
                }
                else
                {
                     var moreCard = new builder.HeroCard(session)
                        // .title(settings.showMoreTitle)
                        .buttons([
                            builder.CardAction.imBack(session, 'Modify Selection' , 'Modify Selection'),                            // builder.CardAction.imBack(session, 'Change Category' , 'Change Category'),
                            // builder.CardAction.imBack(session, 'Change Size' , 'Change Size'),
                            // builder.CardAction.imBack(session, 'Change Price Range' , 'Change Price Range')

                        ]);
                    session.send(new builder.Message(session).addAttachment(moreCard));
                }
            });
        };
    }
};

function isSelection(input, selectPrefix) {
    return input.toLowerCase().indexOf(selectPrefix.toLowerCase()) === 0;
}