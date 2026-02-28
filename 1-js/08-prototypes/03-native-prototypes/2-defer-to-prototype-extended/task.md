importance: 4

---

# Tilføj "defer()" til funktioner via decorator pattern

Tilføj til prototypen af alle funktioner metoden `defer(ms)`, som returnerer et wrapper-objekt, der forsinker kaldet med `ms` millisekunder.

Her er et eksempel på hvordan det skal virke:

```js
function f(a, b) {
  alert( a + b );
}

f.defer(1000)(1, 2); // viser 3 efter 1 sekund
```

Bemærk at argumenterne skal videreføres til den originale funktion.
