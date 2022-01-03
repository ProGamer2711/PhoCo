const router = require("express").Router();

router.get("/", (req, res) => {
	res.render("pages/index", {
		title: "PhoCo",
		stylesheet: "css/style.css",
	});
});

router.all("*", (_, res) => {
	res.redirect("/");
});

module.exports = router;
