const router = require("express").Router();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

router.post("/", (req, res) => {
	var form = new formidable.IncomingForm({
		uploadDir: path.join(__dirname, "..", "downloads"),
	});

	form.parse(req, async (err, fields, files) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}

		fs.renameSync(
			files.image.filepath,
			path.join(__dirname, "..", "downloads", files.image.originalFilename)
		);

		res.render("pages/edit", {
			title: "PhoCo",
			stylesheet: "css/style.css",
			image: files.image.originalFilename,
		});
	});
});

module.exports = {
	path: "/edit",
	router,
};
