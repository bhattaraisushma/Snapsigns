const http=require("http")
const app=require("../backend/config/express.config")

const server=http.createServer(app)
server.listen(9005,'127.0.0.1',(err)=>{
    if(!err){
        console.log("Server is running successfully in 9005");
        console.log("Press CTRL C to disconnect")
    }
})