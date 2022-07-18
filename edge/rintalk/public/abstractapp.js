import { Session } from "./session.js";
import { config } from "./config.js";
import { ILogin } from "./js/login.js";
import { IContacts } from "./js/contacts.js";
import { IAddContact } from "./js/addcontact.js";
import { IAbout } from "./js/about.js";
import { ILogout } from "./js/logout.js";
import { IMyProfile } from "./js/myprofile.js";
import { IPersonalInfo } from "./js/personalInfo.js";
import { IMessage } from "./js/message.js";

import { ICall } from "./js/call.js";

export class AbstractApp extends Session {
    constructor() {
        super()
        this.connect(config.host)

        this.screens = {
            'login': new ILogin(),
            'contacts': new IContacts(),
            'addContact': new IAddContact(),
            'about': new IAbout(),
            'logout': new ILogout(),
            'myprofile': new IMyProfile(),
            'personalinfo': new IPersonalInfo(),
            'message': new IMessage(),

            'call': new ICall(),
        }
        this.current = this.screens.login
        this.containers = [
            'container-login', 'container-contacts', 'container-add-contact',
            'container-about', 'container-logout', 'container-profile',
            'container-personal-info', 'container-write-msj',
            'container-calling', 'container-receive-call', 'container-active-video'
        ]
        //selected contact
        this.contact = undefined;
        this.setting = false;
    }

    initialize(data) {
        document.getElementById('container-loader').style.display = 'none';
        document.getElementById('container-login').style.display = '';
        document.getElementById('enter').disabled = false;
        console.log('initialize... get initial data', data);
        config.accessKey = localStorage.getItem('key');
        config.password = localStorage.getItem('password');
        if (config.accessKey != null && config.password != null) {
            this.loadingLoging(true);
            this.login(config.accessKey, config.password);
        }
    }

    onGranted(data) {
        console.log('onGranted ...', data);
        // login success  
        this.loadingLoging(false);
        this.current = this.screens.contacts;
        this.current.getContacts();
        this.activeContainer('container-contacts')
        this.screens.myprofile.getContactInfo();
        //------------PEER SERVER------------- CONFIG HERE -----------------
        this.peerServer()

    }

    // error login
    onDenied(data) {
        console.log('onDenied', data);
        this.loadingLoging(false);
        document.querySelector('#message').style.display = "block";
    }

    loadingLoging(e){
        if (e) {
            document.getElementById('enter').style.display = 'none';
            document.getElementById('new-password-btn').style.display = 'none';
            document.getElementById('loader-enter').style.display = '';
        } else {
            document.getElementById('enter').style.display = '';
            document.getElementById('new-password-btn').style.display = '';
            document.getElementById('loader-enter').style.display = 'none';
        }        
    }

    onReply(data) {
        // first validate if data comes from server
        console.log('server is: ', data);
        if (data.body.from == config.peer) {
            switch (data.body.subject) {
                case 'message':
                    // manage data .....
                    console.log(data.body);

                    // send recived
                    this.reply(config.accessKey, config.peer, {
                        subject: 'message-recived',
                        detail: {
                            to: data.body.detail.to,
                            from: data.body.detail.from,
                            // date of message
                            time: data.body.detail.time
                        }
                    })

                    // save message
                    if (this.screens.message.saveMessage(data.body.detail, false)) {
                        // render message
                        this.screens.message.renderMessage(data.body.detail, false);
                        this.screens.message.scrollBottom();
                    }

                    break;
                case 'message-recived':
                    // manage data .....
                    console.log(data.body);
                    //--------------------------do it-------------

                    //----------------                        
                    break;
                default:
                    break;
            }
        } else {
            console.log('Fake server!!');
        }

    }

    onIEvent(e) {
        switch (e.target.id) {
            // hamburguer menu items ids
            case 'h-m-contact':
                console.log('go to action:', e.target.id)
                this.hideHamburguerMenu();
                this.goContactsScreen();
                break;
            case 'h-m-my-profile':
                console.log('go to action:', e.target.id)
                this.hideHamburguerMenu();
                this.current = this.screens.myprofile;
                this.current.getContactInfo();
                this.activeContainer('container-profile');
                break;
            case 'h-m-about':
                console.log('go to action:', e.target.id)
                this.hideHamburguerMenu();
                this.current = this.screens.about;
                this.activeContainer('container-about');
                break;
            case 'h-m-logout':
                console.log('go to action:', e.target.id)
                this.hideHamburguerMenu();
                this.current = this.screens.logout;
                this.activeContainer('container-logout');
                break;
            case 'h-m-setting':
                console.log('go to action:', e.target.id)
                this.toggleSettingMenu(e.target);
                break;


            // RinTalk logo
            case 'rintalk-menu':
                console.log('go to action:', e.target.id)
                this.hideHamburguerMenu();
                this.goContactsScreen();
                break;
            default:
                break;
        }
        switch (this.current.constructor.name) {
            case 'ILogin':
                console.log('login event');
                this.current.onILoginEvent(e, this);
                break;
            case 'IContacts':
                console.log('contacts event');
                this.current.onIContactsEvent(e, this);
                break;
            case 'IAddContact':
                console.log('add contact event');
                this.current.onIAddContactEvent(e, this);
                break;
            case 'IAbout':
                console.log('about event');
                this.current.onIAboutEvent(e, this);
                break;
            case 'ILogout':
                console.log('logout event');
                this.current.onILogoutEvent(e, this);
                break;
            case 'IMyProfile':
                console.log('my profile event');
                this.current.onIMyProfileEvent(e, this);
                break;
            case 'IPersonalInfo':
                console.log('personal info event');
                this.current.onIPersonalInfoEvent(e, this);
                break;
            case 'IMessage':
                console.log('message event');
                this.current.onIMessageEvent(e, this);
                break;

            case 'ICall':
                console.log('call event');
                this.current.onICallEvent(e, this);
                break;
            default:
                break;
        }
    }

