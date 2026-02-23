Svaret er: `null`.


```js run
function f() {
  alert( this ); // null
}

let user = {
  g: f.bind(null)
};

user.g();
```

Konteksten for en bundet funktion er fikseret. Der er ingen måde at ændre den yderligere.

Så selv når vi kører `user.g()`, kaldes den originale funktion med `this=null`.
