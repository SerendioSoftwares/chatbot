var builder = require('botbuilder');
var shop = require('../backend');
var cards = require('../cards');
var _ = require('lodash');

var lib = new builder.Library('search');


// shop.categories();

lib.dialog('/', [

    function(session, args, next){ 
        shop.woo_categories().then(function (categories)
        {
            session.beginDialog('category', {categories:categories});
        });
    },

    function (session, args, next) 
    {
        shop.woo_products(args.category_id).then(function (products)
        {
            session.beginDialog('product-selection:/', {products: products});
        });
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
            shop.woo_variations(args.selected).then(function (variations)
            {
                session.beginDialog('product-selection:variation', {variations: variations})
            });
        }
        else
        {
            next();
        }
    },

    function (session, args, next) 
    {
        parent=session.dialogData.selected;//store parent
        console.log(args)
        if(args.selected)
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
        if (parent.attributes.length>0)
        {
            session.beginDialog('attributes', {attributes:parent.attributes, current:0});
        }
        else
        {
            next();
        }

    },

    function (session, args, next)
    {

        // Logic for cart push and update duplicates
        
        session.dialogData.selected.attributes=session.userData.attributes;
        
        temp=''; //For attributes
        for (i in session.userData.attributes)
        {
            attribute=session.userData.attributes[i];
            temp+=attribute.name+': '+attribute.option+'\n\n'
        }

        session.send("You've selected: \n\n Name: "+session.dialogData.selected.name + "\n\n" + temp + "Price: $" + session.dialogData.selected.price );
        flag=false;
        temp=null;

        for (i in session.userData.products)
        {
        	if(session.userData.products[i].name===session.dialogData.selected.name && _.isEqual(session.userData.products[i].attributes, session.dialogData.selected.attributes))
        	{
        		flag=true;//Existing Product
        		temp=i;
        	}
        }
        if (flag)//Product exists
        {
            if(session.dialogData.selected.stock>session.userData.products[temp].qty)
        	{
                session.userData.products[temp].qty+=1;
            }
            else//if stock does not exist for adding more product.
            {
                session.send("Sorry! Cannot add one more of the selected since the our stock is out.")
            }
            
        }
        else//new product for cart
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

        session.dialogData.attr=args.attributes;//Total attributes
        session.dialogData.current=args.current;//Current attribute in focus
        if(session.dialogData.attr[session.dialogData.current].variation===true)
        {
            next();
        }

        else
        {
            session.send("What " +session.dialogData.attr[session.dialogData.current].name+" would you like?");

            var reply = cards.buttons(session, session.dialogData.attr[session.dialogData.current].options);
            console.log('=====')
            console.log(reply);
            session.beginDialog('validators:options', {
                prompt: session.send(reply),
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
            // console.log(session.userData)
            temp={
                'id' : session.dialogData.attr[session.dialogData.current].id,
                'name': session.dialogData.attr[session.dialogData.current].name,
                'option' : session.message.text
                }
            
            session.userData.attributes.push(temp);
            // console.log(session.userData);
        }
        if (!session.dialogData.attr[session.dialogData.current+1])//If Next attribute does not exist- end
        {
            session.endDialog();
        }

        else//call dialog again with increased current counter
        {
            console.log(session.dialogData.current)
            session.beginDialog('attributes', {attributes:session.dialogData.attr, current:session.dialogData.current+1});
        }
    }
]);



lib.dialog('category',[

    function(session, args, next)
    {   
        session.dialogData.categories=args.categories;
        var reply = cards.carousel(session, session.dialogData.categories);
        session.beginDialog('validators:category', {
            prompt: session.send(reply),
            retryPrompt: session.gettext('Choose one from the given categories'),
            check: session.dialogData.categories
        });
    },

    function (session, args)
    {//Identify category from name 
        category = _.find(session.dialogData.categories, function (o) { return o.name ===session.message.text; });
        session.endDialogWithResult({category_id : category.id});//send out it's id as arguement to parent dialog
    }

]);


module.exports.createLibrary = function () {
    return lib.clone();
};