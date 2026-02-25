importance: 5

---

# Hvor skriver den?

Vi har `rabbit` der nedarver fra `animal`.

Hvis vi kalder `rabbit.eat()`, hvilket objekt modtager `full` egenskaben: `animal` eller `rabbit`? 

```js
let animal = {
  eat() {
    this.full = true;
  }
};

let rabbit = {
  __proto__: animal
};

rabbit.eat();
```
