import express from "express";
import http from "http";
import path from "path";
import { Users } from "./utils/user"; 

//instead of express we are using http to create server since 
//express also uses http under the hood to create the server
//and also we want that server instance for socket functions
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const publicPath = path.join(__dirname,'../public');
const port = process.env.PORT || 8081;

app.use(express.static(publicPath));
app.get('/', (req,res) =>{
    res.sendFile('views/index.html',{root: publicPath });
})

const users = new Users();

io.on('connection',(socket) => {
    console.log(socket.id);
    //users.users.push(socket.id);
    socket.on('disconnect', () => {
        console.log('disconnected');
    });



    socket.on('validateUser',(params,callback) => {
        console.log(params);
        var valid = true;
        users.users.map((user) => {
            if(user.name.toLowerCase() === params.username.toLowerCase() && user.room === params.room){
                valid=false;
            }
        });
        callback(valid);
    });



    socket.on('join',(params,callback) =>{
        var re = true;
        let name = params.username.charAt(0).toUpperCase() + params.username.slice(1).toLowerCase();
        console.log(name);
        users.users.map((user) => {
            if(user.name.toLowerCase() === params.username.toLowerCase() && user.room === params.room){
                re=false;
            }
        });

        if(re === false){
            return callback('Username is already taken');
        }
        socket.join(params.room);
        users.addUser(socket.id, name, params.room);
        io.to(params.room).emit('updateUserList', users.getUsersList(params.room));
        callback();
    })

})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



