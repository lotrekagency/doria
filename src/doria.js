import {render} from './template';
import doriaBannerTpl from './templates/doria_banner_tpl.html';
import doriaSettingsTpl from './templates/doria_settings_tpl.html';
import getCurrentLocation from './utils'

import './styles/base.scss';


function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function checkUncheckCheckboxes(checkValue) {
    let boxes = document.getElementsByClassName('cbx--custom');
    for (let i = 0 ; i < boxes.length ; i++) {
        if (!boxes[i].disabled) {
            boxes[i].checked = checkValue;
        }
    }
}

function saveConfig() {
    let config = {
        isAccepted: this.isAccepted,
        acceptedCookies: [],
        firstLocation: this.firstLocation
    };
    if (!this.firstLocation) {
        config.firstLocation = getCurrentLocation();
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
    if (this.isAccepted) {
        for(let prop in this.cookies){
            if( config.acceptedCookies.includes(prop)){
                this.cookies[prop].accepted = true;
                if (this.cookies[prop].handler) {
                    this.cookies[prop].handler();
                }
            } else{
                this.cookies[prop].accepted = false;
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
    let cookieName = '';
    let cookie = undefined;
    if (event) {
        for (let i = 0 ; i < event.target.length ; i++) {
            cookie = event.target[i];
            cookieName = cookie.name;
            if (cookieName in this.cookies) {
                if (cookie.checked === true && this.cookies[cookieName].handler) {
                    this.cookies[cookieName].accepted = true;
                    if (this.cookies[cookieName]) {
                        this.cookies[cookieName].handler();
                    }
                    selectedCookies.push(cookieName);
                }
                if (cookie.checked === false) {
                    this.cookies[cookieName].accepted = false;

                    for (let j = 0 ; j <  this.cookies[cookieName].cookies.length ; j++) {
                        deleteCookie.bind(this)(this.cookies[cookieName].cookies[j]);
                    }
                }
            }
        }
    } else {
        for (cookieName in this.cookies) {
            if (this.cookies[cookieName].accepted  && this.cookies[cookieName].handler) {
                this.cookies[cookieName].handler();
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

    addCookieSettings(key, label, description, cookies, mandatory=false, preSelected=true) {
        this.cookies[key] = {
            label, description, cookies, mandatory
        };
        this.cookies[key].accepted = preSelected;
    }

    bake() {
        restoreConfig.bind(this)();
        if (!this.isAccepted && this.options.isAcceptedOnNavigation && this.firstLocation) {
            if (this.firstLocation != getCurrentLocation()) {
                this.isAccepted = true;
                saveConfig.bind(this)();
                restoreConfig.bind(this)();
            }
        }
        if (!this.isAccepted && !this.options.onlySettings) {
            render('doria_banner', 'doria_banner_content', doriaBannerTpl, {
                doria: this
            });
            this.showBanner();
        }
        render('doria_settings', 'doria_settings_content', doriaSettingsTpl, {
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
                onAcceptCookies.bind(this)();
                this.hideBanner();
                return false;
            };
        }
        let doriaAcceptAllBtn = document.getElementById('doria_btn_acceptall');
        if (doriaAcceptAllBtn) {
            doriaAcceptAllBtn.onclick = (event) => {
                checkUncheckCheckboxes(true);
            };
        }
        let doriaRefuseAllBtn = document.getElementById('doria_btn_refuseall');
        if (doriaRefuseAllBtn) {
            doriaRefuseAllBtn.onclick = (event) => {
                checkUncheckCheckboxes(false);
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

        if (!this.isAccepted && this.options.isAcceptedOnNavigation) {
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
