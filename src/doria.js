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

    addCookieSettings(key, label, description, mandatory=false) {
        this.cookies[key] = {
            label, description, mandatory
        }
    }

    bake() {
        this.doriaBannerContentElement = document.createElement('div');
        this.doriaBannerContentElement.setAttribute('id', 'doria_banner_content');
        document.body.appendChild(this.doriaBannerContentElement)
        this.doriaSettingsContentElement = document.createElement('div');
        this.doriaSettingsContentElement.setAttribute('id', 'doria_settings_content');
        document.body.appendChild(this.doriaSettingsContentElement)
        this._appendTempalte(doria_banner_tpl, 'doria_banner');
        this._appendTempalte(doria_settings_tpl, 'doria_settings');
        new Template("doria_settings", "doria_settings_content",{
            doria: this
        }).render();
        new Template("doria_banner", "doria_banner_content",{
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

    _appendTempalte(templateContent, templateId) {
        let newTemplateElement = document.createElement('script');
        newTemplateElement.setAttribute('id', templateId);
        newTemplateElement.setAttribute('type', 'text/html');
        newTemplateElement.innerHTML = templateContent;
        document.body.appendChild(newTemplateElement)
    }

    _onAccept(event) {
        let selectedCookies = [];
        for (let cookie of event.target) {
            if (!(cookie.name in this.cookies))
                continue;
            if (cookie.checked === true && this.cookies[cookie.name].handler) {
                this.cookies[cookie.name].handler();
                selectedCookies.push(cookie.name);
            }
            if (cookie.checked === false) {
                // delete
            }
        }
    }

}
