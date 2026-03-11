import { app } from "./server.js";

const port = 3000;

app.listen(port, () => {
    console.log(`🚀 Serveur Whispering en ligne sur http://localhost:${port}`);
});