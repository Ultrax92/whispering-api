const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API Whispering !");
});

app.get("/api/whispers", (req, res) => {
    fs.readFile("./data.json", "utf8", (err, data) => {
        if (err) {
            console.error("Erreur de lecture :", err);
            return res
                .status(500)
                .json({ erreur: "Erreur lors de la lecture des données." });
        }

        const whispers = JSON.parse(data);
        res.json(whispers);
    });
});

app.post("/api/whispers", (req, res) => {
    fs.readFile("./data.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ erreur: "Erreur de lecture du fichier." });
        }

        const whispers = JSON.parse(data);
        const nouveauChuchotement = {
            id: Date.now(),
            content: req.body.content,
            author: req.body.author,
        };

        whispers.push(nouveauChuchotement);

        fs.writeFile("./data.json", JSON.stringify(whispers, null, 2), (err) => {
            if (err) {
                return res
                    .status(500)
                    .json({ erreur: "Erreur lors de la sauvegarde." });
            }

            res
                .status(201)
                .json({
                    message: "Chuchotement ajouté avec succès !",
                    whisper: nouveauChuchotement,
                });
        });
    });
});

app.put("/api/whispers/:id", (req, res) => {
    const idSaisi = parseInt(req.params.id);

    fs.readFile("./data.json", "utf8", (err, data) => {
        if (err) return res.status(500).json({ erreur: "Erreur de lecture" });

        let whispers = JSON.parse(data);
        const index = whispers.findIndex((w) => w.id === idSaisi);

        if (index === -1) {
            return res.status(404).json({ erreur: "Chuchotement introuvable" });
        }

        whispers[index].content = req.body.content || whispers[index].content;
        whispers[index].author = req.body.author || whispers[index].author;

        fs.writeFile("./data.json", JSON.stringify(whispers, null, 2), (err) => {
            if (err) return res.status(500).json({ erreur: "Erreur de sauvegarde" });
            res.json({
                message: "Chuchotement mis à jour !",
                whisper: whispers[index],
            });
        });
    });
});

app.delete('/api/whispers/:id', (req, res) => {
    const idSaisi = parseInt(req.params.id);

    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) return res.status(500).json({ erreur: "Erreur de lecture" });

        let whispers = JSON.parse(data);
        const whispersFiltres = whispers.filter(w => w.id !== idSaisi);

        if (whispers.length === whispersFiltres.length) {
            return res.status(404).json({ erreur: "Chuchotement introuvable" });
        }

        fs.writeFile('./data.json', JSON.stringify(whispersFiltres, null, 2), (err) => {
            if (err) return res.status(500).json({ erreur: "Erreur de sauvegarde" });
            res.json({ message: "Chuchotement supprimé avec succès !" });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Serveur Whispering démarré sur http://localhost:${PORT}`);
});
