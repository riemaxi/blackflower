import { config } from "../config.js";

export class ILogin {
    constructor() {
        console.log('ILogin constructor');
    }

    onILoginEvent(e, ctx) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'enter':
                        console.log('go to action:', e.target.id)
                        this.onLogin(ctx)
                        break;
                    case 'new-password-btn':
                        console.log('go to action:', e.target.id);
                        /* test
                        config.accessKey = document.getElementById('key').value;
                        ctx.peerServer();
                        ctx.screens.contacts.getContacts();
                        ctx.screens.myprofile.getContactInfo();
                        ctx.goContactsScreen(); */
                        break;
                    default:
                        break;
                }
            default:
                break;
        }
    }

    // login request
    onLogin(ctx) {
        console.log('onLogin:', this.getLogin())
        if (document.getElementById('remember-pass').checked) {
            console.log('remember key and password');
            localStorage.setItem('key', this.getLogin().accessKey);
            localStorage.setItem('password', this.getLogin().password);
        }
        sessionStorage.setItem('key', this.getLogin().accessKey);
        sessionStorage.setItem('password', this.getLogin().password);
        config.accessKey = this.getLogin().accessKey
        ctx.loadingLoging(true);
        ctx.login(config.accessKey, this.getLogin().password)
    }

    onChangePassword(data) {
        console.log('onChangePassword:', data.accessKey)
    }


    /*
       -----------------  DOM get data -----------------
    */
    // return data from login fields
    getLogin() {
        return { accessKey: document.getElementById('key').value, password: document.getElementById('password').value }
    }
    // return accessKey field
    getAccessKey() {
        return { accessKey: document.getElementById('key').value }
    }
}