const fs = require("fs");
const Jimp = require("jimp");

module.exports = async (path, comments) => {
	const originalImage = await Jimp.read(path);

	const maxElement = comments.reduce(
		(maxEl, currentEl) =>
			(maxEl = maxEl.length < currentEl.length ? currentEl : maxEl)
	);

	const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

	const textWidth = Jimp.measureText(font, maxElement);

	const addedWidth = textWidth > 500 ? textWidth / 2 : textWidth;

	const newImage = new Jimp(
		originalImage.getWidth() + addedWidth,
		originalImage.getHeight(),
		0xffffffff
	);

	newImage.blit(originalImage, 0, 0);

	loadComments(
		0,
		comments,
		originalImage.getWidth() + 10,
		10,
		newImage,
		font,
		addedWidth
	);

	function loadComments(
		index,
		comments,
		startWidth,
		startHeight,
		image,
		font,
		addedWidth
	) {
		let text = `${index + 1}. ${comments[index]}`;

		image.print(
			font,
			startWidth,
			startHeight,
			text,
			addedWidth,
			(err, image, { x, y }) => {
				if (err) console.log(err);
				comments[index + 1]
					? loadComments(
							index + 1,
							comments,
							startWidth,
							y,
							image,
							font,
							addedWidth
					  )
					: null;
			}
		);
	}

	newImage.write(path.split(".")[0] + "_comments.png");
	fs.rmSync(path);
};
