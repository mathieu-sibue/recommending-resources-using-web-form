//Importation des modules
const express = require("express"); 
const mongoose = require("mongoose"); 
const bodyParser = require("body-parser");
const path = require("path");
const compression = require('compression');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();


//On set l'environnement sur un environnement de production
process.env.NODE_ENV = 'production';


//On se connecte à MongoDB
/*
const {
    MONGO_HOSTNAME,
    MONGO_DB,
    MONGO_PORT
} = process.env;
*/
//Pour éviter d'avoir les Deprecation Warnings
mongoose.set('useCreateIndex', true);   
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
//mongoose.connect(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`);
const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI || "mongodb://localhost:27017/SolidaForm");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


//On initialise l'app express du back
const app = express();


//Utilisation du middleware Body Parser
const urlencodedParser = bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
});
app.use(urlencodedParser);
const jsonParser = bodyParser.json({
    extended: true,
    limit: '10mb'
});
app.use(jsonParser);


//Utilisation du middleware compression
app.use(compression());


//Définition des CORS
const corsOptions = {
    origin: "http://localhost:3000",
    //origin: "http://192.168.99.100:3000",
    //origin: "http://172.20.10.3:3000",
    //origin: "http://localhost:5000",
    //origin: "http://172.20.10.3:5000",
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


//Mise en place des routes d'écoute
const userRouter = require("./routes/userRoutes");
app.use("/user", userRouter);

const questionRouter = require("./routes/questionRoutes");
app.use("/question", questionRouter);

const tutorialRouter = require("./routes/tutorialRoutes");
app.use("/tutorial", tutorialRouter);

const productRouter = require("./routes/productRoutes");
app.use("/product", productRouter);

const responseRouter = require("./routes/responseRoutes");
app.use("/response", responseRouter);

const ressourceRouter = require("./routes/ressourceRoutes");
app.use("/ressource", ressourceRouter);


//Redirige toutes les routes non-api (ie ne provenant pas du front vers le back mais juste du navigateur voulant atteindre le front) au front
app.use(express.static(path.join(__dirname, '../client', 'build')));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client','build','index.html'));
});

//Définition et mise en place du port d'écoute (env variable)
const PORT = 8800;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

//app.listen(8800, "backend", 511, () => console.log(`App listening on port 8800`));
