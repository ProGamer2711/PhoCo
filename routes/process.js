const router = require("express").Router();
const path = require("path");
const addComments = require("../imageManipulationUtil");

router.post("/", (req, res) => {
	const comments = JSON.parse(req.body.comments);

	addComments(
		path.join(__dirname, "..", "downloads", req.body.image),
		path.join(__dirname, "..", "uploads", req.body.image),
		comments,
		() => {
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
