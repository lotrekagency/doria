import {CookieBox} from '../lib/doria'

let assert = require('chai').assert
let EventEmitter = require('events');

describe('Doria Cookie box', function () {

  it('renders without problems', function () {
    let doria = new CookieBox();
    assert.equal(doria.render(), '<p></p>');
  });


  it('stores cookie settings', function () {
    let doria = new CookieBox();
    doria.addCookieSettings('default', 'Default', 'Accept default cookies', true);
    doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies');
    doria.addCookieSettings('performances', 'Performances', 'Accept Performances cookies');
    assert.equal(doria._cookieSettings['default'].label, 'Default');
    assert.equal(doria._cookieSettings['default'].mandatory, true);
    assert.equal(doria._cookieSettings['marketing'].label, 'Marketing');
    assert.equal(doria._cookieSettings['marketing'].mandatory, false);
  });

  it('calls appropriate functions after bake', function (done) {
    let doria = new CookieBox();
    doria.addCookieSettings('default', 'Default', 'Accept default cookies', true);

    var emitter = new EventEmitter();
    emitter.on('default', done);

    doria.on('default', () => {
        emitter.emit('default');
    });

    doria.bake();
  });

});
