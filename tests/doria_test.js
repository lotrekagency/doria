import CookieBox from '../src/doria'

let assert = require('chai').assert
let EventEmitter = require('events');

beforeEach(function() {
    localStorage.removeItem('doria__settings')
});

describe('Doria Cookie box', function () {


  it('renders without problems', function () {
    let doria = new CookieBox();
    let doriaAcceptForm = document.getElementById('doria_accept_form');
    assert.equal(doriaAcceptForm, undefined);
    doria.bake();
    doriaAcceptForm = document.getElementById('doria_accept_form');
    assert.notEqual(doriaAcceptForm, undefined);
  });


  it('stores cookie settings', function () {
    let doria = new CookieBox();
    doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);
    doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies', []);
    doria.addCookieSettings('performances', 'Performances', 'Accept Performances cookies', []);
    assert.equal(doria.cookies['default'].label, 'Default');
    assert.equal(doria.cookies['default'].mandatory, true);
    assert.equal(doria.cookies['marketing'].label, 'Marketing');
    assert.equal(doria.cookies['marketing'].mandatory, false);
  });

  it('calls appropriate functions after bake', function (done) {
    let doria = new CookieBox();
    doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);

    let emitter = new EventEmitter();
    emitter.on('default', done);

    doria.on('default', () => {
        emitter.emit('default');
    });

    doria.bake();
    document.querySelector('input[type*="submit"]').click();

  });

  it('storages settings', function (done) {
    let doria = new CookieBox();
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

  it('starts with stored settings', function () {
    let config = {
        isAccepted: this.isAccepted,
        acceptedCookies: ['default', 'marketing']
    }
    localStorage.setItem('doria__settings', JSON.stringify(config));
    let doria = new CookieBox();
    doria.addCookieSettings('default', 'Default', 'Accept default cookies', [], true);
    doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies', []);

    doria.on('default', () => {});

    doria.bake();
    let checkboxes = document.querySelectorAll("input[type='checkbox']");
    for(let i = 0; i < checkboxes.length; i++) {
        assert.equal(checkboxes[i].checked, true);
    }

  });

});
