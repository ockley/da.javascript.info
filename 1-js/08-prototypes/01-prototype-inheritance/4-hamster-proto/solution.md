Lad os se nøje på hvad der sker i kaldet `speedy.eat("æble")`.

1. Metoden `speedy.eat` findes i prototypen (`=hamster`), og derefter eksekveres den med `this=speedy` (objektet før punktummet).

2. Derefter skal `this.stomach.push()` finde `stomach` egenskaben og kalde `push` på den. Det leder efter `stomach` i `this` (`=speedy`), men finder ikke noget.

3. Derefter følger den prototypen og finder `stomach` i `hamster`.

4. Derefter kalder den `push` på den, og tilføjer maden til *prototypens stomach*.

Så alle hamstre deler den samme `stomach`!

Både `lazy.stomach.push(...)` og `speedy.stomach.push()` vil finde egenskaben `stomach` i prototypen (da den ikke er i objektet selv), og tilføje data til den.

Vær opmærksom på at dette ikke sker i tilfældet af en simpel tildeling `this.stomach=`:

```js run
let hamster = {
  stomach: [],

  eat(food) {
*!*
    // tildel til this.stomach i stedet for this.stomach.push
    this.stomach = [food];
*/!*
  }
};

let speedy = {
   __proto__: hamster
};

let lazy = {
  __proto__: hamster
};

// Speedy fandt noget mad
speedy.eat("æble");
alert( speedy.stomach ); // æble

// Lazy's mave er tom
alert( lazy.stomach ); // <intet>
```

Nu virker alt fint fordi `this.stomach=` ikke foretager et opslag til `stomach`. Værdien er skrevet direkte til `this` objektet.

Vi kan også helt undgå problemet ved at sikre, at hver hamster har sin egen mave:

```js run
let hamster = {
  stomach: [],

  eat(food) {
    this.stomach.push(food);
  }
};

let speedy = {
  __proto__: hamster,
*!*
  stomach: []
*/!*
};

let lazy = {
  __proto__: hamster,
*!*
  stomach: []
*/!*
};

// Speedy fandt noget mad
speedy.eat("æble");
alert( speedy.stomach ); // æble

// Lazy's mave er tom
alert( lazy.stomach ); // <intet>
```

En udbredt løsning er at sikre, at alle egenskaber, der beskriver tilstanden for et specifikt objekt, som `stomach` ovenfor, skrives direkte til det pågældende objekt. Det forhindrer sådanne problemer.
