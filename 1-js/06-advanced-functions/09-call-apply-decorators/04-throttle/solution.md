```js demo
function throttle(func, ms) {

  let isThrottled = false,
    savedArgs,
    savedThis;

  function wrapper() {

    if (isThrottled) { // (2)
      savedArgs = arguments;
      savedThis = this;
      return;
    }
    isThrottled = true;

    func.apply(this, arguments); // (1)

    setTimeout(function() {
      isThrottled = false; // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }
    }, ms);
  }

  return wrapper;
}
```

Et kald til `throttle(func, ms)` returnerer `wrapper`.

1. Ved første kald kører `wrapper` funktionen `func` og sætter cooldown-tilstanden (`isThrottled = true`).
2. I denne tilstand gemmes alle kald i `savedArgs/savedThis`. Bemærk at både konteksten og argumenterne er lige så vigtige og skal gemmes. Vi har brug for begge dele samtidigt for at kunne genskabe kaldet.
3. Efter `ms` millisekunder har gået, udløser `setTimeout`. Cooldown-tilstanden fjernes (`isThrottled = false`) og, hvis der var ignorerede kald, køres `wrapper` med de sidste gemte argumenter og kontekst.

Det tredje trin kører ikke `func`, men `wrapper`, fordi vi ikke kun skal køre `func`, men også igen indtaste cooldown-tilstanden og opsætte timeout'en til at nulstille den.