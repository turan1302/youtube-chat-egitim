const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 4444;
const privateUsers = {}; // anasayfadan kullanıcı bağlama

io.on("connection",function (socket) {

    // kullanıcı anasayfaya geldi sockete bağlandı
    socket.on("connect_user",(data)=>{
        if (!(data.userId in privateUsers)){
            privateUsers[data.userId] = {}
        }

        privateUsers[data.userId] = socket;
        socket.userId = data.userId;

    })

    socket.on("disconnect",function () {
        console.log("Birileri geldi ve gitti");
    });
});

http.listen(PORT,()=>{
    console.log(`${PORT} portu dinleniyor`);
})
