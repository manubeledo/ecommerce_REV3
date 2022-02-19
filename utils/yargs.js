const yargs =                     require('yargs/yargs')
const { hideBin } =             require('yargs/helpers') // hideBin is a shorthand for process.argv.slice(2)

module.exports = yargs(hideBin(process.argv)).argv