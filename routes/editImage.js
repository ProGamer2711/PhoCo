const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const addComments = require("../imageManipulationUtil");

router.get("/", (req, res) => {
	res.render("pages/index", {
		title: "PhoCo",
		stylesheet: "css/style.css",
	});
});

router.post("/", (req, res) => {
	var form = new formidable.IncomingForm({
		uploadDir: path.join(__dirname, "..", "uploads", "images"),
	});
	form.parse(req, (err, fields, files) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}

		fs.renameSync(
			files.image.filepath,
			path.join(
				__dirname,
				"..",
				"uploads",
				"images",
				files.image.originalFilename
			)
		);

		addComments(
			path.join(
				__dirname,
				"..",
				"uploads",
				"images",
				files.image.originalFilename
			),
			fields.comments.split("\n")
		);

		return res.send("File uploaded successfully");
	});
});

module.exports = {
	path: "/edit",
	router,
};
