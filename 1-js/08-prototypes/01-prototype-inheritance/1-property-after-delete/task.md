importance: 5

---

# Arbejde med en prototype

Her er en kode der opretter et par objekter, og derefter ændrer dem.

Hvilke værdier vises i processen?

```js
let animal = {
  jumps: null
};
let rabbit = {
  __proto__: animal,
  jumps: true
};

alert( rabbit.jumps ); // ? (1)

delete rabbit.jumps;

alert( rabbit.jumps ); // ? (2)

delete animal.jumps;

alert( rabbit.jumps ); // ? (3)
```

Der skal være 3 svar.
