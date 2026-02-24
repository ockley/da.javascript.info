
# Flag og beskrivelser for objektegenskaber

Som vi allerede ved, kan objekter gemme egenskaber.

Indtil nu har en egenskab været en simpel "nøgle-værdi" par for os. Men en objektegenskab er faktisk mere fleksibel og kraftig.

I denne kapitel vil vi studere yderligere konfigurationsmuligheder, og i næste kapitel vil vi se hvordan vi kan skjulte omgøre dem til getter/setter funktioner.

## Egenskabsflag

Objektegenskaber har, udover en **`værdi`**, tre specielle attributter (såkaldte "flag"):

- **`writable`** -- hvis `true`, kan værdien ændres, ellers er den skrivebeskyttet.
- **`enumerable`** -- hvis `true`, vises egenskaben i løkker, ellers ikke.
- **`configurable`** -- hvis `true`, kan egenskaben slettes og disse attributter ændres, ellers ikke.

Vi har ikke set dem endnu, fordi de normalt ikke giver sig til kende. Når vi opretter en egenskab "på den sædvanlige måde", sættes de alle til `true`. Men vi kan ændre dem når som helst.

Lad os først se hvordan vi får adgang til disse flag.

Metoden [Object.getOwnPropertyDescriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) tillader os at hente *fuld* information om en egenskab.

Syntaksen er:

```js
let descriptor = Object.getOwnPropertyDescriptor(obj, propertyName);
```

`obj`
: Det objekt der skal hentes information fra.

`propertyName`
: Navnet på egenskaben.

Værdien der returneres er et såkaldt "property descriptor" objekt: det indeholder værdien og alle dens flag.

For eksempel, her er en egenskab `name` i objektet `user`:

```js run
let user = {
  name: "Asta"
};

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/* property descriptor:
{
  "value": "Asta",
  "writable": true,
  "enumerable": true,
  "configurable": true
}
*/
```

For at ændre flagene, kan vi bruge [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty).

Syntaksen er:

```js
Object.defineProperty(obj, propertyName, descriptor)
```

`obj`, `propertyName`
: Det objekt og dets egenskab som beskrivelsen skal anvendes på.

`descriptor`
: Et property descriptor objekt som skal anvendes.

Hvis en egen egenskab eksisterer, opdaterer `defineProperty` dens flag. Hvis den ikke eksisterer, opretter den egenskaben med den givne værdi og sætter dens flag; i så fald antages det, at et flag som ikke er angivet er `false`.

For eksempel, her oprettes en egenskab `name` med alle falske flag:

```js run
let user = {};

*!*
Object.defineProperty(user, "name", {
  value: "Asta"
});
*/!*

let descriptor = Object.getOwnPropertyDescriptor(user, 'name');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": "Asta",
*!*
  "writable": false,
  "enumerable": false,
  "configurable": false
*/!*
}
 */
```

Sammenlign det med "normalt oprettede" `user.name` ovenfor: nu er alle flag falske. Hvis det ikke er hvad vi vil, så bør vi sætte dem til `true` i `descriptor`.

Lad os se på effekterne af flagene ved eksempel.

## Skrivebeskyttede egenskaber (Non-writable)

Lad os gøre `user.name` skrivebeskyttet ved at ændre `writable` flag:

```js run
let user = {
  name: "Asta"
};

Object.defineProperty(user, "name", {
*!*
  writable: false
*/!*
});

*!*
user.name = "Mikkel"; // Error: Cannot assign to read only property 'name'
*/!*
```

Nu kan ingen ændre navnet på vores bruger, medmindre de anvender deres egen `defineProperty` til at tilsidesætte vores.

```smart header="Fejl sker kun i strict mode"
I non-strict mode vil der ikke meldes fejl når du prøver at overskrive en skrivebeskyttet egenskab - men operationen vil stadig ikke ske. Egenskaben vil ikke blive overskrevet, men du får ikke nogen fejl sendt ud til konsollen i non-strict mode.
```

Her er det samme eksempel, men med en egenskab oprettet fra bunden:

```js run
let user = { };

Object.defineProperty(user, "name", {
*!*
  value: "Asta",
  // for nye egenskaber skal vi eksplicit sætte flagene til true
  enumerable: true,
  configurable: true
*/!*
});

alert(user.name); // Asta
user.name = "Mikkel"; // Fejl
```

## Ikke tælbar (Non-enumerable)

Lad os tilføje vores egen `toString` til `user`.

Normalt vil objekters indbyggede `toString` være det man kalder for `non-enumerable`. Det betyder at den ikke regnes med i løkker som `for..in`. Men, hvis vi opretter vores egen `toString`, så vises den i `for..in`, som vist her:

```js run
let user = {
  name: "Ulla",
  toString() {
    return this.name;
  }
};

// Som standard vises begge vores egenskaber i for..in:
for (let key in user) alert(key); // name, toString
```

Hvis vi ikke vil have det til at være således kan vi sætte `enumerable:false`. Så vises den ikke i en `for..in` løkke, lige som den indbyggede `toString`:

```js run
let user = {
  name: "Ulla",
  toString() {
    return this.name;
  }
};

Object.defineProperty(user, "toString", {
*!*
  enumerable: false
*/!*
});

*!*
// Nu er vores toString forsvundet fra for..in, ligesom den indbyggede:
*/!*
for (let key in user) alert(key); // name
```

