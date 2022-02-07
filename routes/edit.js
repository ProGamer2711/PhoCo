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
		if (err) {
			console.log(err);
			return res.status(500).send(err);
		}

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
				stylesheet: "css/index.css",
				errors: ["Please upload a valid image file"],
			});
		}

		fs.renameSync(
			files.image.filepath,
			path.join(__dirname, "..", "downloads", image)
		);

		setTimeout(
			() => fs.rmSync(path.join(__dirname, "..", "downloads", image)),
			1000 * 60 * 60
		);

		res.render("pages/edit", {
			title: "PhoCo",
			stylesheet: "css/edit.css",
			image,
		});
	});
});

router.get("*", (_, res) => res.status(403).redirect("/"));

module.exports = {
	path: "/edit",
	router,
};
