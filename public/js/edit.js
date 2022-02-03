if (history.state !== null && history.state < history.length)
	location.href = "/";
else history.replaceState(history.length, "", window.location.href);

const commentInput = document.querySelector("#comment-input");
const commentsList = document.querySelector("#comments-list");
const commentsExport = document.querySelector("input[name='comments']");
const imageExport = document.querySelector("input[name='image']");
const form = document.querySelector("#edit-form");
const editCanvas = document.querySelector("#edit-canvas");
const feedback = document.querySelector("#feedback");

let startCoords,
	canvasPosition,
	dimensions,
	painting = false;

const ctx = editCanvas.getContext("2d");

const backgroundImage = new Image();

let comments = [];

const strokeStyle = {
	strokeWidth: 3,
	lineDash: [20, 5],
	strokeColor: "#1A53FFBB",
};

function addComment() {
	const comment = commentInput.value;

	commentInput.value = "";

	commentInput.focus();

	if (comment === "") return (feedback.innerHTML = "Comment cannot be empty.");
	if (comments.length >= 100)
		return (feedback.innerHTML = "You cannot have more than 100 comments.");
	if (!dimensions)
		return (feedback.innerHTML = "You have to select part of the image first.");

	if (dimensions.width < 0) {
		dimensions.x += dimensions.width;
		dimensions.width = Math.abs(dimensions.width);
	}
	if (dimensions.height < 0) {
		dimensions.y += dimensions.height;
		dimensions.height = Math.abs(dimensions.height);
	}

	dimensions.x = parseInt(dimensions.x);
	dimensions.y = parseInt(dimensions.y);
	dimensions.width = parseInt(dimensions.width);
	dimensions.height = parseInt(dimensions.height);

	comments.push({ comment, dimensions });
	dimensions = null;

	renderComments();
	renderSelections();
}

function removeComment(index) {
	delete comments[index];
	renderComments();
	renderSelections();
}

function renderComments() {
	commentsList.innerHTML = "";
	comments.forEach(({ comment }, i) => {
		const commentElement = document.createElement("li");
		commentElement.innerHTML = `${comment} <button onclick="removeComment(${i})">Remove comment</button>`;
		commentsList.appendChild(commentElement);
	});

	exportComments();
}

function renderSelections() {
	editCanvas.width = backgroundImage.width;
	editCanvas.height = backgroundImage.height;
	ctx.drawImage(backgroundImage, 0, 0);

	comments.forEach(({ dimensions }, i) =>
		drawSelectionRect((i + 1).toString(), dimensions, strokeStyle, "#BBBB")
	);
}

function exportComments() {
	commentsExport.value = JSON.stringify(comments);
}

editCanvas.addEventListener("mousedown", (event) => {
	painting = true;
	canvasPosition = editCanvas.getBoundingClientRect();

	startCoords = {
		x: event.clientX - canvasPosition.left,
		y: event.clientY - canvasPosition.top,
	};
});

editCanvas.addEventListener("mousemove", (event) => {
	if (painting) {
		canvasPosition = editCanvas.getBoundingClientRect();
		let endCoords = {
			x: event.clientX - canvasPosition.left,
			y: event.clientY - canvasPosition.top,
		};

		renderSelections();

		dimensions = {
			x: startCoords.x,
			y: startCoords.y,
			width: endCoords.x - startCoords.x,
			height: endCoords.y - startCoords.y,
		};

		drawSelectionRect("#", dimensions, strokeStyle, "#BBBB");
	}
});

function drawSelectionRect(
	text,
	{ x, y, width, height },
	{ strokeWidth, lineDash, strokeColor },
	fillColor
) {
	ctx.lineWidth = strokeWidth;
	ctx.setLineDash(lineDash);
	ctx.strokeStyle = strokeColor;

	ctx.strokeRect(x, y, width, height);

	ctx.fillStyle = fillColor;

	ctx.fillRect(x, y, width, height);

	ctx.fillStyle = "#000";
	ctx.font = "16px sans-serif";
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";

	ctx.fillText(text, x + width / 2, y + height / 2, width);
}

editCanvas.addEventListener("mouseup", () => (painting = false));

document.body.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
		addComment();
	}
});

backgroundImage.onload = () => {
	editCanvas.width = backgroundImage.width;
	editCanvas.height = backgroundImage.height;

	ctx.drawImage(backgroundImage, 0, 0);
};
