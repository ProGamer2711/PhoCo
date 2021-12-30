const router = require("express").Router();
const path = require("path");

router.get("/:image", (req, res) => {
	const image = req.params.image;
	const imagePath = path.join(__dirname, "..", "uploads", image);

	res.sendFile(imagePath);
});

module.exports = {
	path: "/uploads",
	router,
};
