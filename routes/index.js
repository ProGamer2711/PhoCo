const router = require("express").Router();

router.get("/", (req, res) => {
	res.render("pages/index", {
		title: "PhoCo",
		stylesheet: "css/index.css",
	});
});

module.exports = {
	path: "/",
	router,
};
