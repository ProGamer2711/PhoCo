const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
const jimp = require("jimp");

router.get("/", (req, res) => {
	res.render("pages/index", {
		title: "PhoCo",
		stylesheet: "css/style.css",
	});
});

router.post("/", (req, res) => {
	var form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}

		fs.renameSync(
			files.image.filepath,
			`${files.image.filepath}.${files.image.originalFilename.split(".")[1]}`
		);

		fs.renameSync(
			`${files.image.filepath}.${files.image.originalFilename.split(".")[1]}`,
			path.join(
				__dirname,
				"..",
				"assets",
				"images",
				files.image.originalFilename
			)
		);

		jimp.read(
			path.join(
				__dirname,
				"..",
				"assets",
				"images",
				files.image.originalFilename
			),
			(err, image) => {
				if (err) throw err;
				image.write(
					path.join(
						__dirname,
						"..",
						"assets",
						"images",
						`${files.image.originalFilename.split(".")[0]}.png`
					)
				);
			}
		);

		fs.rmSync(
			path.join(
				__dirname,
				"..",
				"assets",
				"images",
				files.image.originalFilename
			)
		);

		return res.send("File uploaded successfully");
	});
});

module.exports = router;
