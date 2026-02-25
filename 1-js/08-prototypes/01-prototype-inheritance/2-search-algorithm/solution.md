
1.Lad os tilføje `__proto__`:

    ```js run
    let head = {
      glasses: 1
    };

    let table = {
      pen: 3,
      __proto__: head
    };

    let bed = {
      sheet: 1,
      pillow: 2,
      __proto__: table
    };

    let pockets = {
      money: 2000,
      __proto__: bed
    };

    alert( pockets.pen ); // 3
    alert( bed.glasses ); // 1
    alert( table.money ); // undefined
    ```

2. I moderne motorer er der ingen hastghedsmæssig forskel på at tage en egenskab fra et objekt eller dens prototype. De husker hvor egenskaben blev fundet og genbruger den i næste forespørgsel.

    For eksempel, for `pockets.glasses` husker de hvor de fandt `glasses` (i `head`), og næste gang vil de søge der. De er også smarte nok til at opdatere interne caches hvis noget ændres, så denne optimering er sikker.
