chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    title: 'translate',
    id: 'contextMenu1',
    contexts: ['selection'],
  });

  chrome.contextMenus.onClicked.addListener((event) => {
    if (event.menuItemId === 'contextMenu1') {
      console.log(event.selectionText);
      chrome.tabs.create({
        url: `https://translate.google.com/?hl=en&sl=auto&tl=en&text=${event.selectionText}&op=translate`,
      });
    }
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const getResponse = async () => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${message}`
      );
      
      if (!res.ok) {
        // Handle API errors (like word not found)
        const errorData = {
          error: true,
          message: `No definition found for "${message}"`
        };
        chrome.storage.local.set({ definitions: errorData });
        return;
      }

      const data = await res.json();
      console.log(data);
      chrome.storage.local.set({ definitions: data });
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error fetching definition:', error);
      const errorData = {
        error: true,
        message: 'Failed to fetch definition. Please try again.'
      };
      chrome.storage.local.set({ definitions: errorData });
    }
  };

  getResponse();

  sendResponse(`the message is ${message}`);
  chrome.tabs.sendMessage(
    sender.tab.id,
    'got your message from background!!!!!!!'
  );
});

console.log('bg script');
