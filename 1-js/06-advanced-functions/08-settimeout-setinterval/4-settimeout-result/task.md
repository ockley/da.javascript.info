importance: 5

---

# Hvad vil setTimeout vise?

I koden nedenfor bliver et `setTimeout` kald planlagt. Derefter køres en tung beregning, som tager mere end 100ms at fuldføre.

Hvornår vil det planlagte kald køres?

1. Efter løkken.
2. Før løkken.
3. I begyndelsen af løkken.


Hvad vil `alert` vise?

```js
let i = 0;

setTimeout(() => alert(i), 100); // ?

// Forestil dig at tiden for at køre dette er mere end 100ms
for(let j = 0; j < 100000000; j++) {
  i++; 
}
```
