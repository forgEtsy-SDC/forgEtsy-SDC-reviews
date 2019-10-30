const faker = require('faker');
const debug = require('debug')('mongoDB');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Products', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected...');
});

const productsSchema = require('../mongoSchema/productsSchema');
const reviewSchema = require('../mongoSchema/reviewsSchema');

Products = mongoose.model('Products', productsSchema);
Reviews = mongoose.model('Reviews', reviewSchema);

const jewelry = require('./db data/jewelry');
const housewares = require('./db data/housewares');
const accessories = require('./db data/accessories');
const toys = require('./db data/toys');

let jsonData = [
    jewelry.results,
    housewares.results,
    accessories.results,
    toys.results
]

let seedDatabase = function () {
    Promise.all(jsonData.reduce((acc, cur) => {
        return [...acc, Products.insertMany(cur)];
    }, []))
        .then((data) => {
            console.log('...Saved products to database...');
            return data.reduce((acc, cur) => {
                return [...acc, ...cur.reduce((acc, cur) => {
                    for (let i = 0; i < ~~((Math.random() * (6 - 4)) + 4 + 1); i++) {
                        acc = [...acc, {
                            review_id: Number(`${cur.listing_id}${i}`),
                            date: faker.date.past(45),
                            description: faker.lorem.sentences(),
                            rating: Math.floor((Math.random() * 6)),
                            user_name: `${faker.name.firstName()} ${faker.name.lastName()}`,
                            user_photo_url: faker.image.avatar(),
                            product_id: cur.listing_id,
                            product_user_image_url: 'FIND A ONE THINGY PICTURE ITEM BOI',
                        }];
                    };
                    return acc
                }, [])]
            }, []);
        })
        .then((reviews) => {
            Reviews.insertMany(reviews)
                .then(() => console.log('...Saved reviews to database...'))
        })
        // Add proper error handling
        .catch(err => console.log(err));
}

const seedDatabaseOnce = function (func) {
    let called = false;
    return function () {
        if (!called) {
            called = true;
            return func();
        }
        return
    }
}

seedDatabase = seedDatabaseOnce(seedDatabase);

seedDatabase();