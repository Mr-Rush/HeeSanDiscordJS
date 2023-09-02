const {model, Schema } = require (`mongoose`);

let welcome = new Schema ({
    Guild: 1147206605537038466,
    Channel: 1147491760797405214,
    Message: String,
    Reaction: String
})

module.exports = model(`welcomeschema`, welcome)