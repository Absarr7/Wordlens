chrome.storage.local.get('definitions', (data) => {
  showDefinition(data);
});

const defList = document.getElementById('definitionList');
const defP = document.getElementById('def');
const wordName = document.getElementById('word');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const showDefinition = (data) => {
  try {
    wordName.innerText = data.definitions[0].word;
    wordName.style.fontSize = '25px';
    const definitions = data.definitions[0].meanings[0].definitions;

    for (let i = 0; i < definitions.length; i++) {
      const def = document.createElement('li');
      def.innerText = definitions[i].definition;
      defList.appendChild(def);
    }
  } catch (error) {
    console.log(error);
    wordName.innerText = 'Please select or enter a word.'
    wordName.style.fontSize = '15px';
    
  }
  

  
};

const handleSearch = async () => {
  const word = searchInput.value.trim();
  if (!word) return;

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await response.json();
    
    // Clear previous definitions
    defList.innerHTML = '';
    
    // Update the UI with new data
    chrome.storage.local.set({ definitions: data }, () => {
      showDefinition({ definitions: data });
    });
  } catch (error) {
    console.log(error);
    wordName.innerText = 'Word not found';
    wordName.style.fontSize = '10px';
    defList.innerHTML = '';
  }
};

// Add event listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
