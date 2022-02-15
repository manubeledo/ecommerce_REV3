const app =                     require('./server.js')
const { cpus } =                require ('os');
const cluster =                 require('cluster');
const args =                    require('./utils/yargs')
const {config} =                require('./config/index')


let {mode, port} = args

if(!port) port=config.port

if (mode ==='cluster' && cluster.isPrimary) {
  const numCPUs = cpus().length;
  console.log(`Primary Process ${process.pid} is running on ${port} assigned by CLI`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  console.log(cluster.worker)
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died at ${Date.now().toLocaleString()}`);
  });
} else {

    console.log();
    app().listen(port, () => console.log(`New worker server ${process.pid} started by ${mode || "not specified"} mode on port ${port}`))
}