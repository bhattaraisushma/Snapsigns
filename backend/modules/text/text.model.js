const mongoose = require("mongoose")

const TextSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true,
        min: 1,
       
    },
    

},
    {
        timestamps: true,
        autoCreate: true,
        autoIndex: true
    }
)



const TextModel = mongoose.model("User", TextSchema

)
module.exports = TextModel;
