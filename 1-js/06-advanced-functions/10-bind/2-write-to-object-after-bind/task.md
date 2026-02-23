importance: 5

---

# Bundet funktion som en metode

Hvad vil output'et være?

```js
function f() {
  alert( this ); // ?
}

let user = {
  g: f.bind(null)
};

user.g();
```

