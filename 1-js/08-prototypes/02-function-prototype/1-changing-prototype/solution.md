
Svarene er:

1. `true`. 

    Tildelingen til `Rabbit.prototype` sætter `[[Prototype]]` for nye objekter, men påvirker ikke eksisterende objekter. Så `rabbit` har stadig den gamle prototype, hvor `eats` er `true`.

2. `false`. 

    Objekter bliver tildelt med reference til det oprindelige objekt. Objektet fra `Rabbit.prototype` er ikke kopieret, det er stadig et enkelt objekt refereret både af `Rabbit.prototype` og af `[[Prototype]]` på `rabbit`.

    Så når vi ændrer dets indhold via én reference, er det synligt via den anden reference.

3. `true`.

    Alle `delete` operationer udføres direkte på objektet. Her forsøger `delete rabbit.eats` at fjerne `eats` egenskaben fra `rabbit`, men det har ikke den egenskab. Så operationen har ingen effekt.

4. `undefined`.

    Egenskaben `eats` er slettet fra prototypen, den eksisterer ikke længere.
