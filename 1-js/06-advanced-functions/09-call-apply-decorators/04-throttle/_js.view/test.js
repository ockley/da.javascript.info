describe("throttle(f, 1000)", function () {
  let f1000;
  let log = "";

  function f(a) {
    log += a;
  }

  before(function () {
    this.clock = sinon.useFakeTimers();
    f1000 = throttle(f, 1000);
  });

  it("det første kald kører nu", function () {
    f1000(1); // kører nu
    assert.equal(log, "1");
  });

  it("kald ignoreres indtil 1000ms er gået, og det sidste kald kører", function () {
    f1000(3); // (throttling - mindre end 1000ms siden sidste kørsel)
    f1000(2); // (throttling - mindre end 1000ms siden sidste kørsel)
    // efter 1000 ms planlægges kald til f(3) 

    assert.equal(log, "1"); // lige nu er første kald overstået

    this.clock.tick(1000); // efter 1000ms...
    assert.equal(log, "13"); // log==13, kaldet til f1000(3) sker
  });

  it("the third call waits 1000ms after the second call", function () {
    this.clock.tick(100);
    f1000(4); // (throttling - mindre end 1000ms siden sidste kørsel)
    this.clock.tick(100);
    f1000(5); // (throttling - mindre end 1000ms siden sidste kørsel)
    this.clock.tick(700);
    f1000(6); // (throttling - mindre end 1000ms siden sidste kørsel)

    this.clock.tick(100); // nu er 100 + 100 + 700 + 100 = 1000ms passeret

    assert.equal(log, "136"); // det sidste kald var f(6)
  });

  after(function () {
    this.clock.restore();
  });

});

describe('throttle', () => {

  it('kører et videresendt kald én gang', done => {
    let log = '';
    const f = str => log += str;
    const f10 = throttle(f, 10);
    f10('once');

    setTimeout(() => {
      assert.equal(log, 'once');
      done();
    }, 20);
  });

});
