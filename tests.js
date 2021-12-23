const jimp = require("jimp");

jimp.read("test.jpeg", (err, image) => {
	if (err) throw err;
	image.write("new-test.png");
});
