var builder = require('botbuilder');
var shop = require('../backend');
var _ = require('lodash');

// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// var xhr = new XMLHttpRequest();

// Main dialog with LUIS

var lib = new builder.Library('search');


// shop.categories();

lib.dialog('/', [

    function(session, args, next){
        shop.woo().get('products/categories',  function(err, data, res) {
            console.log("Fetched Categories");
            categories=JSON.parse(res);
            session.beginDialog('category', {categories:categories});         
        });     
    },
    
        // Category selected
    // function (session, args, next) {

    //     session.userData.attributes=[];
    //     shop.woo().get('products/attributes',  function(err, data, res) {
    //         attr=JSON.parse(res);
    //         session.beginDialog('attributes', {attr:attr, current:0});
    //     });
    // },



    function (session, args, next) 
    {
        session.beginDialog('product-selection:/', {category: session.userData.category});
    },
    function(session, args, next)
    {
        session.userData.attributes=[];
        session.dialogData.selected=args.selected;
        if(!args.selected)
        {
            session.replaceDialog('/');
        }
        else if(args.selected.variations.length>1)
        {
            session.beginDialog('product-selection:variation', {parent:args.selected})
        }
        else
        {
            next();
        }
    },
    function (session, args, next) 
    {
        parent=session.dialogData.selected;//store parent
        
        if(args)
        {
            
            session.dialogData.selected=args.selected;
            session.dialogData.selected.name=parent.name;
            if(!session.dialogData.selected.price)
            {
                session.dialogData.selected.price=parent.price;
            }
            if(!session.dialogData.selected.stock)
            {
                session.dialogData.selected.stock=parent.stock;
            }

            
        }
        else
        {
            parent.image=parent.images[0];
        }

        session.beginDialog('attributes', {attributes:parent.attributes, current:0});

    },

    // function (session, args, next)
    // {
    //     session.userData.attributes=[];
    //     shop.woo().get('products/attributes',  function(err, data, res) {
    //         attr=JSON.parse(res);
    //         session.beginDialog('attributes', {attr:attr, current:0});

    // },

    function (session, args, next)
    {



        // Logic for cart push and update duplicates



        
        session.dialogData.selected.attributes=session.userData.attributes;
        
        temp=''; //For attributes
        for (i in session.userData.attributes)
        {
            attribute=session.userData.attributes[i];
            temp+=attribute.name+' : '+attribute.option+'\n\n'
        }

        session.send("You've selected: \n\n Name: "+session.dialogData.selected.name + "\n\n" + temp + "Price: $" + session.dialogData.selected.price );
        flag=false;
        temp=null;
        if(session.userData.products[0])
        {
        console.log(session.userData.products[0].name)
        console.log(session.userData.products[0].attributes)
        }
        console.log(session.dialogData.selected.name)
        console.log(session.dialogData.selected.attributes)
        for (i in session.userData.products)
        {
        	if(session.userData.products[i].name===session.dialogData.selected.name && _.isEqual(session.userData.products[i].attributes, session.dialogData.selected.attributes))
        	{
                console.log('0000000000000111111111111111111111');
        		flag=true;
        		temp=i;
        	}
        }
        if (flag)
        {
            if(session.dialogData.selected.stock>session.userData.products[temp].qty)
        	{
                session.userData.products[temp].qty+=1;
            }
            else
            {
                session.send("Sorry! Cannot add one more of the selected since the our stock is out.")
            }
            
        }
        else
        {
            session.dialogData.selected.qty=1;
        	session.userData.products.push(session.dialogData.selected);
        }


        session.endDialog();
    
    }
]);