Non-enumerable er også udelukket fra `Object.keys`:

```js
alert(Object.keys(user)); // name
```

## ukonfigurérbare egenskaber (Non-configurable)

Flaget (`configurable:false`) er ofte standard for indbyggede objekter og egenskaber.

En ukonfigurérbare egenskab kan ikke slettes, og dens attributter kan ikke ændres.

For eksempel, `Math.PI` er ikke-skrivbar, ikke-tælbar og ukonfigurérbar:

```js run
let descriptor = Object.getOwnPropertyDescriptor(Math, 'PI');

alert( JSON.stringify(descriptor, null, 2 ) );
/*
{
  "value": 3.141592653589793,
  "writable": false,
  "enumerable": false,
  "configurable": false
}
*/
```
Så en programmør er ikke i stand til at ændre værdien af `Math.PI` eller overskrive den.

```js run
Math.PI = 3; // Fejl, fordi den har writable: false

// delete Math.PI virker heller ikke
```

Vi kan heller ikke ændre `Math.PI` til at være `writable` igen, fordi den har `configurable: false`:

```js run
// Fejl, på grund af configurable: false
Object.defineProperty(Math, "PI", { writable: true });
```

Der er absolut intet vi kan gøre med `Math.PI`.

At gøre en egenskab ukonfigurérbar er en ensrettet vej. Vi kan ikke ændre den tilbage med `defineProperty`.

**Bemærk: `configurable: false` forhindrer ændring af egenskabens flag og sletning mens muligheden for at ændre værdien bevares.**

Her er `user.name` ukonfigurérbar, men vi kan stadig ændre den (fordi den er skrivbar):

```js run
let user = {
  name: "John"
};

Object.defineProperty(user, "name", {
  configurable: false
});

user.name = "Peter"; // Virker fint
delete user.name; // Fejl
```

Og her gør vi `user.name` til en "for evigt lukket" konstant, lige som den indbyggede `Math.PI`:

```js run
let user = {
  name: "Karsten"
};

Object.defineProperty(user, "name", {
  writable: false,
  configurable: false
});

// vi kan ikke ændre user.name eller dens flag
// alt dette vil ikke virke:
user.name = "Lisbeth";
delete user.name;
Object.defineProperty(user, "name", { value: "Lisbeth" });
```

```smart header="Den eneste vej egenskaben kan ændres: writable true -> false"
Der er en lille undtagelse ved ændring af flag.

Vi kan ændre `writable: true` til `false` for en ukonfigurérbar egenskab, så den ikke kan ændres (for at tilføje et ekstra lag af beskyttelse). Men ikke omvendt.

```

## Object.defineProperties

Metoden [Object.defineProperties(obj, descriptors)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties) tillader at definere mange egenskaber på én gang.

Syntaksen er:

```js
Object.defineProperties(obj, {
  prop1: descriptor1,
  prop2: descriptor2
  // ...
});
```

For eksempel, her opretter vi to egenskaber `name` og `surname` på én gang:

```js
Object.defineProperties(user, {
  name: { value: "Karsten", writable: false },
  surname: { value: "Vestergaard", writable: false },
  // ...
});
```

Så vi kan sætte mange egenskaber på én gang.

## Object.getOwnPropertyDescriptors

For at hente alle egenskabsbeskrivelser på én gang, kan vi bruge metoden [Object.getOwnPropertyDescriptors(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptors).

Sammen med `Object.defineProperties` kan den bruges som en "flags-aware" måde at klone et objekt på:

```js
let clone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(obj));
```

Normalt når vi kloner et objekt, bruger vi en tildeling for at kopiere egenskaberne, som dette:

```js
for (let key in user) {
  clone[key] = user[key]
}
```

...Men det kopierer ikke flag. Så hvis vi vil have en "bedre" klon, så er `Object.defineProperties` foretrukket.

En anden forskel er at `for..in` ignorerer symboliske og ikke-tælbare egenskaber, men `Object.getOwnPropertyDescriptors` returnerer *alle* egenskabsbeskrivelser inklusiv symboliske og ikke-antalige egenskaber.

## Global forsegling af et objekt

Egenskabsbeskrivelser virker på niveauet for individuelle egenskaber.

Der er også metoder, der begrænser adgangen til *hele* objektet:

[Object.preventExtensions(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/preventExtensions)
: Forbyder tilføjelsen af nye egenskaber til objektet.

[Object.seal(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/seal)
: Forbyder tilføjelse/fjernelse af egenskaber. Sætter `configurable: false` for alle eksisterende egenskaber.

[Object.freeze(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)
: Forbider tilføjelse/fjernelse/ændring af egenskaber. Sætter `configurable: false, writable: false` for alle eksisterende egenskaber.

Der er også mulighed for at test om de er forseglet:

[Object.isExtensible(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isExtensible)
: Returnerer `false` hvis tilføjelse af egenskaber er forbudt, ellers `true`.

[Object.isSealed(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isSealed)
: Returnerer `true` hvis tilføjelse/fjernelse af egenskaber er forbudt, og alle eksisterende egenskaber har `configurable: false`.

[Object.isFrozen(obj)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen)
: Returnerer `true` hvis tilføjelse/fjernelse/ændring af egenskaber er forbudt, og alle eksisterende egenskaber har `configurable: false, writable: false`.

Disse metoder bruges meget sjældent i praksis.
