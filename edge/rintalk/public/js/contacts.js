import { config } from "../config.js";

export class IContacts {
    constructor(handler) {
        console.log('IContacts constructor');

        document.getElementById('search-contact').value=''
        document.getElementById('search-contact').addEventListener("keyup", () => {
            let stored = localStorage.getItem('contacts-' + config.accessKey);
            if (stored != null) {
                const conts = JSON.parse(stored)
                config.contacts = conts.contacts
                config.contacts.sort(this.SortArray)
                let search = document.getElementById('search-contact').value.toLowerCase()
                if (search!='') {
                    let filtered = config.contacts.filter( c => c.personalName.toLowerCase().includes(search) || c.personalKey.toLowerCase().includes(search))
    
                    this.renderContacts(filtered)
                } else {
                    this.renderContacts(config.contacts)
                }     
                
            } else {
                config.contacts = [];
            }
        });
    }

    onIContactsEvent(e, ctx) {
        console.log(e.target.className);
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'add-contact':
                        console.log('go to action:', e.target.id);
                        ctx.current = ctx.screens.addContact;
                        if (ctx.editContact) {
                            ctx.current.clearScreen();
                        }                        
                        document.getElementById('preview').src = 'images/add-avatar.svg';
                        document.getElementById('title-add-contact').innerHTML = 'ADD CONTACT';
                        ctx.editContact = false;
                        ctx.activeContainer('container-add-contact');
                        break;
                    default:
                        break;
                }
                switch (e.target.className) {
                    case 'call':
                        console.log('go to action call:', e.target.id)
                        ctx.screens.personalinfo.loadPersonalInfo(e.target.id, ctx);
                        ctx.goCallingScreen(false);
                        break;
                    case 'video': //message
                        console.log('go to action message:', e.target.id)
                        ctx.screens.personalinfo.loadPersonalInfo(e.target.id, ctx);
                        ctx.goMessageScreen();
                        break;
                    case 'name':
                        console.log('go to action contact profile:', e.target.id)
                        this.goPersonalInfo(ctx, e.target.id);
                        break;
                    case 'avatar':
                        console.log('go to action  contact profile:', e.target.id)
                        this.goPersonalInfo(ctx, e.target.id);
                        break;
                    default:
                        break;
                }
            default:
                break;
        }
    }

    goPersonalInfo(ctx, id) {
        ctx.current = ctx.screens.personalinfo;
        ctx.current.loadPersonalInfo(id, ctx);
        ctx.activeContainer('container-personal-info')
    }

    getContacts() {
        let stored = localStorage.getItem('contacts-' + config.accessKey);
        if (stored != null) {
            const conts = JSON.parse(stored)
            config.contacts = conts.contacts
            config.contacts.sort(this.SortArray)

            this.renderContacts(config.contacts)
        } else {
            config.contacts = [];
        }
    }
    renderContacts(contacts){
        
            let contactsList = document.getElementById('contacts-list');
            let HTML = ''

            for (let i = 0; i < contacts.length; i++) {
                if (i == 0) {
                    HTML += `
                                                <div class="empty"></div>
                                                <div class="leters-container">
                                                    <h2 class="leter">${contacts[i].personalName[0].toUpperCase()}</h2>
                                                </div>
                                            `
                }
                if (i > 0 && i < contacts.length &&
                    contacts[i - 1].personalName[0].toUpperCase() != contacts[i].personalName[0].toUpperCase()) {
                    HTML += `
                                                <div class="leters-container">
                                                    <h2 class="leter">${contacts[i].personalName[0].toUpperCase()}</h2>
                                                </div>
                                            `
                }
                    HTML += `
                                        <div class="contacts">
                                            <div class="circle-green"></div>
                                            <img  id="${contacts[i].personalKey}" src="${contacts[i].avatar}" alt="" class="avatar"/>
                                            <p  id="${contacts[i].personalKey}" class="name">${contacts[i].personalName}</p>
                                        
                                            <div class="div-chat">                
                                            <a><img src="images/chat.svg" alt="" class="video" id="${contacts[i].personalKey}"></a> 
                                            <span class="number-msj" id="msj-${contacts[i].personalKey}" style="visibility: hidden;">0</span>
                                            </div>
                                            
                                            <div class="div-call">              
                                            <a><img src="images/call.svg" alt="" class="call" id="${contacts[i].personalKey}"></a>
                                            <span class="number-call" id="call-${contacts[i].personalKey}" style="visibility: hidden;">0</span>
                                            </div>

                                        </div>
                                        `
            }
            HTML += `
                                        <div class="empty2"></div>
                                    `
            contactsList.innerHTML = HTML;       
    }
    SortArray(x, y) {
        if (x.personalName.toUpperCase() < y.personalName.toUpperCase()) { return -1; }
        if (x.personalName.toUpperCase() > y.personalName.toUpperCase()) { return 1; }
        return 0;
    }
}