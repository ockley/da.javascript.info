importance: 5

---

# Spy decorator

Opret en decorator `spy(func)` der returnerer en wrapper der gemmer alle kald til funktionen i dens `calls` egenskab.

Hvert kald er gemt som et array af argumenter.

For eksempel:

```js
function work(a, b) {
  alert( a + b ); // work er en tilfældig funktion eller metode
}

*!*
work = spy(work);
*/!*

work(1, 2); // 3
work(4, 5); // 9

for (let args of work.calls) {
  alert( 'call:' + args.join() ); // "call:1,2", "call:4,5"
}
```

P.S. Denne decorator kan være brugbar ved unit-testing. En avanceret form er `sinon.spy` i [Sinon.JS](http://sinonjs.org/) biblioteket.
