# Quillino — sito

Landing page di [Quillino](https://apps.apple.com/it/app/quillino-gestione-affitti/id6774200347), app di gestione affitti per piccoli proprietari (iPhone, iPad, Mac, Apple Watch).

Sito statico (HTML/CSS/JS, nessuna dipendenza) pubblicato con GitHub Pages.

## Struttura
- `index.html` — pagina unica
- `styles.css` — design system (token colori/tipografia dell'app)
- `script.js` — reveal in scroll, menu mobile, accordion FAQ
- `assets/screens/` — screenshot dell'app
- `host/index.html` — pagina di Quillino Host (affitti brevi); `assets/host/` ha i suoi screenshot con la cornice (`tools/frame.py`)
- `guida/` — guide fiscali (acconto cedolare secca, CIN e cedolare per gli affitti brevi)
- `llms.txt` — descrizione del sito per gli assistenti AI

## Sviluppo locale
```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Prima di pubblicare
```bash
python3 tools/check.py
```
Controlla link e immagini, dati strutturati (JSON-LD valido, stesse FAQ della pagina), gerarchia dei titoli, dimensioni delle immagini, stili in linea (la CSP non li ammette) e prezzi. Esce con errore se qualcosa non va.

**Regola:** il sito si pubblica (copia sul repo `public`) solo dopo che l'app è sullo store, mai prima.
