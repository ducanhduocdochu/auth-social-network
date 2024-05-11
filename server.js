const app = require("./src/app");
const { app: {port} } = require('./src/configs/config.js')
const PORT = port

const server = app.listen(PORT, () => {
    console.log(`Auth server start with ${PORT}`)
})

process.on("SIGINT", ()=> {
    server.close(() =>  console.log(`Exit Server Express`))
})