importance: 5

---

# Fix en funktion der mister "this"

Kaldet til `askPassword()` i koden nedenfor skal tjekke passwordet og derefter kalde `user.loginOk/loginFail` afhængigt af svaret.

Men det fører til en fejl. Hvorfor?

Fix den fremhævede linje for at alt skal virke korrekt (andre linjer skal ikke ændres).

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
askPassword(user.loginOk, user.loginFail);
*/!*
```
