Svaret er: **John**.

```js run no-beautify
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Pete"} );

f(); // John
```

Det [eksotiske bundne](https://tc39.github.io/ecma262/#sec-bound-function-exotic-objects) objekt der returneres af `f.bind(...)` husker den kontekst (og eventuelle argumenter) den fik da den blev oprettet. 

En sådan funktion kan ikke blive bundet igen.
