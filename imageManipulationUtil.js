const Jimp = require("jimp");
const fs = require("fs");

module.exports = async (readPath, writePath, comments, callback) => {
	const originalImage = await Jimp.read(readPath);
	const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

	const addedWidth = 500;
	const commentsHeight = comments.reduce((commentsHeight, _, i) => {
		comments[i] = `${i + 1}. ${comments[i]}`;
		const textWidth = Jimp.measureText(font, comments[i]);
		const textHeight = Jimp.measureTextHeight(font, comments[i]);
		const lines = Math.ceil(textWidth / addedWidth);
		const height = textHeight * lines;
		return commentsHeight + height;
	}, 0);
	const imageHeight = commentsHeight + 10;

	if (imageHeight > originalImage.getHeight())
		originalImage.resize(Jimp.AUTO, imageHeight);

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
		image.print(
			font,
			startWidth,
			startHeight,
			comments[index],
			addedWidth - 10,
			(err, image, { y }) => {
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

	newImage.write(writePath);
	fs.rmSync(readPath);

	callback();
};
