importance: 5

---

# Debounce decorator

Resultatet af en `debounce(f, ms)` decorator er en wrapper der suspenderer kaldet til `f` indtil der er `ms` millisekunder af inaktivitet (ingen kald, "cooldown period"), så kalder den `f` én gang med de seneste argumenter.

Med andre ord er `debounce` som en sekretær der tager imod "telefonopkald" og venter ind til der har været `ms` millisekunder af inaktivitet. Og først da overfører den de seneste opkaldsoplysninger til "chefen" (kalder den faktiske `f`).

For eksempel, vi havde en funktion `f` og erstattede den med `f = debounce(f, 1000)`.

Hvis den omgivende funktion kaldes ved 0ms, 200ms og 500ms, og der ikke er flere kald efter det, vil den faktiske `f` kun blive kaldt én gang, ved 1500ms. Det vil sige: efter cooldown-perioden på 1000ms fra det sidste kald.

![](debounce.svg)

...og vi vil få argumenterne fra det sidste kald, andre kald ignoreres.

Her er koden for det (som bruger debounce decorator fra [Lodash biblioteket](https://lodash.com/docs/4.17.15#debounce)):

```js
let f = _.debounce(alert, 1000);

f("a");
setTimeout( () => f("b"), 200);
setTimeout( () => f("c"), 500);
// debounced funktion venter 1000ms efter det sidste kald og kalder så alert("c")
```

Nu til et praktisk eksempel. Lad os sige, at brugeren skriver noget, og vi vil sende en forespørgsel til serveren når inputtet er færdigt.

Der er ingen pointe i at sende forespørgslen for hver tastetryk. I stedet vil vi vente og så behandle hele resultatet.

 en webbrowser kan vi opsætte en event handler -- en funktion der kaldes ved hver ændring af et inputfelt. Normalt kaldes en event handler meget ofte, for hver tastetryk. Men hvis vi `debounce` den med 1000ms, vil den kun blive kaldt én gang, efter 1000ms efter det sidste input.

```online

I dette live eksempel sætter handleren resultatet i en boks nedenfor, prøv det:

[iframe border=1 src="debounce" height=200]

Kan du se effekten? Det andet input kalder den debounced funktion, så dens indhold behandles efter 1000ms fra det sidste input.
```

Så `debounce` er en god måde at processere en række af events: en sekvens at tastetryk, musbevægelser eller andet.

Den venter en given tid efter det sidste kald, og så kører den sin funktion, som kan behandle resultatet.

Din opgave er at implementere en `debounce` decorator.

Hint: det er egentlig kun et par linjer hvis man tænker over det :)
