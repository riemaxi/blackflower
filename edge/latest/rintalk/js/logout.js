export class ILogout {
    constructor() {
        console.log('ILogout constructor');
    }

    onILogoutEvent(e, ctx) {
        switch (e.type) {
            case 'click':
                switch (e.target.id) {
                    case 'cancel-logout-btn':
                        ctx.goContactsScreen();
                        break;
                    case 'logout-btn':
                        localStorage.removeItem('key');
                        localStorage.removeItem('password');
                        location.reload();
                        break;
                    default:
                        break;
                }

            default:
                break;
        }
    }

}