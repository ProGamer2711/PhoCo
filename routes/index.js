const router = require("express").Router();

router.get("/", (req, res) => {
	res.render("pages/index", {
		title: "PhoCo",
		stylesheet: "css/style.css",
	});
});

router.get("*", (_, res) => {
	res.redirect("/");
});

module.exports = {
	path: "/",
	router,
};
