const Joi=require("joi")

    const textDTO=Joi.object({
    text:Joi.string()
    .pattern(/^[a-zA-Z " "]+$/)
    .min(1)
    .required()
  
  
    

})
   

    module.exports={textDTO}