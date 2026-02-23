describe('debounce', function () {
  before(function () {
    this.clock = sinon.useFakeTimers();
  });

  after(function () {
    this.clock.restore();
  });

  it('for et kald - kører den én gang efter givent antal millisekunder', function () {
    const f = sinon.spy();
    const debounced = debounce(f, 1000);

    debounced('test');
    assert(f.notCalled, 'ikke kaldt med det samme');
    this.clock.tick(1000);
    assert(f.calledOnceWith('test'), 'kaldt efter 1000ms');
  });

  it('for 3 kald - kører den sidste efter givent antal millisekunder', function () {
    const f = sinon.spy();
    const debounced = debounce(f, 1000);

    debounced('a');
    setTimeout(() => debounced('b'), 200); // ignoreret (for tidligt)
    setTimeout(() => debounced('c'), 500); // kører (1000 ms passeret)
    this.clock.tick(1000);

    assert(f.notCalled, 'ikke kaldt efter 1000ms');

    this.clock.tick(500);

    assert(f.calledOnceWith('c'), 'kaldt efter 1500ms');
  });

  it('beholder konteksten af kaldet', function () {
    let obj = {
      f() {
        assert.equal(this, obj);
      },
    };

    obj.f = debounce(obj.f, 1000);
    obj.f('test');
    this.clock.tick(5000);
  });

});
