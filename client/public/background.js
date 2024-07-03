chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'saveLink') {
      chrome.storage.local.get(['token'], (result) => {
        if (result.token) {
          fetch('http://localhost:3000/api/links', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${result.token}`,
            },
            body: JSON.stringify({
              text: request.text,
              url: request.url,
            }),
          })
          .then(response => {
            if (!response.ok) throw new Error('Failed to save link');
            return response.json();
          })
          .then(data => {
            console.log('Link saved successfully');
            sendResponse({ success: true });
          })
          .catch(error => {
            console.error('Error saving link:', error);
            sendResponse({ success: false });
          });
        } else {
          console.error('User not logged in');
          sendResponse({ success: false });
        }
      });
      return true; // Indicates that the response is sent asynchronously
    }
  });