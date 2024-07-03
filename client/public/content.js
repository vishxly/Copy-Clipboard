let button = null;

function createButton() {
  button = document.createElement('button');
  button.textContent = '+';
  button.style.cssText = `
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #3b82f6;
    color: white;
    font-size: 16px;
    border: none;
    cursor: pointer;
    display: none;
    z-index: 10000;
    text-align: center;
    line-height: 20px;
  `;
  document.body.appendChild(button);

  button.addEventListener('click', saveSelection);
}

function showButton(x, y) {
  if (button) {
    button.style.display = 'block';
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
  }
}

function hideButton() {
  if (button) button.style.display = 'none';
}

function saveSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (selectedText) {
    let url = window.location.href;
    let text = selectedText;

    // Check if the selection is within an anchor tag
    const anchorNode = selection.anchorNode.parentElement.closest('a');
    if (anchorNode) {
      url = anchorNode.href;
      text = anchorNode.textContent.trim();
    }

    chrome.runtime.sendMessage({
      action: 'saveLink',
      text: text,
      url: url
    }, (response) => {
      if (response.success) {
        alert('Link saved successfully!');
      } else {
        alert('Failed to save link. Please make sure you are logged in.');
      }
    });
  }
  hideButton();
}

document.addEventListener('mouseup', (e) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (selectedText) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    showButton(e.pageX, rect.top + window.pageYOffset - 30);
  } else {
    hideButton();
  }
});

createButton();