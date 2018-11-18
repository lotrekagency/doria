import {
    prepare,
    loadScript
} from '../src/index'

let assert = require('chai').assert
let EventEmitter = require('events');

let cleanElements = () => {
    let settingsContent = document.getElementById("doria_settings_content");
    let bannerContent = document.getElementById("doria_banner_content");

    if (bannerContent) {
        bannerContent.outerHTML = "";
    }

    if (settingsContent) {
        settingsContent.outerHTML = "";
    }
};

beforeEach(function () {
    localStorage.removeItem('doria__settings');
});

describe('Doria Cookie box', function () {

    it('renders without problems', function () {
        let doria = prepare();
        let doriaAcceptForm = document.getElementById('doria_accept_form');
        assert.equal(doriaAcceptForm, undefined);
        doria.bake();
        let doriaBannerContent = document.getElementById('doria_banner_content');
        assert.notEqual(doriaBannerContent, undefined);
        doriaAcceptForm = document.getElementById('doria_accept_form');
        assert.notEqual(doriaAcceptForm, undefined);
    });

    it('renders without problems only settings', function () {
        cleanElements();
        let doria = prepare({
            onlySettings: true
        });
        let doriaAcceptForm = document.getElementById('doria_accept_form');
        assert.equal(doriaAcceptForm, undefined);
        doria.bake();
        let doriaBannerContent = document.getElementById('doria_banner_content');
        assert.equal(doriaBannerContent, undefined);
        doriaAcceptForm = document.getElementById('doria_accept_form');
        assert.notEqual(doriaAcceptForm, undefined);
    });

    it('stores cookie settings', function () {
        let doria = prepare();
        doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);
        doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies', []);
        doria.addCookieSettings('performances', 'Performances', 'Accept Performances cookies', []);
        assert.equal(doria.cookies['default'].label, 'Default');
        assert.equal(doria.cookies['default'].mandatory, true);
        assert.equal(doria.cookies['marketing'].label, 'Marketing');
        assert.equal(doria.cookies['marketing'].mandatory, false);
    });

    it('calls appropriate functions after bake', function (done) {
        let doria = prepare();
        doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);

        let emitter = new EventEmitter();
        emitter.on('default', done);

        doria.on('default', () => {
            emitter.emit('default');
        });

        doria.bake();
        document.querySelector('input[type*="submit"]').click();

    });

    it('calls onAccept after click accept button', function (done) {
        let doria = prepare();
        doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);

        let emitter = new EventEmitter();
        emitter.on('accepted', done);

        doria.onAccept(() => {
            emitter.emit('accepted');
        });

        doria.bake();
        document.querySelector('input[type*="submit"]').click();

    });

    it('storages settings', function (done) {
        let doria = prepare();
        doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);

        let settings = JSON.parse(localStorage.getItem('doria__settings'));
        assert.equal(settings, null);

        doria.bake();
        document.querySelector('input[type*="submit"]').click();

        setTimeout(() => {
            let settings = JSON.parse(localStorage.getItem('doria__settings'));
            assert.equal(settings.isAccepted, true);
            done();
        });
    });

    it('starts with mandatory settings', function () {
        let config = {
            isAccepted: this.isAccepted,
            acceptedCookies: ['default', 'marketing']
        }
        localStorage.setItem('doria__settings', JSON.stringify(config));
        let doria = prepare();
        doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);
        doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies', []);

        doria.on('default', () => {});

        doria.bake();
        let checkboxes = document.querySelectorAll("input[type='checkbox']");
        for (let i = 0; i < checkboxes.length; i++) {
            assert.equal(checkboxes[i].checked, true);
        }

    });

    it('deletes cookies on unchecking option and accept', function (done) {
        let config = {
            isAccepted: this.isAccepted,
            acceptedCookies: ['default', 'marketing']
        }
        localStorage.setItem('doria__settings', JSON.stringify(config));

        let simulateDeletion = () => {

            setTimeout(() => {
                assert.include(document.cookie, '_ga');
                assert.include(document.cookie, '_gat');
                assert.include(document.cookie, '_gid');
                let checkboxes = document.querySelectorAll("input[type='checkbox']");
                for (let i = 0; i < checkboxes.length; i++) {
                    assert.equal(checkboxes[i].checked, true);
                    checkboxes[i].click();
                }
                document.querySelector('input[type*="submit"]').click();
                assert.notInclude(document.cookie, '_ga');
                assert.notInclude(document.cookie, '_gat');
                assert.notInclude(document.cookie, '_gid');
                done();
            }, 1000)
        };

        let doria = prepare();
        doria.addCookieSettings(
            'default',
            'Default',
            'Accept default cookies',
            [],
            true
        );
        doria.addCookieSettings(
            'marketing',
            'Marketing',
            'Accept Marketing cookies',
            ['_ga', '_gat', '_gid']
        );
        doria.on('marketing', function () {
            window.ga = function () {
                ga.q.push(arguments)
            };
            ga.q = [];
            ga.l = +new Date;
            ga('create', 'UA-XXXX-Y', {
                "cookieDomain": "none"
            });
            ga('send', 'pageview');
            loadScript("https://www.google-analytics.com/analytics.js").then(
                () => simulateDeletion()
            );

        });

        doria.bake();
        document.querySelector('input[type*="submit"]').click();

    });

});
