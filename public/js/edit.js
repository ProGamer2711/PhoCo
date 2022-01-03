const commentInput = document.querySelector("#comment-input");
const commentsList = document.querySelector("#comments-list");
const commentsExport = document.querySelector('input[name="comments"]');
const imageExport = document.querySelector('input[name="image"]');
const form = document.querySelector("#edit-form");
const imageEl = document.querySelector("#uploaded-image");
const feedback = document.querySelector("#feedback");

const comments = [];

function addComment() {
	const comment = commentInput.value;
	if (comment === "") return (feedback.innerHTML = "Comment cannot be empty.");
	if (comments.length >= 200)
		return (feedback.innerHTML = "You cannot have more than 200 comments.");

	comments.push(comment);
	commentInput.value = "";
	renderComments();
}

function removeComment(index) {
	comments.splice(index, 1);
	renderComments();
}

function renderComments() {
	commentsList.innerHTML = "";
	comments.forEach((comment, i) => {
		const commentElement = document.createElement("li");
		commentElement.innerHTML = `${comment} <button onclick="removeComment(${i})">Remove comment</button>`;
		commentsList.appendChild(commentElement);
	});

	exportComments();
}

function exportComments() {
	commentsExport.value = JSON.stringify(comments);
}

imageEl.addEventListener("mousedown", (event) => {
	const startCoords = { x: event.offsetX, y: event.offsetY };
	imageEl.addEventListener("mouseup", (event2) => {
		const endCoords = { x: event2.offsetX, y: event2.offsetY };
		console.log(startCoords, endCoords);
	});
});

form.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
		addComment();
	}
});
