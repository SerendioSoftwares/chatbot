var _ = require('lodash');
var builder = require('botbuilder');
var products = require('../../services/products');
var SimpleWaterfallDialog = require('./SimpleWaterfallDialog');
var CarouselPagination = require('./CarouselPagination');
var shop = require('../backend');
var cards = require('../cards');

var carouselOptions = {
    showMoreTitle: 'title_show_more',
    showMoreValue: 'show_more',
    selectTemplate: 'select',
    pageSize: 5,
    unknownOption: 'unknown_option'
};

var lib = new builder.Library('product-selection');



lib.dialog('/',
    new SimpleWaterfallDialog([
        // First message
        function (session, args, next) 
        {
            console.log(cards);
            session.dialogData.products=args.products;

            choices=["Here are some products based on the choices you've made, hope you like them.", "Here are some products matching your requirements, hope you like them."];
            session.send(choices[Math.round(Math.random() * choices.length)]); 
            next();
            
        },

        // Show Products
        function (session, args, next) {
            CarouselPagination.create(
                function (pageNumber, pageSize) { return products.getProducts(session.dialogData.products, pageNumber, pageSize); },
                products.getProduct,
                productMapping,
                carouselOptions
            )(session, args, next);
            // next();
        },
        // Product selected
        function (session, args, next) {
            console.log('Selected-----------------------');
            console.log(args.selected);
            if(args.selected==='Modify Selection')
            {
                session.endDialog();
            }
            else
            {
                args.selected.qty=1;
                // this is last step, calling next with args will end in session.endDialogWithResult(args)
                next({ selected: args.selected });
            }
        }
]));


lib.dialog('variation', [
    function (session, args, next)
    {
        session.dialogData.variations = args.variations;
        console.log(args.variations)
        session.send("Variations of the selected product are available...")
        next();
    },
    function (session, args, next)
    {
        
        session.dialogData.variations= rename(session.dialogData.variations);

        var cards = require('../cards');
        var reply = cards.carousel(session, session.dialogData.variations);

        session.beginDialog('validators:attributes', {
            prompt: session.send(reply),
            retryPrompt: session.gettext('Choose one from the given options'),
            check: session.dialogData.variations
        });
    },
    function(session, args,next)
    {
        selected=_.find(session.dialogData.variations, function (o) { return o.name ===session.message.text;});
        for (i in selected.attributes)//store attributes of the variation selected
        {
            temp={
                'id':selected.attributes[i].id,
                'name':selected.attributes[i].name,
                'option':selected.attributes[i].option
            }
            session.userData.attributes.push(temp)
        }
        
        selected=_.find(session.dialogData.variations, function (o) { return o.name ===session.message.text;});
        session.endDialogWithResult({selected:selected});
    }

]);





function rename( products) {
    cards=[];
    products_temp=[]//new product list with title
    for (i in products)
    {
        // console.log(categories[i]);

        product=products[i];
        products_temp[i]=product;

        name=''
        for (j in product.attributes)
        {
            // console.log(product.attributes[j]);
            name+=product.attributes[j].name+': '+product.attributes[j].option+', ';
        }
        name=temp=name.substr(0, name.length - 2);
        products_temp[i].name=name;

        //Build Card
        // card=new builder.HeroCard(session)
        // // .title(product.title)
        // // .subtitle("Price: "+product.price + "," + "Size: "+product.size)
        // // .text("Quantity: "+product.qty)
        // .images([builder.CardImage.create(session, product.image.src)])
        // .buttons([
        //     builder.CardAction.imBack(session, name, name)]);
        // cards.push(card);
    }        

    return products_temp
        

}






function categoryMapping(category) {
    return {
        title: category.name,
        imageUrl: category.imageUrl,
        buttonLabel: 'view_bouquets'
    };
}

function productMapping(product) {
    return {
        title: product.name,
        subtitle: '$ ' + product.price,
        imageUrl: product.images[0].src,
        buttonLabel: 'choose_this'
    };
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};