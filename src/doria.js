import {Template} from './template';
import doria_banner_tpl from './templates/doria_banner_tpl.html';
import doria_settings_tpl from './templates/doria_settings_tpl.html';

export default class CookieBox {

    constructor() {
        this.title = 'Cookie settings';
        this.subtitle = 'Select the cookies you want to accept'
        this.acceptButtonLabel = 'Accept';
        this.settingsButtonLabel = 'Settings';
        this.closeButtonLabel = 'Close';
        this.cookies = {};
    }

    addCookieSettings(key, label, description, cookies, mandatory=false) {
        this.cookies[key] = {
            label, description, cookies, mandatory
        };
        this.cookies[key].accepted = false;
    }

    bake() {
        this._restoreConfig();
        this.doriaBannerContentElement = document.createElement('div');
        this.doriaBannerContentElement.setAttribute('id', 'doria_banner_content');
        document.body.appendChild(this.doriaBannerContentElement)
        this.doriaSettingsContentElement = document.createElement('div');
        this.doriaSettingsContentElement.setAttribute('id', 'doria_settings_content');
        document.body.appendChild(this.doriaSettingsContentElement)
        new Template("doria_settings", "doria_settings_content", doria_settings_tpl, {
            doria: this
        }).render();
        new Template("doria_banner", "doria_banner_content", doria_banner_tpl, {
            doria: this
        }).render();
        this.doriaAcceptForm = document.getElementById('doria_accept_form');
        this.doriaAcceptForm.onsubmit = (event) => {
            event.preventDefault();
            this._onAccept(event);
            return false;
        }
    }

    on(key, f) {
        this.cookies[key].handler = f;
    }

    _deleteCookie(name) {
    //     document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    _onAccept(event) {
        let selectedCookies = [];
        for (let cookie of event.target) {
            if (!(cookie.name in this.cookies))
                continue;
            if (cookie.checked === true && this.cookies[cookie.name].handler) {
                this.cookies[cookie.name].accepted = true;
                if (this.cookies[cookie.name])
                    this.cookies[cookie.name].handler();
                selectedCookies.push(cookie.name);
            }
            if (cookie.checked === false) {
                this.cookies[cookie.name].accepted = false;
                for (let cookieTarget of this.cookies[cookie.name].cookies) {
                    this._deleteCookie(cookieTarget);
                }
            }
        }
        this.isAccepted = true;
        this._saveConfig();
    }

    _restoreConfig() {
        let config = localStorage.getItem('doria__settings');
        if (!config) {
            return;
        }
        config = JSON.parse(config);
        this.isAccepted = config.isAccepted;
        for (let acceptedCookie of config.acceptedCookies) {
            if (acceptedCookie in this.cookies) {
                this.cookies[acceptedCookie].accepted = true;
                if (this.cookies[acceptedCookie].handler)
                    this.cookies[acceptedCookie].handler();
            }
        }
    }

    _saveConfig() {
        let config = {
            isAccepted: this.isAccepted,
            acceptedCookies: []
        }
        for (const [key, value] of Object.entries(this.cookies)) {
            if (value.accepted) {
                config.acceptedCookies.push(key);
            }
        }
        localStorage.setItem('doria__settings', JSON.stringify(config));
    }

}
