libs:
  - lodash

---

# Function binding

Når vi videregiver objektmetoder som callbacks, for eksempel til `setTimeout`, opstår der et kendt problem: "vi mister `this`".

I dette kapitel vil vi se de måder, hvorpå du kan fikse det.

## Mister "this"

Vi har allerede set eksempler på, hvordan `this` går tabt. Når en metode videregives til et andet sted udenfor objektet går `this` tabt.

Her er hvordan det kan ske med `setTimeout`:

```js run
let user = {
  firstName: "Karsten",
  sayHi() {
    alert(`Hej, ${this.firstName}!`);
  }
};

*!*
setTimeout(user.sayHi, 1000); // Hej, undefined!
*/!*
```

Som vi kan se, viser output'en ikke "Karsten" som `this.firstName`, men `undefined`!

Det er fordi `setTimeout` modtog funktionen `user.sayHi` seperaret fra objektet. Den sidste linje kan blive omskrevet som:

```js
let f = user.sayHi;
setTimeout(f, 1000); // mistet user kontekst
```

Metoden `setTimeout` i browseren er lidt speciel: den sætter `this=window` for funktionskaldet (i Node.js bliver`this` til et timer-objekt men det er mindre vigtigt her). Så med `this.firstName` kigger det efter `window.firstName` som ikke eksisterer. I andre lignende tilfælde vil `this` fremstå som `undefined`.

Opgaven er ret typisk -- vi vil gerne videregive et objekts metode til et andet sted (her til en planlægger) hvor det så vil blive kaldt. Hvordan sikrer vi os at det vil blive kaldt med den rigtige kontekst?

## Løsning 1: En wrapper

Den simple løsning er at bruge en wrapper-funktion:

```js run
let user = {
  firstName: "Karsten",
  sayHi() {
    alert(`Hej, ${this.firstName}!`);
  }
};

*!*
setTimeout(function() {
  user.sayHi(); // Hej, Karsten!
}, 1000);
*/!*
```

Det virker fordi det modtager `user` fra det ydre leksikale miljø, og kalder metoden normalt.

Det samme, men kortere, kunne være:

```js
setTimeout(() => user.sayHi(), 1000); // Hej, Karsten!
```

Virker fint, men der er en mindre sårbarhed i kodens struktur.

Hvad hvis `user` ændrer værdi før `setTimeout` udløses (der er en sekund forsinkelse!)? Så vil det pludselig kalde det forkerte objekt!


```js run
let user = {
  firstName: "Karsten",
  sayHi() {
    alert(`Hej, ${this.firstName}!`);
  }
};

setTimeout(() => user.sayHi(), 1000);

// ...værdien af user ændres inden der er gået et sekund
user = {
  sayHi() { alert("En anden user i setTimeout!"); }
};

// En anden user i setTimeout!
```

Den næste løsning garanterer, at sådan noget ikke vil ske.

## Løsning 2: bind

Functioner leverer endnu en metode [bind](mdn:js/Function/bind) som tillader at fikse `this`.

Den grundlæggend syntaks er:

```js
// der kommer en mere kompleks syntaks lidt senere
let boundFunc = func.bind(context);
```

Resultatet af `func.bind(context)` er et specielt funktion-lignende "eksotisk objekt", som kan kaldes som en funktion og transparent overfører kaldet til `func` med `this=context`.

Med andre ord er et kald til `boundFunc` som et kald til `func` med et fastsat `this`.

For eksempel videregiver `funcUser` et kald til `func` med `this=user`:

```js run  
let user = {
  firstName: "Karsten"
};

function func() {
  alert(this.firstName);
}

*!*
let funcUser = func.bind(user);
funcUser(); // Karsten
*/!*
```

Her er `func.bind(user)` en "bundet variant" af `func` med et fastsat `this=user`.

Alle argumenter bliver videregivet til den originale `func` som de er, for eksempel:

```js run  
let user = {
  firstName: "Karsten"
};

function func(phrase) {
  alert(phrase + ', ' + this.firstName);
}

// bind this til user
let funcUser = func.bind(user);

*!*
funcUser("Hej"); // Hej, Karsten (argument "Hej" videregives og this=user)
*/!*
```

Lad os nu prøve med en metode fra et objekt:


```js run
let user = {
  firstName: "Karsten",
  sayHi() {
    alert(`Hej, ${this.firstName}!`);
  }
};

*!*
let sayHi = user.sayHi.bind(user); // (*)
*/!*

// du kan køre det uden et objekt
sayHi(); // Hej, Karsten!

setTimeout(sayHi, 1000); // Hej, Karsten!

// selv hvis værdien af user ændres inden der er gået et sekund
// sayHi bruger den forud bundne værdi som referer til det gamle user-objekt
user = {
  sayHi() { alert("En anden user i setTimeout!"); }
};
```

I linjen med `(*)` tager vi metoden `user.sayHi` og binder den til `user`. `sayHi` er en "bundet" funktion der kan kaldes alene eller videregives til `setTimeout` -- det spiller ingen rolle, konteksten vil være korrekt.

Her kan vi se at argumenter videregives "som de er", kun `this` er fastsat af `bind`:

```js run
let user = {
  firstName: "Karsten",
  say(phrase) {
    alert(`${phrase}, ${this.firstName}!`);
  }
};

let say = user.say.bind(user);

say("Hej"); // Hej, Karsten! ("Hej" sendes til say)
say("Farvel"); // Farvel, Karsten! ("Farvel" sendes til say)
```

