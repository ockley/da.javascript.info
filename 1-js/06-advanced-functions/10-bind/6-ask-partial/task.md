importance: 5

---

# Partial application for login

Denne opgave er en lidt mere kompleks variant af <info:task/question-use-bind>. 

`user` objektet er ændret. Nu har den, i stedet for to funktioner `loginOk/loginFail`, én enkelt funktion `user.login(true/false)`.

Hvad skal vi sende til `askPassword` i koden nedenfor, så den kalder `user.login(true)` som `ok` og `user.login(false)` som `fail`?

```js
function askPassword(ok, fail) {
  let password = prompt("Password?", '');
  if (password == "rockstar") ok();
  else fail();
}

let user = {
  name: 'John',

  login(result) {
    alert( this.name + (result ? ' logged in' : ' failed to log in') );
  }
};

*!*
askPassword(?, ?); // ?
*/!*
```

Din ændring skal kun ændre den fremhævede linje.

