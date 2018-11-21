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
    let cookieName = undefined;
    for (let i = 0 ;  i < this.cookies.length ; i++) {
        cookieName = this.cookies[i];
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
    let acceptedCookie = undefined;
    for (let i = 0 ; i < config.acceptedCookies.length ; i++) {
        acceptedCookie = config.acceptedCookies[i];
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
    let cookie = undefined;
    for (let i = 0 ; i < event.target.length ; i++) {
        cookie = event.target[i];
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

                for (let j = 0 ; j <  this.cookies[cookie_name].cookies.length ; j++) {
                    deleteCookie.bind(this)(this.cookies[cookie_name].cookies[j]);
                }
            }
        }
    }
    this.isAccepted = true;
    saveConfig.bind(this)();
    this.hideSettings();
    if (this.onAcceptFunction) {
        this.onAcceptFunction();
    }
}

class CookieBox {

    constructor() {
        this.cookies = {};
    }

    acceptOnNavigation() {
        saveConfig.bind(this)();
    }

    addCookieSettings(key, label, description, cookies, mandatory=false) {
        this.cookies[key] = {
            label, description, cookies, mandatory
        };
        this.cookies[key].accepted = true;
    }

    bake() {
        restoreConfig.bind(this)();
        if (!this.isAccepted && !this.options.onlySettings) {
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
        if (this.options.onlySettings && !this.isAccepted) {
            this.showSettings();
        }

    }

    hideBanner() {
        if (this.options.onlySettings) {
            return;
        }
        hide('doriabanner');
    }

    hideSettings() {
        hide('doriasettings__wrapper');
    }

    on(key, f) {
        this.cookies[key].handler = f;
    }

    onAccept(onAcceptFunction) {
        this.onAcceptFunction = onAcceptFunction;
    }

    setOptions(options={}) {
        this.options = options;
    }

    showBanner() {
        if (this.options.onlySettings) {
            return;
        }
        show('doriabanner');
    }

    showSettings() {
        show('doriasettings__wrapper');
    }

}

export default new CookieBox();
