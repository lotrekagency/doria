import {render} from './template';
import doria_banner_tpl from './templates/doria_banner_tpl.html';
import doria_settings_tpl from './templates/doria_settings_tpl.html';

import './styles/base.scss';


function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function saveConfig() {
    let config = {
        isAccepted: this.isAccepted,
        acceptedCookies: []
    };
    for (let cookieName in this.cookies) {
        if (this.cookies[cookieName].accepted) {
            config.acceptedCookies.push(cookieName);
        }
    }
    localStorage.setItem('doria__settings', JSON.stringify(config));
}

function restoreConfig() {
    let config = localStorage.getItem('doria__settings');
    if (!config) {
        return;
    }
    config = JSON.parse(config);
    this.isAccepted = config.isAccepted;
    for (let acceptedCookie of config.acceptedCookies) {
        if (acceptedCookie in this.cookies) {
            this.cookies[acceptedCookie].accepted = true;
            if (this.cookies[acceptedCookie].handler) {
                this.cookies[acceptedCookie].handler();
            }
        }
    }
}

function hide(elementClass) {
    document.getElementsByClassName(elementClass)[0].classList.add(elementClass + '--hidden')
}

function show(elementClass) {
    document.getElementsByClassName(elementClass)[0].classList.remove(elementClass + '--hidden')
}

function onAccept(event) {
    let selectedCookies = [];
    let cookie_name = '';
    for (let cookie of event.target) {
        cookie_name = cookie.name;
        if (cookie_name in this.cookies) {
            if (cookie.checked === true && this.cookies[cookie_name].handler) {
                this.cookies[cookie_name].accepted = true;
                if (this.cookies[cookie_name]) {
                    this.cookies[cookie_name].handler();
                }
                selectedCookies.push(cookie_name);
            }
            if (cookie.checked === false) {
                this.cookies[cookie_name].accepted = false;

                for (let cookieTarget of this.cookies[cookie_name].cookies) {
                    deleteCookie.bind(this)(cookieTarget);
                }
            }
        }
    }
    this.isAccepted = true;
    saveConfig.bind(this)();
    this.hideSettings();
}

export default class CookieBox {

    constructor(options={}) {
        this.options = options;
        this.cookies = {};
    }

    addCookieSettings(key, label, description, cookies, mandatory=false) {
        this.cookies[key] = {
            label, description, cookies, mandatory
        };
        this.cookies[key].accepted = true;
    }

    bake() {
        restoreConfig.bind(this)();
        if (!this.isAccepted) {
            render('doria_banner', 'doria_banner_content', doria_banner_tpl, {
                doria: this
            });
            this.showBanner();
        }
        render('doria_settings', 'doria_settings_content', doria_settings_tpl, {
            doria: this
        });
        let doriaAcceptForm = document.getElementById('doria_accept_form');
        if (doriaAcceptForm) {
            doriaAcceptForm.onsubmit = (event) => {
                event.preventDefault();
                onAccept.bind(this)(event);
                this.hideBanner();
                return false;
            };
        }
        let doriaSettingsBtn = document.getElementById('doria_settings');
        if (doriaSettingsBtn) {
            doriaSettingsBtn.onclick = (event) => {
                event.preventDefault();
                this.showSettings();
            };
        }
        
    }

    hideBanner() {
        hide('doriabanner');
    }

    hideSettings() {
        hide('doriasettings__wrapper');
    }

    showBanner() {
        show('doriabanner');
    }

    showSettings() {
        show('doriasettings__wrapper');
    }

    on(key, f) {
        this.cookies[key].handler = f;
    }

}
