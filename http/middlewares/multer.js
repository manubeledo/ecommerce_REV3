const multer = require('multer')
const mimeTypes = require('mime-types')
const { User : db } = require('../../config/db')

const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: async function(req, file, cb, next){
        let userData = await db.findOne({username : req.body.username})
        if (!userData) cb("", Date.now() + req.body.username + "." + mimeTypes.extension(file.mimetype));
        cb("", "return")
    }
})

const upload = multer({
    storage: storage
})

module.exports = upload