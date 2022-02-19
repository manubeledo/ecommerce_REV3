const app = require('./server.js')
const cluster = require('cluster');
const args = require('./utils/yargs')
const logger = require('./utils/logger')
const { appConfig } = require('./config/db')
const { cpus } = require ('os');

let {mode, portCLI} = args

let port = portCLI ? portCLI : appConfig.port

if (mode ==='cluster' && cluster.isPrimary) {
  const numCPUs = cpus().length;
 logger.getLogger('consola').info(`Primary Process ${process.pid} is running on ${port} assigned by CLI`);
 
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }  
    cluster.on('exit', (worker, code, signal) => {
      logger.getLogger('errorFile').error(`worker ${worker.process.pid} died at ${Date.now().toLocaleString()}`);
  });
} else {

    app().listen(port, () => logger.getLogger('consola').info(`New worker server ${process.pid} started by ${mode || "not specified"} mode on port ${port}`))
}

