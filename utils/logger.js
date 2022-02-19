const log4js = require('log4js');

log4js.configure({
    appenders:{
        consola:    {type:'console'},
        warningFile:{type:'file', filename:'logs/warn.log'},
        errorFile:  {type:'file', filename:'logs/error.log'}
    },  
    categories:{
        default:{ appenders: ['consola'], level: 'trace'},
        outinfo:{ appenders: ['consola'], level: 'info'},
        outwarning: { appenders: ['warningFile', 'consola'], level: 'warn'},
        outerror: { appenders: ['errorFile', 'consola'], level: 'error' }
    }
})

module.exports = log4js