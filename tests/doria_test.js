import {
    prepare,
    loadScript
} from '../src/index';

let assert = require('chai').assert;
let EventEmitter = require('events');
var simple = require('simple-mock');


let cleanElements = () => {
    let settingsContent = document.getElementById("doria_settings_content");
    let bannerContent = document.getElementById("doria_banner_content");

    if (settingsContent)
        settingsContent.parentNode.removeChild(settingsContent);
    if (bannerContent)
        bannerContent.parentNode.removeChild(bannerContent);
};

let doria;

afterEach(function () {
    simple.restore();
});

beforeEach(function () {
    if (doria) {
        doria.reset();
    }
    cleanElements();
    global.localStorage.removeItem('doria__settings');
});

describe('Doria Cookie box', function () {

    it('renders without problems', function () {
        doria = prepare();
        let doriaAcceptForm = document.getElementById('doria_accept_form');
        assert.equal(doriaAcceptForm, undefined);
        doria.bake();
        let doriaBannerContent = document.getElementById('doria_banner_content');
        assert.notEqual(doriaBannerContent, undefined);
        doriaAcceptForm = document.getElementById('doria_accept_form');
        assert.notEqual(doriaAcceptForm, undefined);
    });

    it('renders without problems only settings', function () {
        doria = prepare({
            onlySettings: true
        });
        let doriaAcceptForm = document.getElementById('doria_accept_form');
        assert.equal(doriaAcceptForm, undefined);
        doria.bake();
        let doriaBannerContent = document.getElementById('doria_banner_content');
        assert.equal(doriaBannerContent, undefined);
        doriaAcceptForm = document.getElementById('doria_accept_form');
        assert.notEqual(doriaAcceptForm, undefined);
        // hideBanner and showBanner are now disabled
        doria.hideBanner();
        doria.showBanner();
        assert.equal(doriaBannerContent, undefined);
    });

    it('stores cookie settings', function () {
        doria = prepare();
        doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);
        doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies', []);
        doria.addCookieSettings('performances', 'Performances', 'Accept Performances cookies', []);
        assert.equal(doria.cookies['default'].label, 'Default');
        assert.equal(doria.cookies['default'].mandatory, true);
        assert.equal(doria.cookies['marketing'].label, 'Marketing');
        assert.equal(doria.cookies['marketing'].mandatory, false);
    });

    it('calls appropriate functions after bake', function (done) {
        doria = prepare();
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
        doria = prepare();
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
        doria = prepare();
        doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);

        let settings = JSON.parse(global.localStorage.getItem('doria__settings'));
        assert.equal(settings, null);

        doria.bake();
        document.querySelector('input[type*="submit"]').click();

        setTimeout(() => {
            let settings = JSON.parse(global.localStorage.getItem('doria__settings'));
            assert.equal(settings.isAccepted, true);
            done();
        });
    });

    it('starts with mandatory settings', function () {
        let config = {
            isAccepted: false,
            acceptedCookies: ['default', 'marketing']
        };
        global.localStorage.setItem('doria__settings', JSON.stringify(config));
        doria = prepare();
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
            }, 1000);
        };

        doria = prepare({
            onlySettings: true
        });
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

    it('shows settings on banner click', function () {
        doria = prepare({settingsButtonLabel: "Impostazioni"});
        doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);
        doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies', []);
        doria.on('default', () => {});
        doria.bake();
        assert.equal(document.getElementsByClassName('ds__wrapper--hidden').length, 1);
        document.getElementById('doria_settings').click();
        assert.equal(document.getElementsByClassName('ds__wrapper--hidden').length, 0);
    });

    // it('stores settings on acceptance with navigation', function () {
    //     doria = prepare();
    //     doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);
    //     doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies', []);
    //     doria.on('default', () => {});
    //     doria.bake(true);
    //     let settings = JSON.parse(global.localStorage.getItem('doria__settings'));
    //     assert.equal(settings.isAccepted, false);
    //     assert.equal(settings.firstLocation, global.window.location.pathname);

    //     doria.reset();
    //     doria = prepare();
    //     doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);
    //     doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies', []);
    //     doria.on('default', () => {});
    //     doria.bake(true);
    //     settings = JSON.parse(global.localStorage.getItem('doria__settings'));
    //     assert.equal(settings.isAccepted, false);
    //     assert.equal(settings.firstLocation, global.window.location.pathname);

    //     //simple.mock(window, 'location', {pathname : '/newpath'});

    //     //let originalWindow = window;
    //     var localContext = {
    //         location:{
    //             pathname: "http://www.website.com?varName=foo"
    //         }
    //     };
    //     window = { location : { pathname : 'example.com' } };
    //     //console.log(window.location.pathname);
    //     //window = originalWindow;
    // });

});
