const express = require("express");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");

const app = express();

const routesPath = path.join(__dirname, "routes");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/", require(path.join(routesPath, "index")));

fs.readdirSync(routesPath)
	.filter((file) => file !== "index.js")
	.forEach((file) => {
		const route = require(path.join(routesPath, file));
		app.use(route.path, route.router);
	});

app.listen("5000", () => console.log("Server started on port 5000"));
