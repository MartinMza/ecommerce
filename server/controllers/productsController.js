const Product = require('../models/Products');
const { joiProduct } = require('../utils/joi');

class ProductController {
    static async getAllProduct(req, res) {
        try {
            const products = await Product.find();
            const discover = products.map((i) => i?.img[0]);
            res.json({ products, discover });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    static async getProduct(req, res) {
        try {
            const product = await Product.findById(req.params.id);
            res.json(product);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    static async getProductTitle(req, res) {
        try {
            const product = await Product.find({ title: req.params.title });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error });
        }
    }
    static async getProductByLike(req, res) {
        try {
            const product = await Product.find({ title: { $regex: '.*' + req.params.title + '.*' } });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    static async getTags(req, res) {
        try {
            const products = await Product.find({ category: { $in: [req.params.tag] } });
            res.json(products);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    // user logueado
    static async addReview(req, res) {
        try {
            const { username, review } = req.body;
            const newReview = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        reviews: {
                            $each: [{ username, review }],
                        },
                    },
                },
                { new: true }
            );
            res.status(200).send(newReview);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    static async getAllReviews(req, res) {
        // const reviews = [];
        try {
            const product = await Product.findById(req.params.id);
            const appreciation = (() => {
                const arr = product.appreciation;
                if (!arr.length) return 0;
                let [len, i, sum] = [arr?.length, 0, 0]; //Calcular promedio de apprecations
                while (i < len) {
                    sum += arr[i];
                    i++;
                }
                return (sum / len).toFixed(1);
            })();
            const reviews = product.reviews.map((e) => {
                return {
                    username: e.username,
                    review: e.review,
                    img: 'https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg',
                };
            });
            res.status(200).send({ appreciation, reviews });
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    // user logueado
    static async addReview(req, res) {
        try {
            const { username, review } = req.body;
            const newReview = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    $push: {
                        reviews: {
                            $each: [{ username, review }],
                        },
                    },
                },
                { new: true }
            );
            res.status(200).send(newReview);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    //invalid request
    static async addAppreciation(req, res) {
        const appreciation = parseFloat(req.body.appreciation);
        try {
            const { error } = joiProduct.validate({ appreciation });
            if (!error) {
                const newAppreciation = await Product.findByIdAndUpdate(
                    req.params.id,
                    {
                        $push: {
                            appreciation: {
                                $each: [appreciation],
                            },
                        },
                    },
                    { new: true }
                );
                return res.status(200).send(newAppreciation);
            }
            return res.status(400).json('Bad Request');
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    //admin
    static async addProduct(req, res) {
        try {
            const newProduct = await new Product(req.body);
            const savedProduct = await newProduct.save();
            res.status(201).json(savedProduct);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    static async modifyProduct(req, res) {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            console.log(product);
            res.status(200).send(product);
        } catch (error) {
            res.status(500).json({ error });
        }
    }

    static async removeProduct(req, res) {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            res.status(204).send(product);
        } catch (error) {
            res.status(500).json({ error });
        }
    }
}
module.exports = ProductController;
