let fs = require('fs')

const avatar = async (req, res) => {
    fs.readdir('./public/uploads', function (err, filespaths) {
        if (err) {
        console.log(err);
        return;
        }
        filespaths.pop()
        let newArr = filespaths.map((file) => file.split(".")[0].slice(13, 200))
        let datos = filespaths.concat(newArr)
        res.render('avatares', { pictures: datos } )
        });
}

module.exports = { avatar };