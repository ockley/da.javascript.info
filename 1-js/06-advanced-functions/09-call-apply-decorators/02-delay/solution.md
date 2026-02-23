Løsningen:

```js run demo
function delay(f, ms) {

  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };

}

let f1000 = delay(alert, 1000);

f1000("test"); // viser "test" efter 1000ms
```

Bemærk hvordan en arrow function er brugt her. Som vi ved, har arrow functions ingen egen `this` og `arguments`, så `f.apply(this, arguments)` tager `this` og `arguments` fra wrapperen.

Hvis vi sender en almindelig funktion, vil `setTimeout` kalde den uden argumenter og med `this=window` (hvis vi er i browseren).

Vi kan stadig videregive det rigtige `this` ved at bruge en midlertidig variabel, men det er lidt mere besværligt:

```js
function delay(f, ms) {

  return function(...args) {
    let savedThis = this; // gem this som en midlertidig variabel
    setTimeout(function() {
      f.apply(savedThis, args); // brug den her
    }, ms);
  };

}
```
