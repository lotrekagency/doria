import CookieBox from '../src/doria'

let assert = require('chai').assert
let EventEmitter = require('events');

describe('Doria Cookie box', function () {

  it('renders without problems', function () {
    let doria = new CookieBox();

  });


  it('stores cookie settings', function () {
    let doria = new CookieBox();
    doria.addCookieSettings('default', 'Default', 'Accept default cookies', true);
    doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies');
    doria.addCookieSettings('performances', 'Performances', 'Accept Performances cookies');
    assert.equal(doria.cookies['default'].label, 'Default');
    assert.equal(doria.cookies['default'].mandatory, true);
    assert.equal(doria.cookies['marketing'].label, 'Marketing');
    assert.equal(doria.cookies['marketing'].mandatory, false);
  });

  it('calls appropriate functions after bake', function (done) {
    let doria = new CookieBox();
    doria.addCookieSettings('default', 'Default', 'Accept default cookies', true);

    var emitter = new EventEmitter();
    emitter.on('default', done);

    doria.on('default', () => {
        emitter.emit('default');
    });
    emitter.emit('default');
    doria.bake();
  });

});
