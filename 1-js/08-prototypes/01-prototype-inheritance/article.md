# Prototypal inheritance

I programmering har vi ofte lyst til at tage noget og udvide det.

For eksempel har vi et `user` objekt med dets egenskaber og metoder, og vi vil lave `admin` og `guest` som lettere modificerede varianter af det. Vi vil gerne genbruge det, vi har i `user`, ikke kopiere/omimplementere dets metoder, bare bygge et nyt objekt ovenpå det.

*Protoypisk arv* (Prototypal inheritance) er en sprogfeature, der hjælper med det.

## [[Prototype]]

I JavaScript har objekter en speciel og skjult egenskab `[[Prototype]]` (som navngivet i specifikationen), som enten er `null` eller refererer til et andet objekt. Det objekt kaldes "en prototype":

![prototype](object-prototype-empty.svg)

Når vi læser en egenskab fra `object`, og den mangler, tager JavaScript automatisk den fra prototypen. I programmering kaldes dette "prototypal inheritance". Vi vil her studere eksempler på sådan nedarvning, samt mere avancerede sprogfunktioner bygget på det.

Egenskaben `[[Prototype]]` er intern og er skjult, men der er flere måder at sætte den på.

En af dem er at bruge det specielle navn `__proto__`, som vist her:

```js run
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

*!*
rabbit.__proto__ = animal; // sætter rabbit.[[Prototype]] = animal
*/!*
```

Nu, hvis vi læser en egenskab fra `rabbit`, og den mangler, tager JavaScript automatisk den fra `animal`.

For eksempel, `rabbit` har ikke egenskaben `eats`, så JavaScript følger `[[Prototype]]` reference og finder den i `animal`:

```js
let animal = {
  eats: true
};
let rabbit = {
  jumps: true
};

*!*
rabbit.__proto__ = animal; // (*)
*/!*

// vi kan finde begge egenskaber i rabbit nu:
*!*
alert( rabbit.eats ); // true (**)
*/!*
alert( rabbit.jumps ); // true
```

Her sætter linjen med `(*)` `animal` til at være prototypen for `rabbit`.

Så, når `alert` prøver at læse egenskaben `rabbit.eats` `(**)` kan den ikke finde den i `rabbit`, så JavaScript følger `[[Prototype]]` reference og finder den i `animal` (kig fra bunden op):

![](proto-animal-rabbit.svg)

Her siger vi derfor at "`animal` er prototypen for `rabbit`" eller "`rabbit` prototypisk nedarver fra `animal`".

Så hvis `animal` har mange nyttige egenskaber og metoder, så bliver de automatisk tilgængelige i `rabbit`. Sådanne egenskaber kaldes "nedarvede".

Hvis vi har en metode i `animal`, kan den kaldes på `rabbit`:

```js run
let animal = {
  eats: true,
*!*
  walk() {
    alert("Dyret går");
  }
*/!*
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

// walk tages fra prototypen
*!*
rabbit.walk(); // Dyret går
*/!*
```

Metoden tages automatisk fra prototypen, som vist her:

![](proto-animal-rabbit-walk.svg)

Prototype-kæden kan være længere:

```js run
let animal = {
  eats: true,
  walk() {
    alert("Dyret går");
  }
};

let rabbit = {
  jumps: true,
*!*
  __proto__: animal
*/!*
};

let longEar = {
  earLength: 10,
*!*
  __proto__: rabbit
*/!*
};

// walk tages fra prototypen
longEar.walk(); // Dyret går
alert(longEar.jumps); // true (fra rabbit)
```

![](proto-animal-rabbit-chain.svg)

Hvis vi nu læser noget fra `longEar`, og det mangler, vil JavaScript først lede efter det i `rabbit`, og så i `animal`.

Der er kun to begrænsninger for prototypisk nedarvning:

1. Referencer kan ikke gå i ring. JavaScript vil melde en fejl hvis vi forsøger at tildele `__proto__` i et objekt der derefter tildeler tilbage til det oprindelige på et tidspunkt.
2. Værdien af `__proto__` kan kun være et objekt eller `null`. Andre typer ignoreres.

Derudover, lidt åbenlyst men alligevel: Der kan kun være en `[[Prototype]]`. Et objekt kan ikke nedarve fra to andre.

