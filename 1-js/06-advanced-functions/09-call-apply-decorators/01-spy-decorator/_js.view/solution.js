function spy(func) {

  function wrapper(...args) {
    // bruger ...args i stedet for arguments for at gemme et "rigtigt" array i wrapper.calls
    wrapper.calls.push(args);
    return func.apply(this, args);
  }

  wrapper.calls = [];

  return wrapper;
}
