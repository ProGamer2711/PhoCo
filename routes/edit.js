const router = require("express").Router();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");

const supportedFormats = ["jpg", "jpeg", "png", "jfif"];

router.post("/", (req, res) => {
	const form = new formidable.IncomingForm({
		uploadDir: path.join(__dirname, "..", "downloads"),
	});

	form.parse(req, async (err, _, files) => {
		const image = files.image.originalFilename;

		const validExtension = supportedFormats.some(
			(extension) =>
				image
					.substr(image.length - extension.length, extension.length)
					.toLowerCase() == extension.toLowerCase()
		);

		if (!validExtension) {
			fs.rmSync(files.image.filepath);

			return res.render("pages/index", {
				title: "PhoCo",
				stylesheet: "css/style.css",
				errors: ["Please upload a valid image file"],
			});
		}

		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}

		fs.renameSync(
			files.image.filepath,
			path.join(__dirname, "..", "downloads", image)
		);

		res.render("pages/edit", {
			title: "PhoCo",
			stylesheet: "css/style.css",
			image,
		});
	});
});

module.exports = {
	path: "/edit",
	router,
};