```smart header="`__proto__` er en `historisk` getter/setter for `[[Prototype]]`"
Det er en kendt fejl i begyndelsen ikke at se forskel på de to.

Bemærk at `__proto__` er *ikke det samme* som den interne `[[Prototype]]` egenskab. Det er en getter/setter for `[[Prototype]]`. Senere vil vi se situationer hvor det betyder noget. For nu, så lad os bare have det i baghovedet, mens vi udvider forståelsen for sproget.

Egenskaben `__proto__` er lidt uddateret. Den lever videre af historiske årsager og moderne JavaScript foreslår at vi benytter os af funktionerne `Object.getPrototypeOf/Object.setPrototypeOf` i stedet som også henter og sætter en prototype. Vi ser på dem senere.

I forhold til specifikationen skal `__proto__` kun understøtts af browsere. I praksis understøtter alle miljøer, også server-side miljøer, `__proto__`, så det er ret sikkert at bruge den.

Da notationen med `__proto__` er lidt mere intuitiv, bruger vi den i eksemplerne.
```

## Skrivning går ikke videre til prototypen

En prototype bruges kun til læsning af egenskaber.

Skriv/slet operationer arbejder direkte med objektet.

I eksemplet nedenfor, tildeler vi en egen `walk` metode til `rabbit`:

```js run
let animal = {
  eats: true,
  walk() {
    /* Denne metode vil ikke blive brugt af rabbit */  
  }
};

let rabbit = {
  __proto__: animal
};

*!*
rabbit.walk = function() {
  alert("Rabbit! hop-hop!");
};
*/!*

rabbit.walk(); // Rabbit! hop-hop!
```

Fra nu af finder `rabbit.walk()` metoden umiddelbart placeret i sit eget objekt. Den kalder det derfor uden at se i prototypen:

![](proto-animal-rabbit-walk-2.svg)

Accessor egenskaber er en undtagelse da tildelingen her bliver håndteret af en funktion. Så det at skrive til sådan en egenskab er faktisk det samme som at kalde en funktion.

Derfor vil `admin.fullName` virke korrekt i koden nedenfor:

```js run
let user = {
  name: "John",
  surname: "Smith",

  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  },

  get fullName() {
    return `${this.name} ${this.surname}`;
  }
};

let admin = {
  __proto__: user,
  isAdmin: true
};

alert(admin.fullName); // John Smith (*)

// setter trigger!
admin.fullName = "Alice Cooper"; // (**)

alert(admin.fullName); // Alice Cooper, tilstand (state) for admin er ændret
alert(user.fullName); // John Smith, tilstand (state) for user er beskyttet
```

I linjen med `(*)` har egenskaben `admin.fullName` en getter fra prototypen `user`, så den kaldes. Og i linjen `(**)` har egenskaben en setter i prototypen, så den kaldes.

## Værdien af "this"

Et interessant spørgsmål kan opstå i eksemplet ovenfor: hvad er værdien af `this` inde i `set fullName(value)`? Hvor er egenskaberne `this.name` og `this.surname` skrevet: i `user` eller `admin`?

Svaret er simpelt: `this` påvirkes ikke af prototyper overhovedet.

**Uanset hvor metoden findes: i et objekt eller dets prototype. I et metodekald er `this` altid objektet før punktummet.**

Så kaldet via setter i `admin.fullName=` bruger `admin` som `this`, ikke `user`.

Det er faktisk et super-vigtigt spørgsmål. Forestil dig at vi har et stort objekt med mange metoder, og har objekter der nedarver fra det. Når de nedarvende objekter kalder de nedarvne metoder, vil de kun ændre deres egne tilstande, ikke tilstanden i det store bagvendliggende objekt.

For eksempel repræsenterer `animal` her en "metode-lager", og `rabbit` gør brug af det.

Kaldet `rabbit.sleep()` sætter `this.isSleeping` på `rabbit`-objektet:

```js run
// animal har metoder
let animal = {
  walk() {
    if (!this.isSleeping) {
      alert(`Jeg går`);
    }
  },
  sleep() {
    this.isSleeping = true;
  }
};

let rabbit = {
  name: "Hvid kanin",
  __proto__: animal
};

// ændrer rabbit.isSleeping
rabbit.sleep();

alert(rabbit.isSleeping); // true
alert(animal.isSleeping); // undefined (den værdi findes slet ikke i animal prototypen)
```

