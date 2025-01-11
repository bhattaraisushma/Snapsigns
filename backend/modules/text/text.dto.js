const Joi=require("joi")

    const textDTO=Joi.object({
    text:Joi.string().min(1).required(),
    

})
   

    module.exports={textDTO}