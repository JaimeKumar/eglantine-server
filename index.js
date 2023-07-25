const express = require("express");
const app = express();
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET)
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.post("/payment", cors(), async (req, res) => {
    let {amount, id, conf} = req.body
    try {
        const payment = await stripe.paymentIntents.create({
            amount: amount,
            currency: "GBP",
            description: conf,
            
            automatic_payment_methods: {
                enabled: true,
            }
            // payment_method: id,
            // confirm: true
        })
        console.log(payment)
        res.json({
            message: "Payment successful",
            success: true
        })
    } catch (error) {
        console.log(error)
        res.json({
            message: "Payment failed",
            success: false
        })
    }
})

app.listen(process.env.PORT || 4000, () => {
    console.log("server is listen")
})