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
                    default:
                        break;
                }
            default:
                break;
        }
    }

    addContact(ctx) {

        // Personal
        let avatar = document.getElementById('preview').src == window.location.origin + '/images/add-avatar.svg' ? 'images/user2.svg' : document.getElementById('preview').src
        let personalName = document.getElementById('contact-pers-name').value;
        let personalSurname = document.getElementById('contact-pers-surname').value;
        let personalPhone = document.getElementById('contact-pers-phone').value;
        let personalMobile = document.getElementById('contact-pers-mobile').value;
        let personalKey = document.getElementById('contact-pers-key').value;
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
        config.contacts.push(contact)
        console.log(config.contacts);
        localStorage.setItem('contacts-' + config.accessKey, JSON.stringify({ contacts: config.contacts }));


        ctx.current = ctx.screens.contacts;
        ctx.current.getContacts()
        ctx.activeContainer('container-contacts')

        document.getElementById('preview').src = 'images/user2.svg'
        document.getElementById('contact-pers-name').value = ''
        document.getElementById('contact-pers-surname').value = ''
        document.getElementById('contact-pers-phone').value = ''
        document.getElementById('contact-pers-mobile').value = ''
        document.getElementById('contact-pers-key').value = ''
        document.getElementById('contact-pers-email').value = ''
        document.getElementById('contact-prof-profesion').value = ''
        document.getElementById('contact-prof-company').value = ''
        document.getElementById('contact-prof-phone').value = ''
        document.getElementById('contact-prof-mobile').value = ''
        document.getElementById('contact-prof-email').value = ''
        document.getElementById('contact-prof-note').value = ''
    }

    cancelAddContact(ctx) {
        ctx.current = ctx.screens.contacts;
        ctx.activeContainer('container-contacts')

        document.getElementById('preview').src = 'images/add-avatar.svg'
        document.getElementById('contact-pers-name').value = ''
        document.getElementById('contact-pers-surname').value = ''
        document.getElementById('contact-pers-phone').value = ''
        document.getElementById('contact-pers-mobile').value = ''
        document.getElementById('contact-pers-key').value = ''
        document.getElementById('contact-pers-email').value = ''
        document.getElementById('contact-prof-profesion').value = ''
        document.getElementById('contact-prof-company').value = ''
        document.getElementById('contact-prof-phone').value = ''
        document.getElementById('contact-prof-mobile').value = ''
        document.getElementById('contact-prof-email').value = ''
        document.getElementById('contact-prof-note').value = ''
    }

}