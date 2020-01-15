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
        acceptedCookies: [],
        firstLocation: this.firstLocation
    };
    if (!this.firstLocation) {
        config.firstLocation = window.location.pathname;
    }
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
    this.firstLocation = config.firstLocation;
    let acceptedCookie = undefined;
    if (this.isAccepted) {
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
}

function hide(elementClass) {
    if (document.getElementsByClassName(elementClass)[0]) {
        document.getElementsByClassName(elementClass)[0].classList.add(elementClass + '--hidden');
    }
}

function show(elementClass) {
    if (document.getElementsByClassName(elementClass)[0]) {
        document.getElementsByClassName(elementClass)[0].classList.remove(elementClass + '--hidden');
    }
}

function onAcceptCookies(event) {
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
        this.isAccepted = false;
        this.firstLocation = null;
    }

    reset() {
        this.cookies = {};
        this.isAccepted = false;
        this.firstLocation = null;
    }

    addCookieSettings(key, label, description, cookies, mandatory=false) {
        this.cookies[key] = {
            label, description, cookies, mandatory
        };
        this.cookies[key].accepted = true;
    }

    bake(isAcceptedOnNavigation=false) {
        restoreConfig.bind(this)();
        if (!this.isAccepted && isAcceptedOnNavigation && this.firstLocation) {
            if (this.firstLocation != window.location.pathname) {
                this.isAccepted = true;
            }
        }
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
                onAcceptCookies.bind(this)(event);
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
        let doriaBannerAcceptBtn = document.getElementById('doria_b_accept');
        if (doriaBannerAcceptBtn) {
            doriaBannerAcceptBtn.onclick = (event) => {
                event.preventDefault();
                onAcceptCookies.bind(this)(event);
                this.hideBanner();
                return false;
            };
        }
        let doriaBannerCloseBtn = document.getElementById('doria_b_close');
        if (doriaBannerCloseBtn) {
            doriaBannerCloseBtn.onclick = (event) => {
                event.preventDefault();
                this.hideBanner();
            };
        }
        if (this.options.onlySettings && !this.isAccepted) {
            this.showSettings();
        }

        if (!this.isAccepted && isAcceptedOnNavigation) {
            saveConfig.bind(this)();
        }

    }

    hideBanner() {
        if (this.options.onlySettings) {
            return;
        }
        hide('db');
    }

    hideSettings() {
        hide('ds__wrapper');
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
        show('db');
    }

    showSettings() {
        show('ds__wrapper');
    }

}

export default new CookieBox();
