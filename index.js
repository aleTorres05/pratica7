const express = require("express");
const fs = require("fs");

const server = express();

server.use(express.json());

const dbFile = "db.json";

createFile();

server.get("/koders", (_, response) => {
  const koders = getKoders();
  if (!koders.length) {
    response.status(400);
    response.json({
      message: "No hay lista de Koders",
    });
    return;
  }

  response.json({
    message: "All Koders",
    koders: koders,
  });
});

server.post("/koders", (request, response) => {
  const newKoder = request.body;
  if (!newKoder) {
    response.status(400);
    response.json({
      message: "Koder missing!",
    });
    return;
  }
  addkoder(newKoder);
  const koders = getKoders();
  response.json({
    message: "New Koder Added",
    koders: koders,
  });
});

server.delete("/koders/:name", (request, response) => {
  let koderToDelete = request.params.name;
  const koders = getKoders();
  koders.filter((koder) => {
    if (koder.name == koderToDelete) {
      koderToDelete = koders.indexOf(koder);
      koders.splice(koderToDelete, 1);
    } else {
      response.status(400);
      response.json({
        message: "Koder Not Found!",
      });
      return;
    }
    updateKoders(koders);
    response.json({
      message: "Koder Removed",
    });
  });
});

server.delete("/koders", (request, response) => {
  updateKoders([]);
  response.json({
    message: "All Koders Removed",
  });
});

function createFile() {
  const fileExist = fs.existsSync(dbFile);

  if (!fileExist) {
    fs.writeFileSync(dbFile, JSON.stringify({ koders: [] }));
  }
}

function addkoder(koder) {
  const koders = getKoders();
  koders.push(koder);
  updateKoders(koders);
}

function updateKoders(koders) {
  const newKoders = { koders: koders };
  fs.writeFileSync(dbFile, JSON.stringify(newKoders));
}

function getKoders() {
  // leer el archivo
  const content = fs.readFileSync(dbFile, "utf8");
  return JSON.parse(content).koders;
}

server.listen("8080", () => {
  console.log("server running on port 8080");
});
