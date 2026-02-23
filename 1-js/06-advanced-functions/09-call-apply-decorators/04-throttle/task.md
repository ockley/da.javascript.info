importance: 5

---

# Throttle decorator

Opret en "throttling" decorator `throttle(f, ms)` -- der returnerer en wrapper.

Når den kaldes flere gange, sender den kaldet til `f` maksimalt én gang pr. `ms` millisekunder.

Sammenlignet med debounce decorator er adfæren helt anderledes:
- `debounce` kører funktionen én gang efter "cooldown" perioden. Godt til at behandle det endelige resultat.
- `throttle` kører den ikke oftere end givet `ms` tid. Godt til regelmæssige opdateringer der ikke bør ske for ofte.

Med andre ord er `throttle` en slags sekretær der accepterer telefonopkald uden at ville genere chefen (calls the actual `f`) mere end én ger per `ms` millisekunder.

Lad os se på et eksempel fra en realistisk situation for bedre at forstå metoden.

**Tracking af musens bevægelser.**

I en browser kan vi opsætte en funktion der modtager musens kooridnater og kaldes hver gang musen bevæger sig. I praksis vil sådan en funktion blive kaldt ret ofte - noget i stil med 100 gange i sekundet (hvert 10. millisekund).

**Vi vil gerne opdatere informationen på siden når musen bevæger sig.**

...Men funktionen `update()` der skal stå for opdateringen er alt for tung til at køre ved hver mikro-bevægelse. Der giver nok heller ingen mening at opdatere oftere end én gang pr. 100ms.

Derfor pakker vi den ind i en decorator: brug `throttle(update, 100)` som funktionen der skal køres ved hver mus-bevægelse i stedet for den originale `update()`. Decoratoren vil blive kaldt ofte, men videregive kaldet til `update()` maksimalt én gang pr. 100ms.

Det vil se ud i stil med dette:

1. For den første bevægelse med musen vil den dekorerede variant med det samme videregive kaldet til `update`. Det er vigtigt, brugeren ser vores reaktion på bevægelsen.
2. Derefter, mens musen bevæger sig videre *og* indtil `100ms` er gået, sker der intet. Den dekorerede variant ignorerer kaldene.
3. Ved slutningen af `100ms` -- en ekstra `update` sker med de sidste koordinater.
4. Til sidst, når musen stopper et sted, venter den dekorerede variant til `100ms` er udløbet og kører derefter `update` med de sidste koordinater. Så er det vigtigt at de sidste koordinater bliver behandlet.

Et kodet eksempel:

```js
function f(a) {
  console.log(a);
}

// f1000 videregiver kald til f maks én gang per 1000 ms
let f1000 = throttle(f, 1000);

f1000(1); // vider 1
f1000(2); // (throttling, 1000ms ikke endnu)
f1000(3); // (throttling, 1000ms ikke endnu)

// når 1000 ms er gået...
// ...output'er 3, den midterste værdi 2 ignoreres
```

P.S. Argumenterne og konteksten `this` der gives til `f1000` skal videregives til den originale `f`.
