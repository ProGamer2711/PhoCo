const commentInput = document.querySelector("#comment-input");
const commentsList = document.querySelector("#comments-list");
const commentsExport = document.querySelector('input[name="comments"]');

const comments = [];

function addComment() {
	const comment = commentInput.value;
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
