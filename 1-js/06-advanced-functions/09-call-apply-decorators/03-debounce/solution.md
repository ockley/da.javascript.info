```js demo
function debounce(func, ms) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, arguments), ms);
  };
}

```

Et kald til `debounce` returnerer en wrapper. Når den kaldes, planlægger den et kald til den originale funktion efter `ms` millisekunder og annullerer tidligere timeouts hvis de findes.

