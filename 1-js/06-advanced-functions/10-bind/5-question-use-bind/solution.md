
Fejlen sker fordi `askPassword` får funktionerne `loginOk/loginFail` uden objektet.

Når den kalder dem, antager de `this=undefined`.

Lad os `binde` konteksten:

```js run
function askPassword(ok, fail) {
  let password = prompt("Password?", '');
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: 'John',

  loginOk() {
    alert(`${this.name} logget ind`);
  },

  loginFail() {
    alert(`${this.name} fejl i log in`);
  },

};

*!*
askPassword(user.loginOk.bind(user), user.loginFail.bind(user));
*/!*
```

Nu virker det.

En alternativ løsning kan være at bruge en wrapper-funktion:
```js
//...
askPassword(() => user.loginOk(), () => user.loginFail());
```

Det virker normalt også fint og ser ok ud.

Det er lidt mindre pålideligt i mere komplekse situationer hvor `user` variablen kan ændre sig *efter* `askPassword` er kaldt, men *før* besøgende har svaret og kalder `() => user.loginOk()`. 
