

```js run
Function.prototype.defer = function(ms) {
  let f = this;
  return function(...args) {
    setTimeout(() => f.apply(this, args), ms);
  }
};

// tjek det
function f(a, b) {
  alert( a + b );
}

f.defer(1000)(1, 2); // viser 3 efter 1 sekund
```

Bemærk: vi bruger `this` i `f.apply` for at få dekoration til at virke korrekt for objektmetoder.

Så hvis wrapper-funktionen kaldes som en objektmetode, så sendes `this` til den originale metode `f`.

```js run
Function.prototype.defer = function(ms) {
  let f = this;
  return function(...args) {
    setTimeout(() => f.apply(this, args), ms);
  }
};

let user = {
  name: "Ahmed",
  sayHi() {
    alert(this.name);
  }
}

user.sayHi = user.sayHi.defer(1000);

user.sayHi();
```
