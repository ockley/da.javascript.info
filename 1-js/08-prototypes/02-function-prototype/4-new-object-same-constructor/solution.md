Vi kan bruge denne tilgang hvis vi er sikre på at `"constructor"` egenskaben har den korrekte værdi.

For eksempel, hvis vi ikke rører ved standard `"prototype"`, så virker denne kode altid:

```js run
function User(name) {
  this.name = name;
}

let user = new User('Jan');
let user2 = new user.constructor('Helene');

alert( user2.name ); // Helene (virker!)
```

Det virker fordi `User.prototype.constructor == User`.

..Men hvis en overskriver `User.prototype` uden at genskabe `constructor` som reference til `User`, så vil det fejle.

For eksempel:

```js run
function User(name) {
  this.name = name;
}
*!*
User.prototype = {}; // (*)
*/!*

let user = new User('Jan');
let user2 = new user.constructor('Helene');

alert( user2.name ); // undefined
```

Hvorfor er `user2.name` `undefined`?

Sådan her virker `new user.constructor('Helene')`:

1. Først kigger den efter `constructor` i `user`. Intet fundet.
2. Derefter følger den prototypen. Prototypen af `user` er `User.prototype`, og den har også ingen `constructor` (fordi vi "glemte" at genskabe den!).
3. Går videre op i kæden, `User.prototype` er et almindeligt objekt, og dens prototype er den indbyggede `Object.prototype`. 
4. Til sidst, for den indbyggede `Object.prototype`, findes der en indbygget `Object.prototype.constructor == Object`. Så bruges denne.

Til sidst har vi altså noget der oversat ser ud som `let user2 = new Object('Helene')`. 

Helt sikkert ikke det vi vil. Vi ønsker at skabe `new User`, ikke `new Object`. Det er resultatet af den manglende `constructor`.

(Bare, i det tilfælde, at du er nysgerrig: Kaldet til `new Object(...)` konverterer dets argument til et objekt. Det er en teoretisk ting, i praksis kalder ingen `new Object` med en værdi, og generelt bruger vi ikke `new Object` til at lave objekter).