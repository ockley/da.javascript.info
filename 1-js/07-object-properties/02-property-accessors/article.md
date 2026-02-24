
# Getters og setters for egenskaber

Der er to typer af objektegenskaber.

Den første type er *data egenskaber*. Vi ved allerede hvordan man arbejder med dem. Alle egenskaber, som vi har brugt indtil nu, var data egenskaber.

Den anden type er *accessor egenskaber*. De er faktisk funktioner, der kører ved læsning og skrivning af en værdi, men ser ud som normale egenskaber for ekstern kode.

## Getters og setters

Accessor egenskaber er repræsenteret ved "getter" og "setter" metoder. I en objekt-literal bliver de betegnet med `get` og `set`:

```js
let obj = {
  *!*get propName()*/!* {
    // getter, koden afvikles når værdien i obj.propName læses
  },

  *!*set propName(value)*/!* {
    // setter, koden afvikles når værdien i obj.propName sættes
  }
};
```

Getter virker når `obj.propName` læses, setter virker når `obj.propName = value` sættes.

Hvis vi for eksempel har et `user` objekt med `name` og `surname`:

```js
let user = {
  name: "Karsten",
  surname: "Vestergaard"
};
```

Nu vil vi gerne have en egenskab kaldet `fullName`, som skal være `"Karsten Vestergaard"`. Selvfølgelig vil vi ikke kopiere eksisterende information, så vi kan implementere det som en accessor:

```js run
let user = {
  name: "Karsten",
  surname: "Vestergaard",

*!*
  get fullName() {
    return `${this.name} ${this.surname}`;
  }
*/!*
};

*!*
alert(user.fullName); // Karsten Vestergaard
*/!*
```

Udefra ligner en accessor egenskab en helt normal egenskab - det er hele ideen med accessor egenskaber. Vi *kalder ikke* `user.fullName` som en funktion, vi *læser den* som en normal værdi: Getter'en virker bag scenetæppet.

For nu har `fullName` kun en getter. Hvis vi prøver at tildele `user.fullName = value`, vil der være en fejl, fordi der ikke er nogen setter:

```js run
let user = {
  get fullName() {
    return `...`;
  }
};

*!*
user.fullName = "Test"; // Fejl (egenskaben har kun en getter)
*/!*
```

Lad og fikse det ved at tilføje en setter for `user.fullName`:

```js run
let user = {
  name: "Karsten",
  surname: "Vestergaard",

  get fullName() {
    return `${this.name} ${this.surname}`;
  },

*!*
  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  }
*/!*
};

// set fullName bliver afviklet når en værdi tildeles.
user.fullName = "Alice Cooper";

alert(user.name); // Alice
alert(user.surname); // Cooper
```

Som resultat har vi en "virtuel" egenskab `fullName`. Den er læsbar og skrivbar udadtil, men skjuler den indre struktur af `user` objektet, som består af `name` og `surname`. Det er en af de vigtigste fordele ved accessor egenskaber: De giver os mulighed for at abstrahere og skjule den indre struktur af data.

## Accessor descriptors

Descriptors for accessor egenskaber er anderledes end dem for data egenskaber.

For accessor egenskaber er der ingen `value` eller `writable`. I stedet er der `get` og `set` funktioner.

Samlet set har en accessor descriptor følgende:

- **`get`** -- en funktion uden argumenter, der kører når en egenskab læses,
- **`set`** -- en funktion med ét argument, der kører når en egenskab sættes,
- **`enumerable`** -- samme som for data egenskaber,
- **`configurable`** -- samme som for data egenskaber.

Hvis vi vil skabe en accessor `fullName` med `defineProperty` skal vi videregive en descriptor med `get` og `set`:

```js run
let user = {
  name: "Karsten",
  surname: "Vestergaard"
};

*!*
Object.defineProperty(user, 'fullName', {
  get() {
    return `${this.name} ${this.surname}`;
  },

  set(value) {
    [this.name, this.surname] = value.split(" ");
  }
*/!*
});

alert(user.fullName); // Karsten Vestergaard

for(let key in user) alert(key); // name, surname
```

Bemærk at en egenskab kan enten være en accessor (har `get/set` metoder) eller en data egenskab (har en `value`), ikke begge dele.

Hvis vi forsøger at give både `get` og `value` i samme descriptor, vil der være en fejl, fordi det er umuligt at have en egenskab, der både er en accessor og en data egenskab.:

```js run
*!*
// Fejl: Ugyldig descriptor.
*/!*
Object.defineProperty({}, 'prop', {
  get() {
    return 1
  },

  value: 2
});
```

## Smartere getters/setters

Getters/setters kan bruges som wrappers over "reelle" egenskabsværdier for at få mere kontrol over operationer med dem.

For eksempel, hvis vi vil forbyde for korte navne for `user`, kan vi have en setter `name` og gemme værdien i en separat egenskab `_name`:

```js run
let user = {
  get name() {
    return this._name;
  },

  set name(value) {
    if (value.length < 4) {
      alert("Navnet er for kort. Det skal have mindst 4 tegn");
      return;
    }
    this._name = value;
  }
};

user.name = "Henrik";
alert(user.name); // Henrik

user.name = ""; // Navnet er for kort...
```

Så navnet er gemt i egenskaben `_name`, og adgangen sker via getter og setter.

Teknisk set er udvendig kode i stand til at tilgå navnet direkte ved brug af `user._name`. Men der er en bredt anerkendt konvention om, at egenskaber, der starter med et understreg `"_"` er interne og ikke bør røres fra uden for objektet.


## Using for compatibility

En af de store fordele ved accessors er, at de giver os mulighed for at tage kontrol over en "almindelig" data egenskab på et hvilket som helst tidspunkt ved at erstatte den med en getter og en setter og tilpasse dens adfærd.

Forestil dig, at vi startede med at implementere brugerobjekter ved brug af data egenskaber `name` og `age`:

```js
function User(name, age) {
  this.name = name;
  this.age = age;
}

let john = new User("John", 25);

alert( john.age ); // 25
```

...men på et tidspunkt kan tingene ændre sig. I stedet for `age` kan vi beslutte os for at gemme `birthday`, fordi det er mere præcist og praktisk at have. Så vi ændrer `User` konstruktøren:

```js
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;
}

let john = new User("John", new Date(1992, 6, 1));
```

Hvad gør vi nu med den gamle kode der stadig bruger `age` egenskaben?

Vi kan forsøge at finde alle disse steder og fikse dem, men det tager tid og kan være svært at gøre, hvis koden bruges af mange andre personer. Og desuden er `age` en dejlig ting at have i `user`, ikke sandt?

Lad os beholde den.

Tilføj en getter for `age` som løsning på problemet:

```js run no-beautify
function User(name, birthday) {
  this.name = name;
  this.birthday = birthday;

*!*
  // age beregnes fra den nuværende dato og fødselsdagen
  Object.defineProperty(this, "age", {
    get() {
      let todayYear = new Date().getFullYear();
      return todayYear - this.birthday.getFullYear();
    }
  });
*/!*
}

let john = new User("John", new Date(1992, 6, 1));

alert( john.birthday ); // birthday er tilgængelig
alert( john.age );      // ...det samme er age
```

Nu vil den gamle kode stadig virke og vi har fået en ny, brugbar egenskab.
