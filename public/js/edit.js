const commentInput = document.querySelector("#comment-input");
const commentsList = document.querySelector("#comments-list");
const commentsExport = document.querySelector('input[name="comments"]');
const imageExport = document.querySelector('input[name="image"]');
const form = document.querySelector("#edit-form");
const editCanvas = document.querySelector("#edit-canvas");
const feedback = document.querySelector("#feedback");

let startCoords,
	canvasPosition,
	dimensions,
	painting = false;

const ctx = editCanvas.getContext("2d");

const backgroundImage = new Image();

let comments = {};

const strokeStyle = {
	strokeWidth: 3,
	lineDash: [20, 5],
	strokeColor: "#1A53FFBB",
};

function addComment() {
	const comment = commentInput.value;
	if (comment === "") return (feedback.innerHTML = "Comment cannot be empty.");
	if (comments.length >= 200)
		return (feedback.innerHTML = "You cannot have more than 200 comments.");
	if (!dimensions)
		return (feedback.innerHTML = "You have to select part of the image first.");

	comments[comment] = dimensions;
	commentInput.value = "";
	dimensions = null;
	renderComments();
	renderSelections();
}

function removeComment(index) {
	delete comments[Object.keys(comments)[index]];
	renderComments();
	renderSelections();
}

function renderComments() {
	commentsList.innerHTML = "";
	Object.keys(comments).forEach((comment, i) => {
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

	Object.values(comments).forEach((dimensions) =>
		drawSelectionRect(dimensions, strokeStyle, "#BBBB")
	);
}

function exportComments() {
	commentsExport.value = JSON.stringify(Object.keys(comments));
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

		drawSelectionRect(dimensions, strokeStyle, "#BBBB");
	}
});

function drawSelectionRect(
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
}

editCanvas.addEventListener("mouseup", () => {
	painting = false;
});

form.addEventListener("keydown", (event) => {
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
