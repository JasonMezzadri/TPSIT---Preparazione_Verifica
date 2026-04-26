const express = require('express');
const app = express();
const port = 3000;

// Configurazione EJS
app.set('view engine', 'ejs');
app.set('views', './wiews');

// Middleware per leggere i dati inviati dai form (fondamentale per il Create/Update)
app.use(express.urlencoded({ extended: true }));

// Il nostro "Database" fittizio (Array di oggetti)
let libri = [
    { id: 1, titolo: "1984", autore: "George Orwell", anno: 1949 },
    { id: 2, titolo: "Il Signore degli Anelli", autore: "J.R.R. Tolkien", anno: 1954 }
];

// ==========================================
// ROTTE (ROUTING) - Implementazione CRUD
// ==========================================

// 1. READ (Tutti i libri) - Pagina principale
app.get('/', (req, res) => {
    // Renderizza views/index.ejs e gli passa l'array dei libri
    res.render('index', { libri: libri, titoloPagina: "Tutti i Libri" });
});

// 2. READ (Singolo libro) - Dettaglio usando il parametro /:id
app.get('/libro/:id', (req, res) => {
    const idRichiesto = parseInt(req.params.id);
    const libroTrovato = libri.find(l => l.id === idRichiesto);

    if (libroTrovato) {
        res.render('dettaglio', { libro: libroTrovato, titoloPagina: "Dettaglio Libro" });
    } else {
        res.status(404).send("Libro non trovato!");
    }
});

// 3. CREATE - Mostra il form per aggiungere un libro
app.get('/nuovo', (req, res) => {
    res.render('nuovo', { titoloPagina: "Aggiungi Libro" });
});

// 4. CREATE - Riceve i dati dal form e aggiunge il libro
app.post('/nuovo', (req, res) => {
    const nuovoId = libri.length > 0 ? libri[libri.length - 1].id + 1 : 1;
    const nuovoLibro = {
        id: nuovoId,
        titolo: req.body.titolo,
        autore: req.body.autore,
        anno: req.body.anno
    };
    libri.push(nuovoLibro);
    res.redirect('/'); // Torna alla home dopo aver aggiunto
});

// 5. DELETE - Elimina un libro (Per semplicità usiamo una GET route in questa app EJS)
app.get('/elimina/:id', (req, res) => {
    const idDaEliminare = parseInt(req.params.id);
    libri = libri.filter(l => l.id !== idDaEliminare);
    res.redirect('/');
});

// Avvio del server
app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});