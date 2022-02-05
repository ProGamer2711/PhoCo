const router = require("express").Router();
const path = require("path");
const fs = require("fs");

const addComments = require("../imageManipulationUtil");

router.post("/", (req, res) => {
	if (req.body.comments == "")
		return res.render("pages/edit", {
			title: "PhoCo",
			stylesheet: "css/style.css",
			image: req.body.image,
			errors: ["Please enter at least one comment"],
		});

	const comments = JSON.parse(req.body.comments);

	const downloadPath = path.join(__dirname, "..", "downloads", req.body.image);
	const uploadPath = path.join(__dirname, "..", "uploads", req.body.image);

	if (!fs.existsSync(downloadPath))
		return res.render("pages/index", {
			title: "PhoCo",
			stylesheet: "css/style.css",
			errors: ["Image was not found; Please try again"],
		});

	addComments(downloadPath, uploadPath, comments, () => {
		fs.rmSync(downloadPath);

		if (!fs.existsSync(uploadPath))
			return res.render("pages/index", {
				title: "PhoCo",
				stylesheet: "css/style.css",
				errors: ["Image was not found; Please try again"],
			});

		res.render("pages/download", {
			title: "PhoCo",
			stylesheet: "css/style.css",
			name: req.body.image,
		});
	});
});

module.exports = {
	path: "/process",
	router,
};
