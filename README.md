<p align="center">
  <img src="https://i.ibb.co/MDX70FD3/b712b955-8581-492b-82dd-e95bf3f830f3.png" alt="">
</p>

<h1 align="center">Flip 7 Segnapunti</h1>

Un segnapunti web per **Flip 7**, il gioco di carte "press your luck". Tocchi le carte che ogni giocatore ha davanti e l'app calcola da sola il punteggio della mano, i totali e quanto manca per arrivare a 200.

Niente installazioni, niente account: è una pagina statica in HTML, CSS e JavaScript puro. Si apre dal telefono e si usa direttamente al tavolo.

## Funzionalità

- **Calcolo automatico della mano** con le regole ufficiali: somma dei numeri, poi ×2, poi i bonus +2…+10, poi +15 per il Flip 7
- **Flip 7 riconosciuto da solo** quando un giocatore ha 7 carte numero diverse
- **Sballato** con un tocco: la mano vale 0
- **Inserimento manuale** del punteggio, se preferisci contare tu
- **Classifica dal vivo**: posizione, punti mancanti al traguardo, distacco dal primo e totale che avresti chiudendo la mano adesso
- **Storico delle mani** in tabella, con le mani da Flip 7 segnate con ★ e il tasto per annullare l'ultima mano
- **Fine partita automatica**: a fine mano, se qualcuno ha raggiunto il traguardo, vince chi ha più punti
- **Traguardo personalizzabile** (200 di default)
- **Salvataggio automatico** nel browser (`localStorage`): se ricarichi la pagina la partita resta lì
- **Tema chiaro e scuro** che segue le impostazioni del dispositivo
- Pensato per lo schermo del telefono, funziona anche su desktop

## Come si contano i punti

| Passo | Cosa fai | Esempio |
|---|---|---|
| 1 | Sommi le carte numero | 3 + 8 + 12 = **23** |
| 2 | Se hai il **×2**, raddoppi solo quella somma | 23 × 2 = **46** |
| 3 | Aggiungi i modificatori **+2 … +10** | 46 + 4 = **50** |
| 4 | Se hai 7 numeri diversi, aggiungi **+15** | — |

- Se sballi (doppione senza Second Chance) fai **0** punti.
- Puoi chiudere anche con soli modificatori: valgono i loro punti, ma il ×2 da solo vale 0.
- La partita finisce alla fine della mano in cui almeno un giocatore arriva a **200**. Vince chi ha più punti.

## Avvio

Scarica la cartella e apri `index.html` nel browser. Non serve altro.

Se preferisci un server locale:

```bash
npx serve .
# oppure
python3 -m http.server 8000
```

### Pubblicarlo con GitHub Pages

1. Carica i file in un repository pubblico
2. Vai su **Settings → Pages**
3. In **Source** scegli il branch `main` e la cartella `/ (root)`
4. Dopo un minuto il segnapunti è online su `https://<tuo-utente>.github.io/<nome-repo>/`

## Struttura

```
├── index.html   # struttura della pagina
├── style.css    # stile, palette e tema chiaro/scuro
├── app.js       # stato della partita, calcolo punti e rendering
├── LICENSE
└── README.md
```

`app.js` tiene tutto in un unico oggetto di stato (`S`) salvato in `localStorage` con la chiave `flip7-score-v1`. La funzione `calc()` calcola il punteggio di una mano, `render()` ridisegna l'interfaccia a ogni modifica.

## Tecnologie

- HTML, CSS e JavaScript senza framework né build
- Font: [Bungee](https://fonts.google.com/specimen/Bungee) e [Figtree](https://fonts.google.com/specimen/Figtree) da Google Fonts

## Nota

Progetto non ufficiale, fatto da fan. Flip 7 è un gioco di The Op Games: questo repository non è affiliato né approvato da loro. Per le regole complete fai riferimento al regolamento ufficiale del gioco.

## Licenza

Distribuito con licenza [MIT](LICENSE).
