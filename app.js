const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// --- ESERCIZIO 1 ---

// Percorso base / : Tabella degli esercizi
app.get('/', (req, res) => {
    const listaTask = [
        { nome: "Esercizio 1", tipo: "Facile" },
        { nome: "Esercizio 2", tipo: "Medio" }
    ];
    res.render('index', { listaTask });
});

// Percorso /news : Pagina modale bloccante
app.get('/news', (req, res) => {
    res.render('news');
});

// Percorso /contatore : File system scrittura
app.get('/contatore', (req, res) => {
    let conteggio = 0;
    const fileContatore = 'log_accessi.txt';
    
    if (fs.existsSync(fileContatore)) {
        conteggio = parseInt(fs.readFileSync(fileContatore, 'utf8')) || 0;
    }
    conteggio++;
    fs.writeFileSync(fileContatore, conteggio.toString());
    res.send("accesso memorizzato");
});

// Percorso /ricetta : Somma variabili e lettura JSON
app.get('/ricetta', (req, res) => {
    const p1 = 20;
    const p2 = 30;
    const sommaPunti = p1 + p2;
    
    let infoSalvata = "Nessun dato in memoria.";
    if (fs.existsSync('archivio.json')) {
        const datiJson = JSON.parse(fs.readFileSync('archivio.json', 'utf8'));
        infoSalvata = datiJson.commento;
    }
    res.send(`Punti totali: ${sommaPunti} | Descrizione caricata: ${infoSalvata}`);
});

// --- ESERCIZIO 2 ---

// Percorso /RegistraDescrizione : Form
app.get('/RegistraDescrizione', (req, res) => {
    res.render('registra');
});

// Action per il form: Registra su file
app.post('/registra', (req, res) => {
    const nuovoDato = {
        autore: req.body.nickname,
        commento: req.body.descrizione
    };
    fs.writeFileSync('archivio.json', JSON.stringify(nuovoDato));
    // Rimanda alla ricetta per vedere l'aggiornamento
    res.redirect('/ricetta');
});

app.listen(5000, () => console.log("Server attivo sulla porta 5000"));
