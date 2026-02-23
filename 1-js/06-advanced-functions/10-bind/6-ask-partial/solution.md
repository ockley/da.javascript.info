

1. Brug enten en wrapper funktion, en arrow for at gøre det helt kort:

    ```js 
    askPassword(() => user.login(true), () => user.login(false)); 
    ```

    Nu henter `user` fra ydre variable og kører normalt.

2. eller opret en delvis funktion fra `user.login` der bruger `user` som kontekst og det korrekte første argument:


    ```js 
    askPassword(user.login.bind(user, true), user.login.bind(user, false)); 
    ```
