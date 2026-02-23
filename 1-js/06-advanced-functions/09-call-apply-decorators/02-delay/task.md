importance: 5

---

# Forsinkelses decorator

Opret en decorator `delay(f, ms)` der forsinker hvert kald af `f` med `ms` millisekunder.

For eksempel:

```js
function f(x) {
  alert(x);
}

// Opret wrappers der forsinker kaldet af f med 1000ms og 1500ms
let f1000 = delay(f, 1000);
let f1500 = delay(f, 1500);

f1000("test"); // viser "test" efter 1000ms
f1500("test"); // viser "test" efter 1500ms
```

Med andre ord: `delay(f, ms)` returner en udgave af `f` der er "forsinket med `ms` millisekunder".

I koden ovenfor er `f` en funktion med et enkelt argument, men din løsning skal videregive alle argumenter og konteksten `this`.
