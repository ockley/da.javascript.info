importance: 5

---

# Opret et objekt med samme konstruktør

Forestil dig, vi har et vilkårligt objekt `obj`, skabt af en konstruktør funktion -- vi ved ikke hvilken, men vi vil gerne skabe et nyt objekt med samme konstruktør.

Kan vi gøre det sådan?

```js
let obj2 = new obj.constructor();
```

Giv et eksempel på en konstruktør funktion for `obj` som lader sådan kode virke korrekt. Og et eksempel som gør det forkert.
