import { config } from "../config.js";

export class IMessage {
    constructor() {
        console.log('IMessage constructor');

        this.message = document.getElementById('message-text');
        this.message.addEventListener("keyup", function (event) {
            event.preventDefault();
            if (event.key === "Enter") {
                document.getElementById("send-message-btn").click();
            }
        });
        this.divChatbox = document.getElementById('divChatbox');

        this.messageContainer = {}
        
    }

    onIMessageEvent(e, ctx) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'img-back-msj':
                        console.log(e.target.id);
                        ctx.goContactsScreen()
                        break;
                    case 'camera-message-btn':
                        console.log(e.target.id);
                        break;
                    case 'send-message-btn':
                        console.log(e.target.id);
                        this.sendMessage(ctx)
                        break;
                    case 'micro-message-btn':
                        console.log(e.target.id);
                        break;
                    case 'addimage-message-btn':
                        console.log(e.target.id);                        
                        this.procesarImgChat(ctx)
                        break;
                    case 'addfile-message-btn':
                        console.log(e.target.id);
                        break;

                    // Video llamada
                    case 'id-video-m':
                        console.log(e.target.id);
                        ctx.goCallingScreen(true);
                        break;
                    case 'id-call-m':
                        console.log(e.target.id);
                        ctx.goCallingScreen(false);
                        break;

