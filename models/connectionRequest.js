const mongoose = require("mongoose");
const { schema } = require("./user");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,

    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type: String,
        enum:  {
            values: { ignore, interested, accepeted, rejected},
            message:`{VALUE} is incorrect status type `
        },
    },
},{
    timestamps: true,
});

const ConnectionRequest = new mongoose.Schema("ConnectionRequest",connectionRequestSchema);