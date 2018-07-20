export default class CookieBox {

    constructor() {
        this._cookieSettings = {};
    }

    render() {
        return '<p></p>';
    }

    addCookieSettings(key, label, description, mandatory=false) {
        this._cookieSettings[key] = {
            label, description, mandatory
        }
    }

    on(key, f) {
        this._cookieSettings[key].handler = f;
    }

    bake() {
        for (const [key, value] of Object.entries(this._cookieSettings)) {
            if (value.handler) {
                value.handler();
            }
        }
    }
}
