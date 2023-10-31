//imports
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const initializePassport = require("./passport/passport.config");
const config = require("./config/config.js")

//routes
const productsRouter = require("./routes/product.router");
const cartRouter = require("./routes/cart.router");
const usersRouter = require("./routes/users.router");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    config.mongoURL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Conectado a la BD de Mongo Atlas");
  })
  .catch((error) => {
    console.error("Error en la conexión", error);
  });

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        config.mongoURL,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
      ttl: 1000,
    }),
    secret: "coderhouse",
    resave: false,
    saveUninitialized: true,
  })
);

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

//vistas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//routes
app.use("/api/sessions", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.get("/", (req, res) => {
  res.send("Express Sessions!");
});



app.listen(config.port, () => {
  console.log(`Servidor en ejecución en el puerto ${config.port} `);
});

