const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const addComments = require("../imageManipulationUtil");

router.get("/", (req, res) => {
	res.redirect("/");
});

router.post("/", (req, res) => {
	var form = new formidable.IncomingForm({
		uploadDir: path.join(__dirname, "..", "downloads"),
	});
	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}

		const downloadsPath = path.join(
			__dirname,
			"..",
			"downloads",
			files.image.originalFilename
		);

		const uploadsPath = path.join(
			__dirname,
			"..",
			"uploads",
			files.image.originalFilename
		);

		fs.renameSync(files.image.filepath, downloadsPath);

		addComments(downloadsPath, uploadsPath, JSON.parse(fields.comments), () => {
			res.render("pages/download", {
				title: "PhoCo",
				stylesheet: "css/style.css",
				name: files.image.originalFilename,
			});
		});
	});
});

module.exports = {
	path: "/edit",
	router,
};
