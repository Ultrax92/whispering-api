const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware TRÈS IMPORTANT pour une API REST : 
// Il permet à Express de comprendre les données envoyées au format JSON (pour créer ou modifier un chuchotement)
app.use(express.json());

// Une route de test basique pour voir si tout fonctionne
app.get('/', (req, res) => {
    res.send('Bienvenue sur l\'API Whispering !');
});

// Nouvelle route pour LIRE tous les chuchotements (Le 'R' de CRUD)
app.get('/api/whispers', (req, res) => {

    // 1. On utilise fs.readFile pour lire le fichier data.json
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            console.error("Erreur de lecture :", err);
            // Si erreur, on renvoie un code 500 (Erreur Serveur)
            return res.status(500).json({ erreur: "Erreur lors de la lecture des données." });
        }

        // 2. Le fichier est lu sous forme de texte brut. 
        // On le transforme en vrai tableau JavaScript avec JSON.parse()
        const whispers = JSON.parse(data);

        // 3. On renvoie ce tableau au client au format JSON
        res.json(whispers);
    });
});

// Nouvelle route pour CRÉER un chuchotement (Le 'C' de CRUD)
app.post('/api/whispers', (req, res) => {

    // 1. On lit le fichier actuel
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ erreur: "Erreur de lecture du fichier." });
        }

        const whispers = JSON.parse(data);

        // 2. On prépare le nouveau chuchotement avec les données reçues
        const nouveauChuchotement = {
            id: Date.now(), // Petite astuce : on utilise l'heure exacte en millisecondes pour faire un ID unique !
            content: req.body.content,
            author: req.body.author
        };

        // 3. On ajoute ce nouveau chuchotement à notre tableau
        whispers.push(nouveauChuchotement);

        // 4. On réécrit le fichier data.json avec le tableau mis à jour
        // (JSON.stringify(..., null, 2) permet de garder le fichier bien indenté et lisible)
        fs.writeFile('./data.json', JSON.stringify(whispers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ erreur: "Erreur lors de la sauvegarde." });
            }

            // 5. On répond au client que tout s'est bien passé avec le code 201 (Created)
            res.status(201).json({ message: "Chuchotement ajouté avec succès !", whisper: nouveauChuchotement });
        });
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur Whispering démarré sur http://localhost:${PORT}`);
});