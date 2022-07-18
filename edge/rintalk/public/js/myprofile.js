import { config } from "../config.js";

export class IMyProfile {
    constructor() {
        console.log('IMyProfile constructor');
    }

    onIMyProfileEvent(e, ctx) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'info-cancel-btn':
                        this.getContactInfo();
                        ctx.goContactsScreen();
                        break;
                    case 'info-ok-btn':
                        this.saveContactInfo();
                        ctx.goContactsScreen();
                        break;
                    case 'pers-info-share-btn':
                        this.sharePersonalInfo();
                        break;
                    case 'prof-info-share-btn':
                        this.shareProfesionalInfo();
                        break;

                    default:
                        break;
                }

            default:
                break;
        }
    }

    empty() {
        document.getElementById('preview-profile').src = 'images/myprof1.svg'
        document.getElementById('profile-pers-name').value = config.accessKey
        document.getElementById('profile-pers-surname').value = ''
        document.getElementById('profile-pers-phone').value = ''
        document.getElementById('profile-pers-mobile').value = ''
        document.getElementById('profile-pers-key').value = config.accessKey
        document.getElementById('profile-pers-email').value = ''
        document.getElementById('profile-pers-note').value = ''
        // Profesional
        document.getElementById('preview-profile1').src = 'images/myprof2.svg'
        document.getElementById('profile-prof-name').value = ''
        document.getElementById('profile-prof-surname').value = ''
        document.getElementById('profile-prof-profesion').value = ''
        document.getElementById('profile-prof-company').value = ''
        document.getElementById('profile-prof-phone').value = ''
        document.getElementById('profile-prof-mobile').value = ''
        document.getElementById('profile-prof-key').value = ''
        document.getElementById('profile-prof-email').value = ''
        document.getElementById('profile-prof-note').value = ''
    }

    getContactInfo() {
        this.empty();
        console.log('getContactInfo: get saved contact info and load it.');
        let stored = localStorage.getItem('profile-' + config.accessKey);
        if (stored != null) {
            const myProf = JSON.parse(stored)
            config.profile = myProf.profile

            document.getElementById('preview-profile').src = config.profile.personalAvatar
            document.getElementById('profile-pers-name').value = config.profile.personalName
            document.getElementById('profile-pers-surname').value = config.profile.personalSurname
            document.getElementById('profile-pers-phone').value = config.profile.personalPhone
            document.getElementById('profile-pers-mobile').value = config.profile.personalMobile
            document.getElementById('profile-pers-key').value = config.accessKey
            document.getElementById('profile-pers-email').value = config.profile.personalEmail
            document.getElementById('profile-pers-note').value = config.profile.personalNote
            // Profesional
            document.getElementById('preview-profile1').src = config.profile.profesionalAvatar
            document.getElementById('profile-prof-name').value = config.profile.profesionalName
            document.getElementById('profile-prof-surname').value = config.profile.profesionalSurname
            document.getElementById('profile-prof-profesion').value = config.profile.profesionalProfesion
            document.getElementById('profile-prof-company').value = config.profile.profesionalCompany
            document.getElementById('profile-prof-phone').value = config.profile.profesionalPhone
            document.getElementById('profile-prof-mobile').value = config.profile.profesionalMobile
            document.getElementById('profile-prof-key').value = config.profile.profesionalKey
            document.getElementById('profile-prof-email').value = config.profile.profesionalEmail
            document.getElementById('profile-prof-note').value = config.profile.profesionalNote

        } else {
            console.log('no contact info found!');
            this.saveContactInfo();
           
        }
    }

    saveContactInfo() {
        console.log('saveContactInfo: save contact info.');
        // Personal
        let personalAvatar = document.getElementById('preview-profile').src
        let personalName = document.getElementById('profile-pers-name').value;
        let personalSurname = document.getElementById('profile-pers-surname').value;
        let personalPhone = document.getElementById('profile-pers-phone').value;
        let personalMobile = document.getElementById('profile-pers-mobile').value;
        let personalKey = config.accessKey;
        let personalEmail = document.getElementById('profile-pers-email').value;
        let personalNote = document.getElementById('profile-pers-note').value;
        // Profesional
        let profesionalAvatar = document.getElementById('preview-profile1').src
        let profesionalName = document.getElementById('profile-prof-name').value;
        let profesionalSurname = document.getElementById('profile-prof-surname').value;
        let profesionalProfesion = document.getElementById('profile-prof-profesion').value;
        let profesionalCompany = document.getElementById('profile-prof-company').value;
        let profesionalPhone = document.getElementById('profile-prof-phone').value;
        let profesionalMobile = document.getElementById('profile-prof-mobile').value;
        let profesionalKey = document.getElementById('profile-prof-key').value;
        let profesionalEmail = document.getElementById('profile-prof-email').value;
        let profesionalNote = document.getElementById('profile-prof-note').value;

        const myProfile = {
            personalAvatar, personalName, personalSurname, personalPhone, personalMobile, personalKey, personalEmail, personalNote,
            profesionalAvatar, profesionalName, profesionalSurname, profesionalProfesion, profesionalCompany, profesionalPhone,
            profesionalMobile, profesionalKey, profesionalEmail, profesionalNote
        }
        config.profile = myProfile;
        localStorage.setItem('profile-' + config.accessKey, JSON.stringify({ profile: config.profile }))
    }

    sharePersonalInfo() {
        console.log('sharePersonalInfo');
    }

    shareProfesionalInfo() {
        console.log('shareProfesionalInfo');
    }

}