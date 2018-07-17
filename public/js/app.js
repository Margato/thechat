let nickname = '';

$(document).ready(function () {
    $('#typing').focus();
    let socket = io();

    socket.on('message', function (res) {
        console.log('sender: ' + res['sender'] + '\nmsg: ' + res['msg']);
        appendMessage(res['sender'], res['msg']);

    });

    nickname = localStorage.getItem('nickname');
    if (nickname == null) {
        socket.on('nickname', function (res) {
            nickname = res;
            localStorage.setItem('nickname', nickname);
            console.log(res);
        });
    }

    socket.emit('join', nickname);

    socket.on('join', function (res) {
        if (res != null)
            appendMessage('console', `${res} has joined The Chat.`);
        else
            appendMessage('console', `A new user has joined The Chat.`);
    });

    socket.on('usersOnline', function (res) {
        if (res == 1) {
            appendMessage('console', `You are alone in this chat :(`);
        } else {
            appendMessage('console', `${res} users are online`);
        }
    });

    appendMessage('console', 'Welcome to The Chat! Here you can talk of everything with everyone. Created with ♥ by Margato#9907.');
    
    appendMessage('console', 'Check out this repo at <a href="https://github.com/Margato/thechat">GitHub</a>');

    appendMessage('console', 'You can change your display name typing /nickname <new nickname>');
});

$('.typing').click(function () {
    $('#typing').focus();
});

$('body').keypress(function () {
    $('#typing').focus();
});
/*

let typing = false;
let delay = 2000;
let timeout;
*/
$('#typing').keypress(function (e) {
    if (e.which == 13 && nickname != '') {
        sendMessage(getSender(), $('#typing').val());
        e.preventDefault();
    }
    if (e.which == 13 && nickname == '') {
        appendMessage('console', "We're still getting your nickname, our server is a little slow right now.");
        e.preventDefault();
    }

    //isTyping();
});

/*
function isTyping() {
    let socket = io();
    socket.emit('userTyping', nickname);
    typing = true;
    clearTimeout(timeout);
    timeout = setTimeout(notTyping, 1000);
}

function notTyping() {
    let socket = io();
    typing = false;
    socket.emit('userTyping', false);
}*/

function getSender() {
    return nickname;
}

function sendMessage(sender, msg) {
    let socket = io();
    let newMsg = {
        sender: sender,
        msg: msg
    };
    let value = $('#typing').val();
    if (value.length > 0 && value.length < 1025) {
        socket.emit('message', newMsg);
        $('#typing').val('');
        console.log(newMsg);
        if (value.startsWith('/')) {
            value = value.split(' ');
            if (value[0] == '/nickname' && value[1] != null && value[1].length > 0 && value[1].length < 25) {
                socket.on('new_nickname', function (res) {
                    nickname = res;
                    localStorage.setItem('nickname', nickname);
                });
                appendMessage('console', 'Your display name has been changed to ' + value[1]);
            } else {
                appendMessage('console', 'Use /nickname <new nickname> to change your display name');
            }
        }
    } else {
        appendMessage('console', "Your message isn't valid.");
    }

}

function appendMessage(sender, msg) {
    let col = $('.col-12');
    col.append(`<div class="message"><div class="message-sender"><div class="message-content"><p><span class="at">@</span>${sender}: ${msg}</p></div></div>`);
    $('.conversation').animate({
        scrollTop: col.height()
    }, 0);
}


function clearMessages() {
    let col = $('.col-12');
    col.empty();
}