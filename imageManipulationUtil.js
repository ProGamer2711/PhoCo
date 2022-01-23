const Jimp = require("jimp");

module.exports = async (readPath, writePath, comments, callback) => {
	const originalImage = await Jimp.read(readPath);
	const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

	const addedWidth = 500;

	const commentsHeight = comments.reduce((commentsHeight, { comment }, i) => {
		comments[i].comment = `${i + 1}. ${comment}`;
		const textWidth = Jimp.measureText(font, comment);
		const textHeight = Jimp.measureTextHeight(font, comment);
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
	drawSelectionRects(comments, font, newImage);

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
			comments[index].comment,
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

	async function drawSelectionRects(comments, font, image) {
		comments.forEach(({ dimensions }) => {
			image.scan(
				dimensions.x,
				dimensions.y,
				dimensions.width,
				dimensions.height,
				(x, y, idx) => {
					const color = {
						r: image.bitmap.data[idx + 0],
						g: image.bitmap.data[idx + 1],
						b: image.bitmap.data[idx + 2],
						a: image.bitmap.data[idx + 3] / 255,
					};

					const selectionColor = {
						r: 187,
						g: 187,
						b: 187,
						a: 187,
					};

					const newColor = blendColors(color, selectionColor);

					const hexColor = Jimp.rgbaToInt(
						newColor.r,
						newColor.g,
						newColor.b,
						255
					);

					image.setPixelColor(hexColor, x, y);
				}
			);
		});
		comments.forEach(({ dimensions }, i) => {
			const text = `${i + 1}`;

			let textX =
				dimensions.x + (dimensions.width - Jimp.measureText(font, text)) / 2;
			let textY =
				dimensions.y +
				(dimensions.height - Jimp.measureTextHeight(font, text)) / 2;

			image.print(font, textX, textY, text);
		});
	}

	function blendColors(c1, c2) {
		const stepPoint = c2.a / 255;
		const r = c1.r + stepPoint * (c2.r - c1.r);
		const g = c1.g + stepPoint * (c2.g - c1.g);
		const b = c1.b + stepPoint * (c2.b - c1.b);
		return { r, g, b };
	}

	newImage.write(writePath);

	callback();
};
