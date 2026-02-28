# Indbyggede prototyper (native prototypes)

Egenskaben `"prototype"` er meget brugt i JavaScript-kernen. Alle indbyggede konstruktør-funktioner bruger den.

Lad os først se på et par detaljer, og så hvordan man bruger den til at tilføje nye evner til indbyggede objekter.

## Object.prototype

Lad os antage at vi vil outputte et tomt objekt:

```js run
let obj = {};
alert( obj ); // "[object Object]" ?
```

Hvor er den kode der genererer strengen `"[object Object]"`? Det er en indbygget `toString`-metode, men hvor er den? Det tomme objekt `obj` har ingen `toString`-metode.

...Men den korte notation `obj = {}` er det samme som `obj = new Object()`, hvor `Object` er en indbygget objekt konstruktør funktion, med sin egen `prototype` der refererer til et stort objekt med `toString` og andre metoder.

Her er hvad der sker:

![](object-prototype.svg)

Når `new Object()` kaldes (eller et literalt objekt `{...}` skabes), så sættes`[[Prototype]]` til væriden af `Object.prototype` ifølge reglen vi diskuterede i forrige kapitel:

![](object-prototype-1.svg)

Så når `obj.toString()` kaldes, bliver metoden taget fra `Object.prototype`.

Vi kan tjekke det på følgende måde:

```js run
let obj = {};

alert(obj.__proto__ === Object.prototype); // true

alert(obj.toString === obj.__proto__.toString); //true
alert(obj.toString === Object.prototype.toString); //true
```

Bemærk at der findes ikke flere `[[Prototype]]` i kæden over `Object.prototype`:

```js run
alert(Object.prototype.__proto__); // null
```

## Andre indbyggede prototyper

Andre indbyggede objekter som `Array`, `Date`, `Function` og andre gemmer metoder i deres prototyper.

For eksempel, når vi opretter en array `[1, 2, 3]`, bruges den indbyggede `new Array()` konstruktør internt. Så bliver `Array.prototype` dens prototype og leverer metoder. Det er meget effektivt i forhold til hukommelsen.

Fra specifikationen gælder det, at alle indbyggede prototyper har `Object.prototype` på toppen. Det er hvorfor nogle siger "alt nedarver fra objekter".

Her er et overordnet billede (af 3 indbyggede for overblikkets skyld):

![](native-prototypes-classes.svg)

Lad os se på prototyperne manuelt:

```js run
let arr = [1, 2, 3];

// Den nedarver fra Array.prototype
alert( arr.__proto__ === Array.prototype ); // true

// som nedarver fraObject.prototype
alert( arr.__proto__.__proto__ === Object.prototype ); // true

// og med værdien null aller øverst.
alert( arr.__proto__.__proto__.__proto__ ); // null
```

Nogle gange er der overlap i mulighederne. For eksempel har `Array.prototype` sin egen `toString` der oplister dens elementer separeret af kommaer, og `Object.prototype` har sin oprindelige `toString` der returnerer `"[object Object]"`. Hvilken en bruges?

```js run
let arr = [1, 2, 3]
alert(arr); // 1,2,3 <-- resultatet kommer fra Array.prototype.toString
```

`Object.prototype` har `toString` som den allerførste i kæden, men `Array.prototype` er tættere på vores kald, så det er den variant der benyttes.


![](native-prototypes-array-tostring.svg)


Udviklerværktøjer som Chrome developer konsollen viser også nedarvning. Skriv f.eks.`console.dir([1,2,3])` (ikke console.log) for at se et indbygget objekt:

![](console_dir_array.png)

Andre indbyggede objekter fungerer på samme måde. Selv funktioner -- de er objekter af den indbyggede `Function` konstruktør, og deres metoder (`call`/`apply` og andre) bliver taget fra `Function.prototype`. Funktioner har også deres egen `toString`.

```js run
function f() {}

alert(f.__proto__ == Function.prototype); // true
alert(f.__proto__.__proto__ == Object.prototype); // true, nedarver fra Object
```

## Primitiver

En mere indviklet ting sker med strenge, tal og boolske værdier.

Som vi husker, er de ikke objekter. Men hvis vi forsøger at tilgå deres egenskaber, bliver midlertidige wrapper-objekter oprettet ved brug af de indbyggede konstruktører `String`, `Number` og `Boolean`. De leverer metoderne og forsvinder igen.

