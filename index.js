const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET)
const bodyParser = require("body-parser")
const cors = require("cors")
const short = require('short-uuid')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

// app.use(express.static("public"));
// app.use(express.json());

app.post("/createIntent", cors(), async (req, res) => {
    let {amount, items} = req.body
    let cart = {};
    items.forEach((item) => {
        cart[item.id] = `${item.size} x ${item.q}`;
    })
    let conf = short.uuid();
    try {
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "GBP",
            description: conf,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {...cart}
        })
        console.log(payment)
        res.json({
            success: true,
            clientSecret: payment.client_secret,
            confirmation: conf
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false
        })
    }
})

app.listen(process.env.PORT || 4000, () => {
    console.log("server is listen")
})