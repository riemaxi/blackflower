import { config } from "../config.js";

export class IAddContact {
    constructor(handler) {
        console.log('IAddContact constructor');
    }

    onIAddContactEvent(e, ctx) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'add-contact-btn':
                        console.log('go to action:', e.target.id)
                        this.addContact(ctx)
                        break;
                    case 'cancel-add-contact-btn':
                        console.log('go to action:', e.target.id)
                        this.cancelAddContact(ctx)
                        break;
                    case 'preview':
                        console.log('go to action:', e.target.id)
                        break;
                    default:
                        break;
                }
            default:
                break;
        }
    }

    addContact(ctx) {
        let psName = (document.getElementById('contact-pers-name').value).replace(/\s+/g, '');
        let psKey = (document.getElementById('contact-pers-key').value).replace(/\s+/g, '');
        if (psName !="" && psKey != "") {
            // Personal
            let avatar = document.getElementById('preview').src == window.location.origin + '/images/add-avatar.svg' ? 'images/user2.svg' : document.getElementById('preview').src
            let personalName = psName;
            let personalSurname = document.getElementById('contact-pers-surname').value;
            let personalPhone = document.getElementById('contact-pers-phone').value;
            let personalMobile = document.getElementById('contact-pers-mobile').value;
            let personalKey = psKey;
            let personalEmail = document.getElementById('contact-pers-email').value;
            let personalNote = document.getElementById('contact-pers-note').value;
            // Profesional
            let profesionalName = document.getElementById('contact-prof-name').value;
            let profesionalSurname = document.getElementById('contact-prof-surname').value;
            let profesionalProfesion = document.getElementById('contact-prof-profesion').value;
            let profesionalCompany = document.getElementById('contact-prof-company').value;
            let profesionalPhone = document.getElementById('contact-prof-phone').value;
            let profesionalMobile = document.getElementById('contact-prof-mobile').value;
            let profesionalKey = document.getElementById('contact-prof-key').value;
            let profesionalEmail = document.getElementById('contact-prof-email').value;
            let profesionalNote = document.getElementById('contact-prof-note').value;

            const contact = {
                avatar, personalName, personalSurname, personalPhone, personalMobile, personalKey, personalEmail, personalNote,
                profesionalName, profesionalSurname, profesionalProfesion, profesionalCompany, profesionalPhone, profesionalMobile,
                profesionalKey, profesionalEmail, profesionalNote
            }

            if (ctx.editContact) {
                config.contacts = config.contacts.filter( contact => contact.personalKey != personalKey )
            }
            config.contacts.push(contact)
            console.log(config.contacts);
            localStorage.setItem('contacts-' + config.accessKey, JSON.stringify({ contacts: config.contacts }));
            
        //    this.updateContactInfoService(ctx)

            ctx.current.clearScreen(ctx)
            ctx.current = ctx.screens.contacts;
            ctx.current.getContacts()
            ctx.activeContainer('container-contacts')
            swal("Success!", {
                icon: "success",
            });
        } else {
            swal("Personal Name / AccessKey required!", {
                icon: "warning",
            });
        }
        
    }

    /* updateContactInfoService(ctx){
        ctx.reply(config.accessKey, config.peerPersonalStorage, {
            context: 'rintalk',
            subject: 'add',
            detail: {
                owner: {
                    accesskey: config.accessKey
                },                   
                data: config.contacts
            }
        })
    } */

    cancelAddContact(ctx) {
        ctx.current.clearScreen()
        ctx.current = ctx.screens.contacts;
        ctx.activeContainer('container-contacts')
    }

    clearScreen(){
        document.getElementById('preview').src = 'images/add-avatar.svg'
        document.getElementById('contact-pers-name').value = ''
        document.getElementById('contact-pers-surname').value = ''
        document.getElementById('contact-pers-phone').value = ''
        document.getElementById('contact-pers-mobile').value = ''
        document.getElementById('contact-pers-key').value = ''
        document.getElementById('contact-pers-email').value = ''
        document.getElementById('contact-pers-note').value = ''

        document.getElementById('contact-prof-name').value = ''
        document.getElementById('contact-prof-surname').value = ''
        document.getElementById('contact-prof-profesion').value = ''
        document.getElementById('contact-prof-company').value = ''
        document.getElementById('contact-prof-phone').value = ''
        document.getElementById('contact-prof-mobile').value = ''
        document.getElementById('contact-prof-key').value = ''
        document.getElementById('contact-prof-email').value = ''
        document.getElementById('contact-prof-note').value = ''
    }

    loadEditInfo(ctx){
        document.getElementById('preview').src = ctx.contact.avatar
        document.getElementById('contact-pers-name').value = ctx.contact.personalName
        document.getElementById('contact-pers-surname').value = ctx.contact.personalSurname
        document.getElementById('contact-pers-phone').value = ctx.contact.personalPhone
        document.getElementById('contact-pers-mobile').value = ctx.contact.personalMobile
        document.getElementById('contact-pers-key').value = ctx.contact.personalKey
        document.getElementById('contact-pers-email').value = ctx.contact.personalEmail
        document.getElementById('contact-pers-note').value = ctx.contact.personalNote

        document.getElementById('contact-prof-name').value = ctx.contact.profesionalName
        document.getElementById('contact-prof-surname').value = ctx.contact.profesionalSurname
        document.getElementById('contact-prof-profesion').value = ctx.contact.personalNote
        document.getElementById('contact-prof-company').value = ctx.contact.profesionalCompany
        document.getElementById('contact-prof-phone').value = ctx.contact.profesionalPhone
        document.getElementById('contact-prof-mobile').value = ctx.contact.profesionalMobile
        document.getElementById('contact-prof-key').value = ctx.contact.profesionalKey
        document.getElementById('contact-prof-email').value = ctx.contact.profesionalEmail
        document.getElementById('contact-prof-note').value = ctx.contact.profesionalNote
    }

}