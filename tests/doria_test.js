import DoriaCookieBox from '../src/doria'

var assert = require('chai').assert


describe('Doria Cookie box', function () {

  it('renders without problems', function () {
    var doria = new DoriaCookieBox();
    assert.equal(doria.render(), '<p></p>');
  });


  it('storages cookie settings', function () {
    var doria = new DoriaCookieBox();
    doria.addCookieSettings('default', 'Default', 'Accept default cookies', true);
    doria.addCookieSettings('marketing', 'Marketing', 'Accept Marketing cookies');
    doria.addCookieSettings('performances', 'Performances', 'Accept Performances cookies');
    assert.equal(doria.render(), '<p></p>');
  });

});