    activeContainer(cont) {
        this.containers.forEach(container => {
            if (cont != container) {
                document.getElementById(container).style.display = 'none';
            } else {
                document.getElementById(container).style.display = 'block';
            }
        })
        this.hideHamburguerMenu();
        this.setting = false;
    }

    peerServer() {
        const peer = new Peer(config.accessKey);

        peer.on('connection', (connection) => {

            if (window.bussy) {
                connection.close();
            } else {
                window.connection = connection;

                window.connection.on('open', function() {
                    // Receive messages
                    window.connection.on('data', (data) => {
                        console.log('Received: ', data.remoteVideo);
                        switch (data.remoteVideo) {
                          case false:
                            document.getElementById('img-videocall-recive').style.visibility= '';
                            document.getElementById('remoteVideo').style.visibility= 'hidden';
                            break;
                          case true:
                            document.getElementById('remoteVideo').style.visibility= '';
                            document.getElementById('img-videocall-recive').style.visibility= 'hidden';
                            break;
                          default:
                            break;
                        }     
                      });
                });
            }
            
    
        });

        peer.on('call', (call) => {

            if (window.bussy) {
                call.close();
            } else {

                window.call = call;
            window.reciveMicro = true;
            window.reciveVideo = false;
            window.bussy = true;
            this.screens.call.setEnableAudioIcon();
            this.screens.call.setDisableVideoIcon();

            this.contact = config.contacts.find(c => c.personalKey == call.peer)            
            if (this.contact != undefined){
                document.getElementById('img-call-recive').src = this.contact.avatar;
                document.getElementById('name-call-recive').textContent = this.contact.personalName + this.contact.personalSurname;
            }else{
                console.log('Remote peer: ', call.peer);
                document.getElementById('name-call-recive').textContent = call.peer;
                document.getElementById('img-call-recive').src = 'images/calling-men.svg';

            }

            document.getElementById('localVideo').style.visibility= '';
            document.getElementById('my-avatar-videocall-recive').style.visibility= 'hidden';

            this.activeContainer('container-receive-call');
            
            if (call.peer == config.accessKey) {
                this.goContactsScreen();
                alert("You can't call yourself.");
            } else {

                this.current = this.screens.call
                this.current.playRingTone();

                const reptTone = setTimeout(() => {
                    this.screens.call.playRingTone();
                }, 12000);

                const autoClose = setTimeout(() => {
                    document.getElementById('cancel-call-recive').click()
                }, 24000);

                document.getElementById('cancel-call-recive').addEventListener('click', e => {                    
                    console.log("call denied"); // D
                    clearTimeout(autoClose);
                    clearTimeout(reptTone);
                    this.screens.call.stopRingTone();
                    this.screens.call.playEndTone();  
                    window.connection.close();               
                    this.goContactsScreen();
                })

                document.getElementById('acept-call-recive').addEventListener('click', e => {
                    clearTimeout(autoClose);
                    clearTimeout(reptTone);
                    this.screens.call.stopRingTone();
                    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
                        window.localStream = stream
                        document.getElementById('localVideo').srcObject = window.localStream; // B
                        window.localStream.getAudioTracks()[0].enabled = window.reciveMicro;
                        window.localStream.getVideoTracks()[0].enabled = window.reciveVideo;
                        
                        if (!window.localStream.getVideoTracks()[0].enabled) {
                            document.getElementById('my-avatar-videocall-recive').style.visibility= '';
                            document.getElementById('localVideo').style.visibility= 'hidden';
                        } else {
                            document.getElementById('localVideo').style.visibility= '';
                            document.getElementById('my-avatar-videocall-recive').style.visibility= 'hidden';
                        }
                        call.answer(window.localStream);                       

                        this.initCall();

                    }).catch(err => {
                        alert('Error: ' + err)
                        console.log("You got an error:" + err)
                        window.connection.close();
                        this.goContactsScreen();
                    });
                });

                window.connection.on('close', () => {
                    console.log("window.connection.on('close',...)");
                    clearTimeout(autoClose);
                    clearTimeout(reptTone);
                    this.screens.call.stopRingTone();
                    this.screens.call.playEndTone();
                    this.goContactsScreen();
                });

                window.connection.on('error', () => {
                    console.log("window.connection.on('error',...)");
                    clearTimeout(autoClose);
                    clearTimeout(reptTone);
                    this.screens.call.stopRingTone();
                    this.screens.call.playEndTone();
                    this.goContactsScreen();
                });
            }
                
            }
        });

        peer.on('error', (err) => {
            console.log(err.type);
            clearInterval(window.calltone);
            switch (err.type) {
                case 'peer-unavailable':                    
                    window.connection.close();
                    this.goContactsScreen();
                    alert('The User you try to call is unavailable!')
                    break;

                default:
                    window.connection.close();
                    this.goContactsScreen();
                    console.log(err.type);
                    break;
            }
        });

        window.peer = peer;
    }

    goCallingScreen(activeVideo) {
        if (this.contact != undefined) {
            this.activeContainer('container-calling')
            this.current = this.screens.call
            document.getElementById('avatar-calling').src = this.contact.avatar
            document.getElementById('name-calling').textContent = this.contact.personalName
            document.getElementById('avatar-active-call').src = this.contact.avatar
            document.getElementById('name-active-call').textContent = this.contact.personalName
            this.current.call(this.contact.personalKey, this, activeVideo);
        } else {
            console.log('Contact undefined!');
        }        
    }

    initCall() {
        this.current = this.screens.call        
        
        const autoClose = setTimeout(() => {
            document.getElementById('cancel-calling-btn').click()
        }, 28000);

        document.getElementById('cancel-calling-btn').addEventListener('click', e => {
            clearContent();         
            window.call.close();
            window.connection.close();
            this.screens.call.playEndTone();
            this.goContactsScreen();
        })  

        window.call.on('stream', (streamR) => {
            window.connection.send({
                remoteVideo: window.reciveVideo                        
            });
            
            window.bussy = true;

            clearContent();          
            console.log("call.on('stream',...)");
            window.remoteStream = streamR
            
            document.getElementById('remoteVideo').srcObject = window.remoteStream;

            if (this.contact != undefined){
                document.getElementById('img-videocall-recive').src = this.contact.avatar;
            } else {
                document.getElementById('img-videocall-recive').src = 'images/img-videocall.svg';
            }
            if (config.profile != null){
                console.log('');
                if (config.profile.personalAvatar != null) {                    
                    document.getElementById('my-avatar-videocall-recive').src = config.profile.personalAvatar;
                }
            }
            this.screens.call.callTime();
            this.activeContainer('container-active-video')
        });

        window.call.on('close', (e) => {
            clearContent();
            console.log("window.call.on('close',...)");
            this.screens.call.playEndTone();
            this.goContactsScreen();
        });

        window.connection.on('close', (e) => {
            clearContent();
            console.log("window.connection.on('close',...)");
            this.screens.call.playEndTone();
            this.goContactsScreen();
        });

        window.connection.on('error', () => {
            clearContent();
            console.log("window.connection.on('error',...)");
            this.screens.call.playEndTone();
            this.goContactsScreen();
        });

        const clearContent = () => {
            clearTimeout(autoClose);
            clearInterval(window.calltone);
            clearInterval(window.calltime);
        }

    }

    hideHamburguerMenu() {
        document.querySelectorAll('.h-m-check').forEach(c => {
            c.checked = false;
        })
        this.setting = true;
        this.toggleSettingMenu();
    }

    toggleSettingMenu() {
        console.log('setting in: ', this.setting );
        this.setting = !this.setting;
        document.querySelectorAll('.setting-hamburguer').forEach(c => {
            console.log('setting out: ', this.setting );
            if (this.setting) {
                c.style.display = "";
              } else {
                c.style.display = "none";
              }
        })
        
      } 


    goContactsScreen() {
        window.bussy = false;
        this.current = this.screens.contacts;
        this.activeContainer('container-contacts');

        if (window.remoteStream != undefined) {
            window.remoteStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }

        if (window.localStream != undefined) {
            window.localStream.getTracks().forEach(function (track) {
                track.stop();
            });
        }

        document.getElementById('localVideo').srcObject = null;
        document.getElementById('remoteVideo').srcObject = null;
    }

    goMessageScreen() {
        this.current = this.screens.message;
        if (this.contact != undefined) {
            this.current.loadSavedMessages(this.contact);
            this.activeContainer('container-write-msj');
            this.current.message.focus();
            this.current.message.value = '';
        } else {
            console.log('this.contact undefined, cant load contact info');
        }
    }

}

