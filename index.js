const express = require("express");

const fs = require("fs");

const fileDB = "archivo.json";

const createDbFile = (file) => {
    fs.writeFileSync(file, "[]", "utf-8");
};

if(!fs.existsSync(fileDB)) {
    createDbFile(fileDB);
}

const server = express();

server.use(express.json());

const content = fs.readFileSync(fileDB, "utf-8");
const contentJson = JSON.parse(content);

server.get("/koders", (request, response) => {
    response.json(contentJson);
});

server.post("/koders", (request, response) => {
    contentJson.push(request.body);
    fs.writeFileSync(fileDB, JSON.stringify(contentJson), "utf-8");

    response.json({
        message: "koder created",
        contentJson
    });
});

server.delete("/koders/:name", (request, response) => {
    let koderExist = contentJson.find((koder) => koder.name === request.params.name);
    if(!koderExist) {
        response.status(404);
        response.json({message: "koder not found"});
        return;
    }
    let newKoders = contentJson.filter((koder) => koder.name !== request.params.name);
    fs.writeFileSync(fileDB, JSON.stringify(newKoders), "utf-8");
    response.json({message: "koder delete",contentJson});
});

server.delete("/koders", (request, response) => {
    createDbFile(fileDB);
    response.json({message: "all koders were eliminated"});
})

server.listen(8080, () => {
    console.log("server listening on port 8080");
});