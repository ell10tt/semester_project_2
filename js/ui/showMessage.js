export function showMessage(message, type = "error", selector = "[data-message]") {
  const messageArea = document.querySelector(selector);

  if (!messageArea) {
    return;
  }

  const messageElement = document.createElement("p");
  messageElement.className = `message message--${type}`;
  messageElement.textContent = message;

  messageArea.replaceChildren(messageElement);
}

export function clearMessage(selector = "[data-message]") {
  const messageArea = document.querySelector(selector);

  if (messageArea) {
    messageArea.replaceChildren();
  }
}
