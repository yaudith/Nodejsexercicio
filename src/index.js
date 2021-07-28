const express = require("express");
const mongoose = require("mongoose");
const User = require("./Models/Users");

const app = express();
const port = 8080;

app.use(express.json());

const mongoUrl = "mongodb://localhost:27017/mybdados";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const database = mongoose.connection;
database.on(
  "error",
  console.error.bind(console, "Não tem conexão MongoDB!")
);

app.get("/Users", async (req, res) => {
  const user = await User.find({});
  res.json({ user });
});

app.post("/Users/novos", async (req, res) => {
  try {
    console.log(req.body);
    const { nome } = req.body;
    const { dataNascimento } = req.body;
    const user = new User({ nome, dataNascimento });
    await user.save();
    res.send(` "${user.nome}" Usuario foi Cadastrado!`);
  } catch (error) {
    res.status(404).json({ msj: "Erro no Cadastro!" });
    console.log("Erro no Cadastro!");
  }
});

app.get("/Users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ user });
  } catch (error) {
    res.status(404).json({ msj: "Dados Não Existen!" });
    console.log("Dados Não Existen!");
  }
});

app.put("/Users/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    if (id && data) {
    await User.findByIdAndUpdate(id, data);
    console.log("Usuario Atualizado com Sucesso!");
    res.send("Usuario Atualizado com Sucesso!");
    } else {
      res.json(" Os Dados Não Existentes!");
    }
  } catch (error) {
    res.status(404).json({ msj: "Dados Não Existentes" });
    console.log("Os Dados Não Existentes!");
  }
});
app.delete("/Users/:id", async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id }, () => {
      console.log("Usuario deletado!");
    });
    res.send("Usuario deletado!");
  } catch (error) {
    res.status(404).json({ msj: "Os Dados Não Existen" });
    console.log("Os Dados Não Existen!");
  }
});
app.listen(port, () => {
  console.log(`Porta Iniciada http://localhost: ${port}`);
});