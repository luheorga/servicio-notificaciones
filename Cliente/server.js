import express, { static } from 'express';

const servidor = express();
const puerto = '5555';

servidor.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`)
});

servidor.use(static(__dirname + '/app'));

servidor.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${puerto}`);
});
