var _ = require('lodash');
var Promise = require('bluebird');

var allCategories = [
// {name:'Slippers',  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (1) + '&w=640&h=330'},
// {name:'Sandals',  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (1) + '&w=640&h=330'},
{name:'Formal',  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (1) + '&w=640&h=330'},
{name:'Sports',  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (1) + '&w=640&h=330'},
];
var formal =[
{name:'Alestino Formal Shoes (41 UK) For Men Leather Look Shoes FV22Black',  imageUrl: 'http://ecx.images-amazon.com/images/I/81kkGQpnJtL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Tamarac by Slippers International 7161 Men\'s Camper Moccasin ',  imageUrl: 'http://ecx.images-amazon.com/images/I/61A5BN1Q1CL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Axonza Men\'s synthetic leather Office wear 184 Black lace up Formal Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/71rRWLmpqjL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Alestino Formal Shoes For Men Leather Look Shoes FV21Black',  imageUrl: 'http://ecx.images-amazon.com/images/I/81-MnUYimgL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'ALESTINO Leather Formal Shoes For Men',  imageUrl: 'http://ecx.images-amazon.com/images/I/71w4rp3ByvL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Dreamz Men\'s Synthetic Derby Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/616DbJrNpWL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'T-Rock Men\'s Black Slip on Style Formal Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/71pw4a3ucOL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Auserio Men\'s Formal Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/71DmpeyScmL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Kraasa Men\'s Patent Leather Formal Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/71UFGV%2BlgjL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Carlton London Men\'s Pace Leather Formal Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/71DOBJ7r7bL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99}
];

var sports=[
{name:'Asian Shoes Wonder 13 Grey Firozi Men\'s Sports Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/61cbAQatNlL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Lotto Men\'s Vertigo Running Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/411xts7RmTL.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Cokpit Men\'s Running Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/71jEqzTCmlL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Lancer Men\'s Sports Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/61mRUbscQxL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Asian Shoes FUTURE-01 White Nevy Blue Men\'s Shoe',  imageUrl: 'http://ecx.images-amazon.com/images/I/61WNGq8W0zL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Shoebox Men\'s Blue sports Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/41PYclVPqaL.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Lancer Men\'s Sports Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/71LYnb-%2B-nL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Steemo Men\'s Running Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/81VmbfwuMXL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Reebok Men\'s Ride Lite Running Shoes',  imageUrl: 'http://ecx.images-amazon.com/images/I/81UmwKUZJbL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Columbus TB-4 Mesh Sports Shoes for Men',  imageUrl: 'http://ecx.images-amazon.com/images/I/71JHTACX8nL._UL1500_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
];

// var allCategories = _.times(5)
//     .map(function (i) {
//         return {
//             name: 'Flower ' + (i + 1),
//             imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (i + 1) + '&w=640&h=330'
//         };
//     });

// var allProducts = _.times(17)
//     .map(function (i) {
//         return {
//             name: 'Bouquet ' + (i + 1) + '\u2122',
//             imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Bouquet%20' + (i + 1) + '&w=640&h=330',
//             price: Math.floor(Math.random() * 100) + 10 + .99
//         };
//     });

var productsService = {
    // Categories
    getCategories: function (pageNumber, pageSize) {
        return pageItems(pageNumber, pageSize, allCategories);
    },

    // Get Single Category
    getCategory: function (categoryName) {
        var category = _.find(allCategories, ['name', categoryName]);
        return Promise.resolve(category);
    },

    // Products
    getProducts: function (categoryName, size, pageNumber, pageSize) {
        console.log(categoryName)
        if (categoryName==='Formal Shoes')
        {
            return pageItems(pageNumber, pageSize, formal);
        }
        else if (categoryName==='Sports Shoes')
        {
            return pageItems(pageNumber, pageSize, sports);
        }
        else 
        {
            return pageItems(pageNumber, pageSize, sports)
        }
    },

    // Get Single Product
    getProduct: function (productName) {
        var product = _.find(formal.concat(sports), ['name', productName]);

        return Promise.resolve(product);
    }
};

// helpers
function pageItems(pageNumber, pageSize, items) {
    var pageItems = _.take(_.drop(items, pageSize * (pageNumber - 1)), pageSize);
    var totalCount = items.length;
    return Promise.resolve({
        items: pageItems,
        totalCount: totalCount
    });
}

// export
module.exports = productsService;