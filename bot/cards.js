var builder = require('botbuilder');


//Generic Cards moved here
function cards(session, input) 
{
    output=[];
    for (i in input)
    {
        current=input[i];
        card=new builder.HeroCard(session)
        .images([builder.CardImage.create(session, current.image.src)])
        .buttons([builder.CardAction.imBack(session, current.name, current.name)]);
        output.push(card);
    }        
    return output    
}

function cards_cart(session, input) 
{
    output=[];

    for (i in input)
    {	
    	console.log(current)
    	current=input[i];
    	console.log(current)
    	attribute='';
    	for (j in current.attributes)
    	{
    		attribute+=current.attributes[j].name+': '+current.attributes[j].option+', ';
    	}
    	if(attribute!='')
    	{	
    		attribute=attribute.substr(0, attribute.length - 2);
        }
        
        card=new builder.HeroCard(session)
        .title(current.name)
        .subtitle(attribute)
        .text("Price: $"+current.price + ", Quantity: "+current.qty)
        .images([builder.CardImage.create(session, current.image.src)])
        .buttons([
            builder.CardAction.postBack(session, '{"action":"Edit", "id":'+ i + ', "name":\"'+ current.name+'\"}', 'Edit Quantity'),
            builder.CardAction.postBack(session, '{"action":"Delete", "id":'+ i + ', "name":\"'+ current.name+'\"}', 'Delete')
            ]);
        output.push(card);
    }        
    return output    
}

function button_prelim(session, input)
{
	output=[];
    for (i in input)
    {
        button=builder.CardAction.imBack(session, input[i], input[i])
        output.push(button);
    }
    return output;
}

function createReceiptCard(session) {
    output=[];
    total=0;
    for (i in session.userData.products)
    {
        product=session.userData.products[i];
        card=builder.ReceiptItem.create(session, "$ "+ product.price, product.name +' ('+product.qty+')')
            .image(builder.CardImage.create(session, product.image.src));
        output.push(card);
        total+=product.price*product.qty;

    }
    session.userData.total=total;//for checkout
    return new builder.ReceiptCard(session)
        .title("Order No: 1234")
        .facts([
            // builder.Fact.create(session, name, 'Name'),
            builder.Fact.create(session, 'Debit/Credit Card', 'Payment Method')
        ])
        .items(output)
        .tax('$ 0')
        .total('$ '+total.toFixed(2))
    ;
}

module.exports = {

    carousel: function (session, input) 
    {

        return new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards(session, input))

    },
    carousel_cart: function (session, input)
    {
    	temp = cards_cart(session, input);
        return new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(temp)

    },
    buttons: function (session, input) 
    {
	    return new builder.Message(session).
        addAttachment(new builder.HeroCard(session)
        .buttons(button_prelim(session, input)));

    },

    receipt: function (session)
    {
    	return new builder.Message(session)
                .addAttachment(createReceiptCard(session))
    }

}