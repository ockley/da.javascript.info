importance: 5

---

# Anden binding

Kan vi ændre `this` ved yderligere binding?

Hvad vil output'et være?

```js no-beautify
function f() {
  alert(this.name);
}

f = f.bind( {name: "John"} ).bind( {name: "Ann" } );

f();
```

