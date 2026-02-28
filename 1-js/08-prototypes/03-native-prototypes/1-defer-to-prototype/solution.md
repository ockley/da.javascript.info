

```js run
Function.prototype.defer = function(ms) {
  setTimeout(this, ms);
};

function f() {
  alert("Hej!");
}

f.defer(1000); // // viser "Hej!" efter 1 sekund
```
