const TextService = require('./text.service');
const { textDTO } = require('./text.dto');

class TextController {
    processText = async (req, res) => {
        try {
            
            console.log("Received text from frontend:", req.body.text);

        
            const { error, value } = textDTO.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { text } = value;

            const result = await TextService.processTextForASLGloss(text);

            res.status(200).json({
                success: true,
                result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
}

module.exports = new TextController();
