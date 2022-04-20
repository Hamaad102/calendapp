const Price = require("../models/Price");
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const asyncHandler = require("express-async-handler");

// @route POST /payment/create-checkout-session
// @desc Passes user off to stripe payment processor
// @access Private
exports.checkout = asyncHandler(async (req, res) => {

    const { priceInCents, name } = req.body;

    // // We don't want the user to be able to modify payments on the frontend
    // // We verify in the backend where prices are stored to ensure that the price is valid and therefore we can process a payment
    const information = await Price.find({ priceInCents, name });

    if(information.length === 0) {
        res.status(500).json({ error: 'This is not a valid price.'});
    }else {
        try{
            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: 'price_1KkxbFJC7tvFf6l1kOed9npv',
                        quantity: 1,
                    }
                ],
                success_url: `${process.env.CLIENT}/upgrade/success/{CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.CLIENT}/upgrade`,
            })

            res.status(200).json(session.url);
        }catch(error) {
            res.status(500).json({ e: error.message });
        }
    }
})

// @route POST /payment/success
// @desc Updates backend to reflect users membership assuming the stripe id is legit and unique
// @access Private
exports.success = asyncHandler(async (req, res) => {
    const { id, stripeid } = req.body;
    const session = await stripe.checkout.sessions.retrieve(stripeid);
    if(session.payment_status === 'paid'){
        const newPayment = await User.find({ stripeid })
        if(newPayment.length === 0) {
            await User.findOneAndUpdate({ _id: id }, { stripeid, premium: true });
            res.status(200).send('success');
        } else {
            res.status(409).send({ message: 'User has already paid'});
        }
    } else {
        res.status(403).send({ message: 'Error, user has not paid'});
    }
})