Disse objekter bliver skabt usynligt for os, og de fleste browsere optimerer dem ud, men specifikationen beskriver det præcist på denne måde. Metoderne for disse objekter befinder sig også i deres prototyper, tilgængelige som `String.prototype`, `Number.prototype` og `Boolean.prototype`.

```warn header="Værdierne `null` og `undefined` har ingen objekt-wrapper"
Specielle værdier som `null` og `undefined` er anderledes. De har ingen objekt-wrapper, så metoder og egenskaber er ikke tilgængelige for dem. Og der er ingen tilsvarende prototyper.
```

## Ændring af native prototyper [#native-prototype-change]

Native prototyper kan ændres. For eksempel, hvis vi tilføjer en metode til `String.prototype`, bliver den tilgængelig for alle strenge:

```js run
String.prototype.show = function() {
  alert(this);
};

"BOOM!".show(); // BOOM!
```

Mens vi udvikler kan der være ideer om nye indbyggede metoder vi gerne vil have, og vi kan blive fristet til at tilføje dem til native prototyper. Men det er generelt et dårligt idé.

```warn
Prototyper er globale, så der opstår nemt konflikter. Hvis to biblioteker tilføjer en metode `String.prototype.show`, så vil en af dem overskrive metoden i den anden.

Så, generelt set, ændring af en native prototype er betragtet som et dårligt idé.
```

**I moderne programmering er der kun ét tilfælde hvor ændring af native prototyper er godkendt. Det er polyfilling.**

Polyfilling er et udtryk for at lave en erstatning for en metode der findes i JavaScript specifikationen, men endnu ikke understøttet af en bestemt JavaScript motor.

Her må vi manuelt implementere metoden og tilføje den til den indbyggede prototype.

For eksempel:

```js run
if (!String.prototype.repeat) { // hvis metoden ikke findes
  // tilføje den til prototypen

  String.prototype.repeat = function(n) {
    // gentag en string n gange

    // egentlig bør koden være lidt mere kompleks end dette
    // (se hele algoritmen i specifikationen)
    // men nogle gange er en næsten perfekt polyfill nok
    return new Array(n + 1).join(this);
  };
}

alert( "La".repeat(3) ); // LaLaLa
```


## Lån fra from prototyper

I kapitlet <info:call-apply-decorators#method-borrowing> talte vi om at låne fra metoder.

Det er når vi tager en metode fra et objekt og kopierer den til et andet objekt.

Nogle af de indbyggede metoder i prototyper bliver ofte lånt.

Hvi vi for eksempel har et array-lignende objekt, kan vi ønske at kopiere nogle `Array` metoder til det.

I stil med dette:

```js run
let obj = {
  0: "Hej",
  1: "verden!",
  length: 2,
};

*!*
obj.join = Array.prototype.join;
*/!*

alert( obj.join(', ') ); // Hej, verden!
```

Det virker fordi den interne algoritme i den indbyggede `join`-metode kun bryder sig om de korrekte indekser og egenskaben `length`. Den tjekker ikke om objektet faktisk er et array. Mange indbyggede metoder er sådan.

En anden mulighed er at arve ved at sætte `obj.__proto__` til `Array.prototype`, så alle `Array`-metoder automatisk er tilgængelige i `obj`.

Men det er umuligt hvis `obj` allerede arver fra et andet objekt. Husk, vi kan kun arve fra ét objekt ad gangen.

At låne metoder er fleksibelt, det tillader os at blande funktionaliteter fra forskellige objekter hvis det er nødvendigt.

## Opsummering

- Alle indbyggede objekter følger samme mønster:
    - Metoderne er gemt i prototypen (`Array.prototype`, `Object.prototype`, `Date.prototype`, etc.)
    - Objektet selv gemmer kun data (array-elementer, objektegenskaber, datoen)
- Primitives gemmer også metoder i prototyperne af wrapper-objekter: `Number.prototype`, `String.prototype` og `Boolean.prototype`. Kun `undefined` og `null` har ikke wrapper-objekter
- Indbyggede prototyper kan ændres eller udfyldes med nye metoder. Men det anbefales ikke at ændre dem. Det eneste tilladte tilfælde er når vi tilføjer en ny standard, men den endnu ikke understøttes af JavaScript-motoren
