const router = require("express").Router();

router.get("/", (req, res) => {
	res.render("pages/index", {
		title: "PhoCo",
		stylesheet: "css/style.css",
	});
});

module.exports = router;
