**Svaret er: `rabbit`.**

Det er fordi `this` er objektet før punktummet, så `rabbit.eat()` ændrer `rabbit`.

Opslag af egenskaber og eksekvering er to forskellige ting.

Metoden `rabbit.eat` findes først i prototypen, og derefter eksekveres den med `this=rabbit`.
