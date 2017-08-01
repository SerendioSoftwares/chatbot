var _ = require('lodash');
var builder = require('botbuilder');
var products = require('../../services/products');
var SimpleWaterfallDialog = require('./SimpleWaterfallDialog');
var CarouselPagination = require('./CarouselPagination');

var carouselOptions = {
    showMoreTitle: 'title_show_more',
    showMoreValue: 'show_more',
    selectTemplate: 'select',
    pageSize: 5,
    unknownOption: 'unknown_option'
};

var lib = new builder.Library('product-selection');

// These steps are defined as a waterfall dialog,
// but the control is done manually by calling the next func argument.




lib.dialog('/',
    new SimpleWaterfallDialog([
        // First message
        function (session, args, next) {
            // builder.Prompts.text(session, 'What would you like?');
            // console.log(args);
            session.dialogData.size=args.size;
            next();
            // session.beginDialog('intelligence:search', {
            //     prompt: session.gettext('What would you like'),
            //     retryPrompt: session.gettext('Only shoes, sandals and slippers are available')
            //     });
            
        },
        // Show Categories
        // CarouselPagination.create(products.getCategories, products.getCategory, categoryMapping, carouselOptions),
        // Category selected
        function (session, args, next) {
            console.log('====fewf====');
            console.log(session.message.text);


            var category = session.message.text;
            session.send('choose_bouquet_from_category', category);
            session.dialogData.category = category;
            session.message.text = null;            // remove message so next step does not take it as input
            next();
        },
        // Show Products
        function (session, args, next) {

            var categoryName = session.dialogData.category;
            CarouselPagination.create(
                function (pageNumber, pageSize) { return products.getProducts(categoryName, pageNumber, pageSize); },
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
            args.selected.qty=1;
            args.selected.size=session.dialogData.size;
            // this is last step, calling next with args will end in session.endDialogWithResult(args)
            next({ selection: args.selected });
            
        }
    ]));

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
        subtitle: '$ ' + product.price.toFixed(2),
        imageUrl: product.imageUrl,
        buttonLabel: 'choose_this'
    };
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};