Det kan vises således:

![](proto-animal-rabbit-walk-3.svg)

Hvis vi havde andre objekter, som `bird`, `snake`, etc., der nedarver fra `animal`, ville de også få adgang til metoderne i `animal`. Men `this` i hvert metodekald ville være det tilsvarende objekt, evalueret ved tidspunktet for kaldet (før punktummet), ikke `animal`. Så når vi skriver data til `this`, bliver den gemt i disse objekter.

Som et resultat er metoder delt, men objektets tilstand er ikke delt.

## for..in loop

Løkken `for..in` gennemløber også nedarvede egenskaber.

For eksempel, `rabbit` nedarver `eats` fra `animal`, så det vil blive vist i `for..in`:

```js run
let animal = {
  eats: true
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

*!*
// Object.keys viser kun egne nøgler
alert(Object.keys(rabbit)); // jumps
*/!*

*!*
// for..in løkker gennemløber både egne og nedarvede nøgler
for(let prop in rabbit) alert(prop); // jumps og eats
*/!*
```

HHvis det ikke er det vi ønsker og vi hellere vil udelade nedarvede egenskaber, kan vi bruge metoden `obj.hasOwnProperty(key)`. Den returnerer `true`, hvis objektet har en egen (ikke nedarvet) egenskab med navnet `key`.

På den måde kan vi filtere nedarvede egenskaber fra (eller gøre noget andet med dem):

```js run
let animal = {
  eats: true
};

let rabbit = {
  jumps: true,
  __proto__: animal
};

for(let prop in rabbit) {
  let isOwn = rabbit.hasOwnProperty(prop);

  if (isOwn) {
    alert(`Vores egen: ${prop}`); // Vores egen: jumps
  } else {
    alert(`Nedarvet: ${prop}`); // Nedarvet: eats
  }
}
```

Her har vi følgende kæde for nedarvning: `rabbit` nedarver fra `animal`, som nedarver fra `Object.prototype` (fordi `animal` er et literal objekt `{...}`, så det er standard), og så `null` ovenfor det:

![](rabbit-animal-object.svg)

Bemærk en lidt sjov ting. Hvor kommer metoden `rabbit.hasOwnProperty` fra? Vi har ikke defineret den. Ved at kigge op gennem kæden kan vi se at metoden bliver leveret af `Object.prototype.hasOwnProperty`. Med andre ord er den nedarvet.

...Men hvorfor dukker `hasOwnProperty` ikke op i `for..in`-loopet som `eats` og `jumps` gør, hvis `for..in` lister nedarvede egenskaber?

Svaret er simpelt: Den er ikke tælbar (enumerable). Lige som alle andre egenskaber af `Object.prototype`, har den sat flaget `enumerable:false`. Og `for..in` viser kun tælbare egenskaber. Derfor vises `hasOwnProperty` og de resterende egenskaber i `Object.prototype` ikke i loopet.

```smart header="Næsten alle andre metoder der henter key/value par ignorerer nedarvede egenskaber"
Næsten alle andre metoder der henter key/value par, såsom `Object.keys`, `Object.values` og så videre, ignorerer nedarvede egenskaber.

De virker de kun på objektet selv. Egenskaber fra prototypen tages *ikke* med i betragtning.
```

## Opsummering

- I JavaScript har alle objekter en skjult `[[Prototype]]`-egenskab, som enten er et andet objekt eller `null`.
- Vi kan bruge `obj.__proto__` til at tilgå den (det er en historisk getter/setter. Der er andre måder at gøre det på, som vil blive dækket senere).
- Det objekt som `[[Prototype]]` refererer til kaldes en "prototype".
- Hvis vi ønsker at læse en egenskab i `obj` eller kalde en metode, og den ikke eksisterer, så forsøger JavaScript at finde den i prototypen.
- Skrive/slette operationer virker direkte på objektet, de bruger ikke prototypen (medmindre det er en data egenskab og ikke en setter).
- Hvis vi kalder `obj.method()`, og metoden kommer fra prototypen, så refererer `this` stadig til `obj`. Så metoder virker altid med det nuværende objekt selvom de er nedarvet.
- The `for..in` loop iterates over both its own and its inherited properties. All other key/value-getting methods only operate on the object itself.
