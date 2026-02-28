importance: 5

---

# Tilføj metoden "f.defer(ms)" til funktioner

Tilføj til prototypen af alle funktioner metoden `defer(ms)`, som kører funktionen efter `ms` millisekunder.

Efter du har gjort det, skal følgende kode fungere:
```js
function f() {
  alert("Hej!");
}

f.defer(1000); // viser "Hej!" efter 1 sekund
```