lib.dialog('attributes',[
    function (session, args, next)
    {
        console.log('9191230932109')
        console.log(args.attributes)
        choices=["We have some wonderful choices.", "A new range of products are in."];
        

        session.dialogData.attr=args.attributes;
        session.dialogData.current=args.current;
        if(session.dialogData.attr[session.dialogData.current].variation===true)
        {
            next();
        }

        else
        {

            session.send("What " +session.dialogData.attr[session.dialogData.current].name+" would you like?");
            var welcomeCard = new builder.HeroCard(session)
            .buttons(getButtonAttachments(session, session.dialogData.attr[session.dialogData.current].options));

            session.beginDialog('validators:options', {
                prompt: session.send(new builder.Message(session).addAttachment(welcomeCard)),
                retryPrompt: session.gettext('Please choose a valid option.'),
                check: session.dialogData.attr[session.dialogData.current].options
            });
        }
    },

    function (session, args, next)
    {
        if(!session.dialogData.attr[session.dialogData.current].variation===true)
        {
            for (i in session.dialogData.options)
            {
                if (session.dialogData.options[i].name===session.message.text)
                {
                    var id=session.dialogData.options[i].id;
                }
            }
            console.log(session.userData)
            temp={
                'id' : session.dialogData.attr[session.dialogData.current].id,
                'name': session.dialogData.attr[session.dialogData.current].name,
                'option' : session.message.text
                }
            
            session.userData.attributes.push(temp);
            console.log(session.userData);
            console.log('-----=============--------')
        }
        if (!session.dialogData.attr[session.dialogData.current+1])
        {
            session.endDialog();
        }

        else
        {
            console.log(session.dialogData.current)
            session.beginDialog('attributes', {attributes:session.dialogData.attr, current:session.dialogData.current+1});
        }
    }
]);



lib.dialog('category',[


    function(session, args, next)
    {   session.message.text=null;
        // WooCommerce.getAsync('products/categories').then( function(result) {
        //     console.log(JSON.parse(result));
        //     categories=JSON.parse(result);
        // });

        // categories=shop.result('categories');
        session.dialogData.categories=args.categories;
        // session.beginDialog('woo_category');
        var cards = getCardsAttachments(session, session.dialogData.categories);
        
        var reply = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(cards);


        session.beginDialog('validators:category', {
            prompt: session.send(reply),
            retryPrompt: session.gettext('Choose one from the given categories'),
            check: categories
        });
    },
    function (session, args)
    {
        for (i in session.dialogData.categories)
        {
            if (session.dialogData.categories[i].name===session.message.text)
            {
                var id=session.dialogData.categories[i].id;
            }
        }
        temp={'id': id, 'name' : session.message.text};
        session.userData.category=temp
        session.endDialog(args);
    }

]);



// lib.dialog('size',[
//     function(session, args, next)
//     {   
//         choices=["We have some wonderful choices", "A new range of products are in"];
//         session.send(choices[Math.floor(Math.random() * choices.length)] + ", what Size would you like?");
        
//         var welcomeCard = new builder.HeroCard(session)
//         .buttons(getButtonAttachments([8,9,10,11,12]));
//         session.beginDialog('validators:size', {
//             prompt: session.send(new builder.Message(session).addAttachment(welcomeCard)),
//             retryPrompt: session.gettext('Choose one between 8 and 12')
//         });
//     },
//     function (session, args)
//     {
//         session.endDialogWithResult(args);
//     }

//     ]);



function getCardsAttachments(session, categories) {
    output=[];
    
    for (i in categories)
    {
        // console.log(categories[i]);

        category=categories[i];
        card=new builder.HeroCard(session)
        // .title(product.title)
        // .subtitle("Price: "+product.price + "," + "Size: "+product.size)
        // .text("Quantity: "+product.qty)
        .images([builder.CardImage.create(session, category.image.src)])
        .buttons([
            builder.CardAction.imBack(session, category.name, category.name)]);
        output.push(card);
    }        

    return output
        

}

function getButtonAttachments(session, options) {
    output=[];
    console.log('HEre Me Noo')
    for (i in options)
    {
        button=builder.CardAction.imBack(session, options[i], options[i])
        output.push(button);
    }        
    console.log(options)
    return output
        
}


module.exports.createLibrary = function () {
    return lib.clone();
};