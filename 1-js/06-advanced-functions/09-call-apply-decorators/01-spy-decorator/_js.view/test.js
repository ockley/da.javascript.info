describe("spy", function () {
  it("optager kald og gemmer dem i dens egenskab calls", function () {
    function work() { }

    work = spy(work);
    assert.deepEqual(work.calls, []);

    work(1, 2);
    assert.deepEqual(work.calls, [
      [1, 2]
    ]);

    work(3, 4);
    assert.deepEqual(work.calls, [
      [1, 2],
      [3, 4]
    ]);
  });

  it("transperant wrap af funktioner", function () {

    let sum = sinon.spy((a, b) => a + b);

    let wrappedSum = spy(sum);

    assert.equal(wrappedSum(1, 2), 3);
    assert(sum.calledWith(1, 2));
  });


  it("transparent wrap af metoder", function () {

    let calc = {
      sum: sinon.spy((a, b) => a + b)
    };

    calc.wrappedSum = spy(calc.sum);

    assert.equal(calc.wrappedSum(1, 2), 3);
    assert(calc.sum.calledWith(1, 2));
    assert(calc.sum.calledOn(calc));
  });

});