````smart header="En bekvemt metode: `bindAll`"
Hvis et objekt har mange metoder og vi planlægger aktivt at sende dem videre, så kan vi binde dem alle i en løkke:

```js
for (let key in user) {
  if (typeof user[key] == 'function') {
    user[key] = user[key].bind(user);
  }
}
```

JavaScript biblioteker leverer også ofte funktioner til nemt binder mange metoder på én gang, f. eks. [_.bindAll(object, methodNames)](https://lodash.com/docs#bindAll) i lodash.
````

## Delvise funktioner (partial functions)

Indtil videre har vi kun talt om at binde `this`. Lad os tage det et skridt videre.

Vi kan binde andet end `this`. Vi kan også binde argumenter. Det er sjældent gjort, men nogle gange kan det være praktisk.

Den fulde syntaks af `bind` er:

```js
let bound = func.bind(context, [arg1], [arg2], ...);
```

Det tillader os at binde kontekst som `this` og startargumenter for funktionen.

Hvis vi f.eks. har en funktion `mul(a, b)` som ganger to tal:

```js
function mul(a, b) {
  return a * b;
}
```

Kan vi bruge `bind` til at skabe en funktion `double` på basis af `mul`:

```js run
function mul(a, b) {
  return a * b;
}

*!*
let double = mul.bind(null, 2);
*/!*

alert( double(3) ); // = mul(2, 3) = 6
alert( double(4) ); // = mul(2, 4) = 8
alert( double(5) ); // = mul(2, 5) = 10
```

Kaldet til `mul.bind(null, 2)` opretter en ny funktion `double` der videregiver kald til `mul`, med `null` som kontekst og `2` som første argument. Yderligere argumenter videregives "som de er".

Dette kaldes [partial function application](https://en.wikipedia.org/wiki/Partial_application) -- vi opretter en ny funkiton ved at fiksere nogle af parametrene hos den eksisterende funktion.

Bemærk, at vi ikke bruger `this` her. Men `bind` kræver den, så vi skal indsætte noget som f. eks. `null`.

Funktionen `triple` nedenfor ganger med 3:

```js run
function mul(a, b) {
  return a * b;
}

*!*
let triple = mul.bind(null, 3);
*/!*

alert( triple(3) ); // = mul(3, 3) = 9
alert( triple(4) ); // = mul(3, 4) = 12
alert( triple(5) ); // = mul(3, 5) = 15
```

Hvorfor skulle vi have lyst til at oprette delvise funktioner?

Fordelen er at vi kan oprette en uafhængig funktion med et læsbart navn (`double`, `triple`). Vi kan bruge den og ikke behøve at give det første argument hver gang, da det er fastsat med `bind`.

I andre tilfælde er delvise funktioner nyttige, når vi har en meget generisk funktion og ønsker en mindre universel variant af den for nemhedens skyld.

Et eksempel kunne være en funktion `send(from, to, text)`. Inden for et `user`-objekt kan vi ønske at bruge en delvis variant af den: `sendTo(to, text)` som sender fra det nuværende brugerobjekt.

## Arbejde partielt uden kontekst

Hvad hvis vi gerne vil fiksere nogle argumenter, men ikke konteksten `this`? For eksempel for en metode i et objekt.

Den indbyggede `bind` tillader ikke det. Vi kan ikke bare udelade konteksten og springe til argumenter.

Heldigvis kan en funktion (nedenfor kaldt `partial`) der kun binder argumenter let implementeres.

Sådan her:

```js run
*!*
function partial(func, ...argsBound) {
  return function(...args) { // (*)
    return func.call(this, ...argsBound, ...args);
  }
}
*/!*

// Usage:
let user = {
  firstName: "John",
  say(time, phrase) {
    alert(`[${time}] ${this.firstName}: ${phrase}!`);
  }
};

// Tilføj en partial metode med fikseret tidsstempel
user.sayNow = partial(user.say, new Date().getHours() + ':' + new Date().getMinutes());

user.sayNow("Hej");
// Noget i stil med:
// [10:00] John: Hej!
```

Resultatet af `partial(func[, arg1, arg2...])` kaldet er en wrapper `(*)` der kalder `func` med:
- Samme `this` som den får (for `user.sayNow` kaldet er det `user`)
- Derefter giver den det `...argsBound` -- argumenter fra kaldet til `partial` (`"10:00"`)
- Derefter giver den det `...args` -- argumenter givet til wrapperen (`"Hej"`)

Så nemt at gøre det med spread syntax, ikke?



Der findes en færdiglavet [_.partial](https://lodash.com/docs#partial) implementering i lodash biblioteket.

## Opsummering

Metoden `func.bind(context, ...args)` returnerer en "bundet variant" af funktionen `func` som fikserer konteksten `this` og de første argumenter hvis givet.

Ofte bruger vi `bind` til at fiksere `this` for en objektmetode, så vi kan videregive den et sted. For eksempel til `setTimeout`.

Når vi fikserer nogle argumenter af en eksisterende funktion, kaldes den skabte (mindre universelle) funktion *partielly applied* eller *partial*.

'Partials' er praktiske når vi vil undgå at gentage det samme argument igen og igen. For eksempel hvis vi har en `send(from, to)` funktion, og `from` altid skal være det samme for vores opgave, kan vi oprette en 'partial' og fortsætte med den.
