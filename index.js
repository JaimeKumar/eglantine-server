const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET)
const bodyParser = require("body-parser")
const cors = require("cors")
import { v4 as uuid } from 'uuid';

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

// app.use(express.static("public"));
// app.use(express.json());

app.post("/createIntent", cors(), async (req, res) => {
    let {amount} = req.body
    let conf = uuid();
    console.log(conf);
    try {
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "GBP",
            description: conf,

            automatic_payment_methods: {
                enabled: true,
            }
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