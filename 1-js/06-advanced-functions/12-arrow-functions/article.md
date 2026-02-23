# Arrow funktioner genbesøgt

Lad os se på arrow funktioner igen.

Arrow funktioner er ikke bare en "shorthand" for at skrive kode der fylder lidt. De har nogle meget specifikke og nyttige features.

JavaScript er fuld af situationer hvor vi skal skrive en lille funktion, som skal køres et andet sted.

For eksempel:

- `arr.forEach(func)` -- `func` kaldes af `forEach` for hvert element i arrayet.
- `setTimeout(func)` -- `func` kaldes af den indbyggede planlægger.
- ...der er flere.

Det ligger i JavaScript's ånd at oprette funktioner og give dem videre til andre.

Og i sådanne funktioner ønsker vi normalt ikke at forlade den nuværende kontekst. Det er hvor arrow funktioner kommer ind i spil.

## Arrow funktioner har ingen "this"

Som vi husker fra kapitlet <info:object-methods>, har arrow funktioner ingen `this`. Hvis `this` tilgås, tages det fra det ydre område.

For eksempel kan vi bruge det til at iterere inde i en objektmetode:

```js run
let group = {
  title: "Vores gruppe",
  students: ["Martin", "Pia", "Hanne"],

  showList() {
*!*
    this.students.forEach(
      student => alert(this.title + ': ' + student)
    );
*/!*
  }
};

group.showList();
```

Her i `forEach` bliver arrow funktionen brugt så `this.title` i den er præcist den samme som i den ydre metode `showList` ... som er: `group.title`.

Hvis vi brugte en "regulær" funktion ville vi få en fejl:

```js run
let group = {
  title: "Vores gruppe",
  students: ["Martin", "Pia", "Hanne"],

  showList() {
*!*
    this.students.forEach(function(student) {
      // Error: Cannot read property 'title' of undefined
      alert(this.title + ': ' + student);
    });
*/!*
  }
};

group.showList();
```

Fejlen sker fordi `forEach` kører funktioner med `this=undefined` som standard så den prøver at tilgå `undefined.title`.

Det sker ikke med arrow funktioner fordi de ikke har noget eget `this`.

```warn header="Arrow funktioner kan ikke køre med `new`"
Det, ikke at have eget `this` giver selvfølgelig også nogle begrænsninger: arrow funktioner kan ikke bruges som konstruktører (constructors). De kan ikke kaldes med `new`.
```

```smart header="Arrow funktioner VS bind"
Der er en lille forskel mellem en arrow funktion `=>` og en regulær funktion kaldt med `.bind(this)`:

- `.bind(this)` skaber en "bundet version" af funktionen.
- arrow `=>` skaber ingen binding. Funktionen har simpelthen ikke noget `this`. Et opslag af `this` udføres på præcis samme måde som en hver anden opslag til variable: i dens ydre leksikale miljø.
```

## Arrows har ingen "arguments"

Arrow funktioner har heller ikke variablen `arguments`.

Det er perfekt for decorators når vi skal videresende et kald med det aktuelle `this` og `arguments`.

FFor eksempel modtager `defer(f, ms)` en funktion og returnerer en wrapper der forsinker kaldet til funktionen med `ms` millisekunder:

```js run
function defer(f, ms) {
  return function() {
    setTimeout(() => f.apply(this, arguments), ms);
  };
}

function sayHi(who) {
  alert('Hej ' + who);
}

let sayHiDeferred = defer(sayHi, 2000);
sayHiDeferred("Karsten"); // Hej, Karsten efter 2 sekunder
```

Det samme uden arrow funktion vil se således ud:

```js
function defer(f, ms) {
  return function(...args) {
    let ctx = this;
    setTimeout(function() {
      return f.apply(ctx, args);
    }, ms);
  };
}
```

Her er vi nødt til at oprette yderligere variable (`args` og `ctx`) så funktionen inde i `setTimeout` kan modtage dem.

## Opsummering

Arrow funktioner:

- Har ikke noget `this`
- Har ikke variablen `arguments`
- Kan ikke kaldes med `new`
- De har heller ikke nogen `super`, men det har vi ikke set på endnu. Det gør vi i kapitlet <info:class-inheritance>

Det er fordi de er beregnet til mindre kodestykker der ikke arbejder med egen kontekst men beror på den aktuelle under afvikling. Og det er de til gengæld virkelig gode til.