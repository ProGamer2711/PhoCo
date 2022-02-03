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

	addComments(
		path.join(__dirname, "..", "downloads", req.body.image),
		path.join(__dirname, "..", "uploads", req.body.image),
		comments,
		() => {
			fs.rmSync(path.join(__dirname, "..", "downloads", req.body.image));

			res.render("pages/download", {
				title: "PhoCo",
				stylesheet: "css/style.css",
				name: req.body.image,
			});
		}
	);
});

module.exports = {
	path: "/process",
	router,
};
