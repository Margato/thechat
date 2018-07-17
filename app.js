const main = require('./main');
let users = [];

main.io.on('connection', function (socket) {

    let nickname = 'User_' + Math.floor(Math.random() * (10000000000 - 0 + 1)) + 0;
    socket.emit('nickname', nickname);
    let id = nickname.replace('User_', '');


    socket.on('join', function (req) {
        if (req == null){
            req = nickname;
        }
        users.push(id);
        //Broadcast
        main.io.emit('join', req);
        socket.emit('usersOnline', users.length);
    });


    socket.on('disconnect', function () {
        let index = users.indexOf(id);
        if (index >= 0){
            users.splice(index, 1);
        }
    });






    socket.on('message', function (req) {

        console.log(`${req['sender']} has sent a message`);
        console.log(`${req['sender']}'s msg: ${req['msg']}`);

        req['sender'] = main.xss(req['sender']);
        req['msg'] = main.xss(req['msg']);

        let msg = req['msg'];

        if (msg.startsWith('/')) {
            let args = msg.split(' ');
            if (args[0] == '/nickname' && args[1] != null && args[1].length > 0 && args[1].length < 25) {
                socket.emit('new_nickname', args[1]);
            }
        } else {
            //Broadcast
            main.io.emit('message', req);
        }

    });
});