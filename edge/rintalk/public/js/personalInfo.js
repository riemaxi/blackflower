import { config } from "../config.js";

export class IPersonalInfo {
    constructor(handler) {
        console.log('IPersonalInfo constructor');
    }

    onIPersonalInfoEvent(e, ctx) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'pers-info-call-btn':
                        console.log('go to action:', e.target.id);
                        ctx.goCallingScreen(false);
                        break;
                    case 'pers-info-video-btn':
                        console.log('go to action:', e.target.id);
                        ctx.goCallingScreen(true);
                        break;
                    case 'pers-info-message-btn':
                        console.log('go to action:', e.target.id);
                        ctx.goMessageScreen();
                        break;
                    default:
                        break;
                }
            default:
                break;
        }
    }

    loadPersonalInfo(id, ctx) {
        if (config.contacts.length > 0) {
            ctx.contact = config.contacts.find(c => c.personalKey == id)
            if (ctx.contact != undefined) {

                document.getElementById('personal-avatar').src = ctx.contact.avatar

                let personalInfoHtml = ''

                if (ctx.contact.personalName != '') {
                    personalInfoHtml += `
                        <p class="name-contact">${ctx.contact.personalName} ${ctx.contact.personalSurname}</p>
                    `
                }
                if (ctx.contact.personalKey != '') {
                    personalInfoHtml += `
                        <div class="group-information">
                        <img class="mobile-info" src="images/access-key.svg" alt="">
                        <label for="id-mobile">${ctx.contact.personalKey}</label>
                        </div>
                    `
                }
                if (ctx.contact.personalEmail != '') {
                    personalInfoHtml += `
                        <div class="group-information">
                        <img class="email-info" src="images/email.svg" alt="">
                        <label for="id-email">${ctx.contact.personalEmail}</label>
                        </div>
                    `
                }
                if (ctx.contact.personalMobile != '') {
                    personalInfoHtml += `
                        <div class="group-information">
                        <img class="mobile-info" src="images/mobile.svg" alt="">
                        <label for="id-mobile">${ctx.contact.personalMobile}</label>
                        </div>
                    `
                }
                if (ctx.contact.personalPhone != '') {
                    personalInfoHtml += `
                        <div class="group-information">
                        <img class="mobile-info" src="images/phone.svg" alt="">
                        <label for="id-mobile">${ctx.contact.personalPhone}</label>
                        </div>
                    `
                }
                if (ctx.contact.personalNote != '') {
                    personalInfoHtml += `
                        <div class="group-information">
                        <img class="note-info" src="images/note.svg" alt="">
                        <label for="id-note">${ctx.contact.personalNote}</label>
                        </div>
                    `
                }

                document.getElementById('pers-info-container').innerHTML = personalInfoHtml
            }
        }
        console.log('loadPersonalInfo: ', id);
    }

}