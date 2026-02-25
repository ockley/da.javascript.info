importance: 5

---

# Hvorfor er begge hamstere fyldte?

Vi har to hamstre: `speedy` og `lazy` der nedarver fra det generelle `hamster` objekt. 

Når vi foder en af dem, er den anden også mæt. Hvorfor? Hvordan kan vi fikse det?

```js run
let hamster = {
  stomach: [],

  eat(food) {
    this.stomach.push(food);
  }
};

let speedy = {
  __proto__: hamster
};

let lazy = {
  __proto__: hamster
};

// Denne her fandt noget mad
speedy.eat("æble");
alert( speedy.stomach ); // æble

// Denne her har den også, hvorfor? Kan du fikse det, tak.
alert( lazy.stomach ); // æble
```

