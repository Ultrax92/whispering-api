import express from 'express';
import { getAll, getById, create, updateById, deleteById } from './store.js';

const app = express();

app.use(express.json());

app.get('/api/v1/whisper', async (req, res) => {
    const data = await getAll();
    res.json(data);
});

app.get('/api/v1/whisper/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const item = await getById(id);

    if (!item) {
        return res.status(404).json({ erreur: "Chuchotement introuvable" });
    }
    res.json(item);
});

app.post('/api/v1/whisper', async (req, res) => {
    const newItem = await create(req.body.message);
    res.status(201).json(newItem);
});

app.put('/api/v1/whisper/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await updateById(id, req.body.message);
    res.status(200).json({ message: "Mis à jour avec succès" });
});

app.delete('/api/v1/whisper/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    await deleteById(id);
    res.status(200).json({ message: "Supprimé avec succès" });
});

export { app };