importance: 5

---

# Funktionsegenskab efter binding

Der er en værdi i en egenskab af en funktion. Vil den ændre sig efter `bind`? Hvorfor, eller hvorfor ikke?

```js run
function sayHi() {
  alert( this.name );
}
sayHi.test = 5;

*!*
let bound = sayHi.bind({
  name: "John"
});

alert( bound.test ); // hvad vil output'et være? hvorfor?
*/!*
```

