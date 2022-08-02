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

                    case 'pers-edit-btn':
                        console.log('go to action:', e.target.id);
                        document.getElementById('title-add-contact').innerHTML = 'EDIT CONTACT';
                        ctx.editContact = true;
                        ctx.current = ctx.screens.addContact;
                        ctx.current.loadEditInfo(ctx);
                        ctx.activeContainer('container-add-contact');
                        break;
                    case 'pers-remove-btn':
                        console.log('go to action:', e.target.id);

                        swal({
                            title: "Are you sure?",
                            text: "Once deleted, you will not be able to recover information!",
                            buttons: true,
                            dangerMode: true,
                          })
                          .then((willDelete) => {
                            if (willDelete) {
                                this.removeContact(ctx);
                                swal("Your contact has been deleted!", {
                                    icon: "success",
                                });
                                ctx.current = ctx.screens.contacts;
                                ctx.current.getContacts()
                                ctx.activeContainer('container-contacts')                                
                            } else {
                                swal("Your contact is safe!");
                            }
                          });
                        break;
                    case 'pers-copy-btn':
                        console.log('go to action:', e.target.id);
                        this.copyContactInfo(ctx);
                        break;
                    case 'pers-share-btn':
                        console.log('go to action:', e.target.id);
                        this.shareContactInfo(ctx);
                        break;
                        
                        
                    default:
                        break;

                    //    document.getElementById('title-add-contact').innerHTML = 'EDIT CONTACT';

                }
            default:
                break;
        }
    }

    shareContactInfo(ctx){
        let cp = '<h3>Personal Information:</h3>'        

        for (let index in ctx.contact){
            if (ctx.contact[index] != '' && index != 'avatar') {
                switch (index) {
                    case 'personalName':
                        cp += `Name: ${ctx.contact[index]}<br>`;
                        break;
                    case 'personalSurname':
                        cp += `Surname: ${ctx.contact[index]}<br>`;
                        break;
                    case 'personalPhone':
                        cp += `Phone: ${ctx.contact[index]}<br>`;
                        break;
                    case 'personalMobile':
                        cp += `Mobile: ${ctx.contact[index]}<br>`;
                        break;
                    case 'personalKey':
                        cp += `AccessKey: ${ctx.contact[index]}<br>`;
                        break;
                    case 'personalEmail':
                        cp += `Email: ${ctx.contact[index]}<br>`;
                        break;
                   
                    default:
                        break;
                }                
            }
        }
        // -------------- Temporal -----------------
        navigator.clipboard.writeText(cp);
        swal("Information Copied!", {
            icon: "success",
        });
        
        /*     ctx.reply(config.accessKey, config.peerPersonalStorage, {
                context: 'rintalk',
                subject: 'get',
                detail: {
                    owner: {
                        accesskey: config.accessKey
                    },                   
                    data: config.contacts
                }
            })
         */
    }

    copyContactInfo(ctx){
        let cp = ''

        for (let index in ctx.contact){
            if (ctx.contact[index] != '' && index != 'avatar') {
                cp += `${index}: ${ctx.contact[index]}, `;
            }
        }
        /* Copy the text inside the text field */
        navigator.clipboard.writeText(cp);
        swal("Information Copied!", {
            icon: "success",
        });
    }

    removeContact(ctx){
        config.contacts = config.contacts.filter( contact => contact.personalKey != ctx.contact.personalKey );
        console.log(config.contacts);
        localStorage.setItem('contacts-' + config.accessKey, JSON.stringify({ contacts: config.contacts }));
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