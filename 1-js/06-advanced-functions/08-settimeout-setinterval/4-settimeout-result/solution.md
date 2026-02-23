
En `setTimeout` vil kun køre efter at det nuværende kode er færdig.

Variablen `i` vil derfor have værdien `100000000`.

```js run
let i = 0;

setTimeout(() => alert(i), 100); // 100000000

// Forestil dig at tiden for at køre dette er mere end 100ms
for(let j = 0; j < 100000000; j++) {
  i++; 
}
```
