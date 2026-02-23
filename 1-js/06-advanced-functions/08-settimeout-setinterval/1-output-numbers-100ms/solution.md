
Ved brug af `setInterval`:

```js run
function printNumbers(from, to) {
  let current = from;

  let timerId = setInterval(function() {
    alert(current);
    if (current == to) {
      clearInterval(timerId);
    }
    current++;
  }, 1000);
}

// brug:
printNumbers(5, 10);
```

Ved brug af indlejret `setTimeout`:


```js run
function printNumbers(from, to) {
  let current = from;

  setTimeout(function go() {
    alert(current);
    if (current < to) {
      setTimeout(go, 1000);
    }
    current++;
  }, 1000);
}

// brug:
printNumbers(5, 10);
```

Bemærk at begge løsninger har en indledende forsinkelse før det første output. Funktionen kaldes efter `1000ms` den første gang.

Hvis vi vil have funktionen til at køre med det samme, så kan vi tilføje et ekstra kald på en separat linje, som dette:

```js run
function printNumbers(from, to) {
  let current = from;

  function go() {
    alert(current);
    if (current == to) {
      clearInterval(timerId);
    }
    current++;
  }

*!*
  go();
*/!*
  let timerId = setInterval(go, 1000);
}

printNumbers(5, 10);
```
