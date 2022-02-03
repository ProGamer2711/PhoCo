const router = require("express").Router();
const fs = require("fs");
const path = require("path");

router.get("/:image", (req, res) => {
	const image = req.params.image;
	const imagePath = path.join(__dirname, "..", "uploads", image);

	if (!fs.existsSync(imagePath)) return res.status(410).send("Image not found");

	res.status(200).sendFile(imagePath);
});

module.exports = {
	path: "/uploads",
	router,
};
