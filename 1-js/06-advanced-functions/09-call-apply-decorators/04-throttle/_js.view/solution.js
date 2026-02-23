function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) {
      // memoriser sidste sæt argumenter der skal kaldes efter cooldown
      savedArgs = arguments;
      savedThis = this;
      return;
    }

    // ellers gå til cooldown state
    func.apply(this, arguments);

    isThrottled = true;

    // planlæg at nulstille isThrottled efter forsinkelsen
    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        // hvis der har været yderligere kald har savedThis/savedArgs de sidste
        // rekursivt kald kører funktionen og sætter cooldown igen
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}