                    default:
                        break;
                }

            default:
                break;
        }
    }

    sendMessage(ctx) {
        if (this.message.value != '' && ctx.contact != undefined) {
            console.log(ctx.contact.personalKey, ": ", this.message.value);

            let detail = {
                to: ctx.contact.personalKey,
                from: config.accessKey,
                message: this.message.value,
                time: Date.now(),
                node: config.node
            }

            ctx.reply(config.accessKey, config.peer, {
                context: 'rintalk',
                subject: 'message',
                detail: detail
            })

            if (this.saveMessage(detail, ctx, true)) {
                this.renderMessage(detail, true);
                this.scrollBottom();
            }

            this.message.value = ''
        }
    }

    renderMessage(msg, yo) {
        console.log(msg);
        if (msg.message!=undefined) {
            let html = '';
            let fecha = new Date(msg.time);
            let hora = fecha.getHours() + ':' + this.padZero(fecha.getMinutes());

            let adminClass = 'info';

            if (yo) {
                html += '<li class="reverse fadeIn">';
                html += '    <div class="chat-content">';
                html += '        <div class="box bg-light-inverse">' + msg.message + '</div>';
                html += '    </div>';
                html += '    <div class="chat-time">' + hora + '</div>';
                html += '</li>';
                document.getElementById('msj-'+msg.to).textContent = 0;
                document.getElementById('msj-'+msg.to).style.visibility = 'hidden';
            } else {

                html += '<li class="fadeIn">';
                html += '    <div class="chat-content">';
                html += '        <div class="box bg-light-' + adminClass + '">' + msg.message + '</div>';
                html += '    </div>';
                html += '    <div class="chat-time">' + hora + '</div>';
                html += '</li>';
                document.getElementById('msj-'+msg.from).textContent = 0;
                document.getElementById('msj-'+msg.from).style.visibility = 'hidden';            
        }

        let liObj = document.createElement("li")
        liObj.innerHTML = html
        this.divChatbox.appendChild(liObj)  
        } else if (msg.image!=undefined){
            this.renderImage(msg, yo)
        }
         
        this.scrollBottom();             
    }

    padZero(v) {
        return ('0' + v).split('').reverse().splice(0, 2).reverse().join('');
    }

    scrollBottom() {
        // selectors
        let newMessage = this.divChatbox.lastChild;
        if (newMessage != null) {
            // heights
            let clientHeight = this.divChatbox.clientHeight;
            let scrollTop = this.divChatbox.scrollTop;
            let scrollHeight = this.divChatbox.scrollHeight;
            let newMessageHeight = newMessage.clientHeight;
            let lastMessageHeight = newMessage.previousElementSibling?.clientHeight || 0;

            if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
                this.divChatbox.scrollTo(scrollHeight, this.divChatbox.scrollHeight);
            }
        }
    }

    saveMessage(msg, ctx, yo) {
        let test
        let index = yo ? msg.to : msg.from

        let notifyMessage = () => {
            try {
                let num = parseInt(document.getElementById('msj-'+index).textContent)+1;
                document.getElementById('msj-'+index).textContent = num;      
            } catch (error) {
                return false
            }
                 
        }

        if (this.messageContainer[index] === undefined) {
            this.messageContainer[index] = []
            this.messageContainer[index].push(msg)
            notifyMessage()
            return true;
        } else {
            if (msg.time == this.messageContainer[index][this.messageContainer[index].length - 1].time &&
                msg.from == this.messageContainer[index][this.messageContainer[index].length - 1].from) {
                return false
            } else {
                this.messageContainer[index].push(msg)
                notifyMessage()
                // test: 
                test = this.messageContainer[index]
                console.log('saveMessage messageContainer: ', test); // or undefined

                return true;
            }
        }
    }

    loadSavedMessages(contact) {
        try {
            this.divChatbox.innerHTML = ''
            if (this.messageContainer[contact.personalKey] !== undefined) {
                this.messageContainer[contact.personalKey].forEach(msg => {
                    this.renderMessage(msg, msg.from == config.accessKey)                                  
                });
            }   
            this.scrollBottom();         
            document.getElementById('img-avatar-msj').src = contact.avatar;
            document.getElementById('name-user-msj').textContent = contact.personalName + ' ' + contact.personalSurname;
        } catch (error) {
            document.getElementById('img-avatar-msj').src = 'images/user1.svg'
            document.getElementById('name-user-msj').textContent = '';
        }
    }
      
    procesarImgChat(ctx) {

        document.getElementById('archivo-addimg')
        .addEventListener('change', (e) => {
            var imagen = event.target.files[0];      
            var lector = new FileReader();
            lector.addEventListener('load', (e) => {
                console.log('Do it!!');

                let detail = {
                    to: ctx.contact.personalKey,
                    from: config.accessKey,
                    time: Date.now(),
                    node: config.node,
                    image: { base64: e.target.result }
                }

                ctx.reply(config.accessKey, config.peer, {
                    context: 'rintalk',
                    subject: 'image-chat',
                    detail: detail
                })

                if (this.saveMessage(detail, ctx, true)) {
                    this.renderImage(detail, true);
                    this.scrollBottom();
                }

            }, false);
        
            lector.readAsDataURL(imagen);
            document.getElementById('archivo-addimg').value=null;
            }, false)

        document.getElementById('archivo-addimg').click()
        
    }

    renderImage(msg, yo) {
        console.log(msg);
        let html = '';
        let fecha = new Date(msg.time);
        let hora = fecha.getHours() + ':' + this.padZero(fecha.getMinutes());

        let adminClass = 'info';

        if (yo) {
            html += '<li class="reverse fadeIn">';
            html += '    <div class="chat-content">';
            html += '        <div class="box bg-light-inverse img-center"><img class="img-chat" src="' + msg.image.base64 + '"></img></div>';
            html += '    </div>';
            html += '    <div class="chat-time">' + hora + '</div>';
            html += '</li>';
            document.getElementById('msj-'+msg.to).textContent = 0;
            document.getElementById('msj-'+msg.to).style.visibility = 'hidden';
        } else {

            html += '<li class="fadeIn">';
            html += '    <div class="chat-content">';
            html += '        <div class="box bg-light-' + adminClass + ' img-center"><img class="img-chat" src="' + msg.image.base64 + '"></img></div>';
            html += '    </div>';
            html += '    <div class="chat-time">' + hora + '</div>';
            html += '</li>';
            document.getElementById('msj-'+msg.from).textContent = 0;
            document.getElementById('msj-'+msg.from).style.visibility = 'hidden';
        }

        let liObj = document.createElement("li")
        liObj.innerHTML = html
        this.divChatbox.appendChild(liObj)   
        this.scrollBottom();             
    }
      
      
}