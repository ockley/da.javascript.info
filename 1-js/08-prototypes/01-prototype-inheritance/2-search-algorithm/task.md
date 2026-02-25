importance: 5

---

# Søgealgoritme

Opgaven har to dele.

Givet følgende objekter:

```js
let head = {
  glasses: 1
};

let table = {
  pen: 3
};

let bed = {
  sheet: 1,
  pillow: 2
};

let pockets = {
  money: 2000
};
```

1. Brug `__proto__` til at tildele prototyper på en måde, så enhver egenskabsopslag følger stien: `pockets` -> `bed` -> `table` -> `head`. For eksempel, `pockets.pen` skal være `3` (fundet i `table`), og `bed.glasses` skal være `1` (fundet i `head`).
2. Besvar spørgsmålet: er det hurtigere at få `glasses` som `pockets.glasses` eller `head.glasses`? Benchmark hvis nødvendigt.
