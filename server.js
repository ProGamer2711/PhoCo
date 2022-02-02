const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const routesPath = path.join(__dirname, "routes");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

fs.readdirSync(routesPath).forEach((file) => {
	const route = require(path.join(routesPath, file));
	app.use(route.path, route.router);
});

app.all("*", (_, res) => res.redirect("/"));

setInterval(() => {
	const downloadsPath = path.join(__dirname, "downloads");
	const uploadsPath = path.join(__dirname, "uploads");

	fs.readdirSync(downloadsPath).forEach((file) => {
		if (file === ".gitignore") return;
		fs.rmSync(path.join(downloadsPath, file));
	});

	fs.readdirSync(uploadsPath).forEach((file) => {
		if (file === ".gitignore") return;
		fs.rmSync(path.join(uploadsPath, file));
	});
}, 1000 * 60 * 30);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
