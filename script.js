// ==========================================
// W3.5 Activity 01: The Cat API Explorer
// STUDENT TEMPLATE - 65% Pre-Built Foundation
// ==========================================
//
// Learning Objectives:
// - Make your first API fetch request
// - Parse JSON response data
// - Display dynamic content from an API
// - Handle loading states and errors
//
// Your Tasks: Complete 5 TODOs to master basic API integration
// ==========================================

// API Base URL (Pre-configured for you)
const CAT_API_BASE = 'https://api.thecatapi.com/v1';

// ==========================================
// DOM ELEMENTS (✅ Pre-built)
// ==========================================
const randomCatBtn = document.getElementById('randomCatBtn');
const breedListBtn = document.getElementById('breedListBtn');
const randomBreedBtn = document.getElementById('randomBreedBtn');
const showJsonBtn = document.getElementById('showJsonBtn');
const searchBreedBtn = document.getElementById('searchBreedBtn');
const breedInput = document.getElementById('breedInput');
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById('loading');
const fallbackDiv = document.getElementById('fallback');

// Fallback data for offline testing
const fallbackData = {
    breeds: ['siamese', 'persian', 'maine coon', 'british shorthair', 'abyssinian', 'ragdoll'],
    sampleImage: 'https://via.placeholder.com/400x300/667eea/white?text=Sample+Cat+Image',
    message: 'This is fallback data for when the API is unavailable'
};

// ==========================================
// EVENT LISTENERS (✅ Pre-built)
// ==========================================
randomCatBtn.addEventListener('click', getRandomCat);
breedListBtn.addEventListener('click', getAllBreeds);
randomBreedBtn.addEventListener('click', getRandomBreed);
showJsonBtn.addEventListener('click', showRawJson);
searchBreedBtn.addEventListener('click', searchBreed);
breedInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchBreed();
    }
});

// ==========================================
// UTILITY FUNCTIONS (✅ Pre-built)
// ==========================================
function showLoading() {
    resultDiv.classList.add('hidden');
    fallbackDiv.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
    resultDiv.classList.remove('hidden');
}

function showError(message) {
    hideLoading();
    resultDiv.textContent = '';

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';

    const title = document.createElement('h3');
    title.textContent = '❌ Oops! Something went wrong';

    const messageP = document.createElement('p');
    messageP.textContent = message;

    const helpP = document.createElement('p');
    helpP.textContent = "Don't worry - this is part of learning API integration!";

    errorDiv.appendChild(title);
    errorDiv.appendChild(messageP);
    errorDiv.appendChild(helpP);
    resultDiv.appendChild(errorDiv);
}

function showFallback() {
    loadingDiv.classList.add('hidden');
    resultDiv.classList.add('hidden');
    fallbackDiv.classList.remove('hidden');
}

// ==========================================
// API FUNCTIONS (⚠️ STUDENT TODOs)
// ==========================================

// ============================================================
// TODO 1: Fetch a Random Cat Image (Easy - 20 min)
// ============================================================
// SUCCESS CRITERIA:
// ✓ Make a fetch request to the Cat API random image endpoint
// ✓ Convert the response to JSON using response.json()
// ✓ Check if data exists and has at least one item (data.length > 0)
// ✓ Extract the image URL from data[0].url
// ✓ Call displayCatImage() to show the cat
// ✓ Handle errors with try-catch and showError()
//
// API ENDPOINT: `${CAT_API_BASE}/images/search`
//
// RESPONSE FORMAT:
// The API returns an ARRAY with one object:
// [{
//   "id": "abc123",
//   "url": "https://cdn2.thecatapi.com/images/abc123.jpg",
//   "breeds": []
// }]
//
// HINT: Use await fetch(url), then await response.json()
// ============================================================
async function getRandomCat() {
    showLoading();

    try {
        // STUDENT TODO 1A: Make the fetch request
        const response = await fetch(`${CAT_API_BASE}/images/search`);

        // STUDENT TODO 1B: Convert response to JSON
        const data = await response.json();

        // STUDENT TODO 1C: Check if we got valid data
        if (data && data.length > 0) {
            // STUDENT TODO 1D: Get the first cat from the array
            const catData = data[0];

            // STUDENT TODO 1E: Display the cat image
            displayCatImage(catData.url, 'Random Cat');

            // STUDENT TODO 1F: Add console.log to debug
            console.log('API Response:', data);
        } else {
            showError('No cat images found.');
        }

    } catch (error) {
        console.error('Error fetching random cat:', error);
        showError('Could not fetch random cat. Check your internet connection.');
    }
}

// ============================================================
// TODO 2: Fetch All Cat Breeds (Easy - 25 min)
// ============================================================
// SUCCESS CRITERIA:
// ✓ Fetch the list of all cat breeds from the API
// ✓ Parse the JSON response
// ✓ Call displayBreedList() with the data
// ✓ Log the breed count to console
// ✓ Handle errors gracefully with fallback data
//
// API ENDPOINT: `${CAT_API_BASE}/breeds`
//
// RESPONSE FORMAT:
// Returns an ARRAY of breed objects:
// [{
//   "id": "abys",
//   "name": "Abyssinian",
//   "origin": "Egypt",
//   "temperament": "Active, Energetic, Independent"
// }, ...]
//
// HINT: On error, use fallbackData.breeds as backup
// ============================================================
async function getAllBreeds() {
    showLoading();

    try {
        // STUDENT TODO 2A: Fetch all breeds from the API
        const response = await fetch(`${CAT_API_BASE}/breeds`);

        // STUDENT TODO 2B: Parse JSON response
        const data = await response.json();

        // STUDENT TODO 2C: Check if data is valid
        if (data && data.length > 0) {
            // STUDENT TODO 2D: Display the breed list
            displayBreedList(data);

            // STUDENT TODO 2E: Log helpful debug info
            console.log('Breed count:', data.length);
            console.log('Sample breed:', data[0]);
        } else {
            throw new Error('No breed data found');
        }

    } catch (error) {
        console.error('Error fetching breeds:', error);
        // STUDENT TODO 2F: Use fallback data on error
        showError('Could not fetch breed list. Using fallback data instead.');
        displayBreedList(fallbackData.breeds.map(name => ({ name })));
    }
}

// ============================================================
// TODO 3: Search for a Specific Breed (Medium - 35 min)
// ============================================================
// SUCCESS CRITERIA:
// ✓ Get the search term from breedInput.value
// ✓ Validate input is not empty
// ✓ Fetch all breeds and find a match using .find()
// ✓ Fetch an image of the matching breed
// ✓ Display the result with displayCatImage()
// ✓ Save successful searches to localStorage
// ✓ Clear input field after successful search
//
// API ENDPOINTS:
// 1. Get all breeds: `${CAT_API_BASE}/breeds`
// 2. Get breed image: `${CAT_API_BASE}/images/search?breed_ids=${breedId}`
//
// LOCALSTORAGE KEY: 'breedSearchHistory'
//
// HINT: Use array.find() to search for matching breed name
// HINT: Use JSON.parse/JSON.stringify for localStorage
// ============================================================
async function searchBreed() {
    const breedName = breedInput.value.trim().toLowerCase();

    // STUDENT TODO 3A: Validate input
    if (!breedName) {
        showError('Please enter a breed name to search for!');
        return;
    }

    showLoading();

    try {
        // STUDENT TODO 3B: Fetch all breeds first
        const breedsResponse = await fetch(`${CAT_API_BASE}/breeds`);
        const breedsData = await breedsResponse.json();

        // STUDENT TODO 3C: Find matching breed using .find()
        const matchedBreed = breedsData.find(breed =>
            breed.name.toLowerCase().includes(breedName)
        );

        // STUDENT TODO 3D: Handle no match found
        if (!matchedBreed) {
            const suggestions = breedsData.slice(0, 5).map(b => b.name).join(', ');
            showError(`Breed "${breedName}" not found. Try: ${suggestions}`);
            return;
        }

        // STUDENT TODO 3E: Fetch image for the matched breed
        const imageResponse = await fetch(`${CAT_API_BASE}/images/search?breed_ids=${matchedBreed.id}`);
        const imageData = await imageResponse.json();

        // STUDENT TODO 3F: Display the result
        if (imageData && imageData.length > 0) {
            displayCatImage(imageData[0].url, matchedBreed.name, matchedBreed);
        } else {
            showError(`We found the breed "${matchedBreed.name}", but it doesn't have an image right now.`);
            return;
        }

        // STUDENT TODO 3G: Save to search history in localStorage
        let searchHistory = JSON.parse(localStorage.getItem('breedSearchHistory') || '[]');
        if (!searchHistory.includes(matchedBreed.name)) {
            searchHistory.unshift(matchedBreed.name);
            searchHistory = searchHistory.slice(0, 10); // Keep last 10
            localStorage.setItem('breedSearchHistory', JSON.stringify(searchHistory));
        }

        // STUDENT TODO 3H: Clear input field
        breedInput.value = '';

    } catch (error) {
        console.error('Error searching breed:', error);
        showError(`Could not find breed "${breedName}". Try: Siamese, Persian, Maine Coon`);
    }
}

// ============================================================
// TODO 4: Get a Random Breed with Image (Medium - 30 min)
// ============================================================
// SUCCESS CRITERIA:
// ✓ Fetch all breeds first
// ✓ Pick a random breed using Math.random()
// ✓ Fetch an image of that specific breed
// ✓ Display the result with breed details
// ✓ Chain the two API calls properly
//
// API ENDPOINTS:
// 1. Get all breeds: `${CAT_API_BASE}/breeds`
// 2. Get breed image: `${CAT_API_BASE}/images/search?breed_ids=${breed.id}`
//
// HINT: Use Math.floor(Math.random() * array.length) for random index
// ============================================================
async function getRandomBreed() {
    showLoading();

    try {
        // STUDENT TODO 4A: Fetch all breeds
        const breedsResponse = await fetch(`${CAT_API_BASE}/breeds`);
        const breedsData = await breedsResponse.json();

        // STUDENT TODO 4B: Validate breeds data
        if (!breedsData || breedsData.length === 0) {
            throw new Error('Failed to fetch breeds');
        }

        // STUDENT TODO 4C: Pick a random breed
        const randomIndex = Math.floor(Math.random() * breedsData.length);
        const randomBreed = breedsData[randomIndex];

        // STUDENT TODO 4D: Fetch image for that breed
        const imageResponse = await fetch(`${CAT_API_BASE}/images/search?breed_ids=${randomBreed.id}`);
        const imageData = await imageResponse.json();

        // STUDENT TODO 4E: Display the result
        if (imageData && imageData.length > 0) {
            displayCatImage(imageData[0].url, randomBreed.name, randomBreed);
            console.log('Random breed selected:', randomBreed.name);
        } else {
            showError(`Selected "${randomBreed.name}", but no image was found.`);
        }

    } catch (error) {
        console.error('Error fetching random breed:', error);
        showError('Could not fetch random breed. Try again!');
    }
}

// ============================================================
// TODO 5: Show Raw JSON Response (Easy - 15 min)
// ============================================================
// SUCCESS CRITERIA:
// ✓ Fetch a random cat image from the API
// ✓ Display the raw JSON data using displayJsonData()
// ✓ Log the response to console for debugging
//
// PURPOSE: Understanding what APIs actually return
// This helps you see the raw data structure before parsing
// ============================================================
async function showRawJson() {
    showLoading();

    try {
        // STUDENT TODO 5A: Fetch random cat data
        const response = await fetch(`${CAT_API_BASE}/images/search`);

        // STUDENT TODO 5B: Parse JSON response
        const data = await response.json();

        // STUDENT TODO 5C: Display raw JSON
        displayJsonData(data);

        // STUDENT TODO 5D: Log to console
        console.log('Raw API Response:', data);

    } catch (error) {
        console.error('Error fetching JSON:', error);
        showError('Could not fetch JSON data.');
    }
}

// ==========================================
// DISPLAY FUNCTIONS (✅ Pre-built - Use These!)
// ==========================================

/**
 * Display a cat image with optional breed info
 * @param {string} imageUrl - URL of the cat image
 * @param {string} breedName - Name to display (default: 'Random Cat')
 * @param {object} breedInfo - Optional breed details object
 * @param {boolean} showBackButton - Whether to show a 'Back to Breeds' button
 */
function displayCatImage(imageUrl, breedName = 'Random Cat', breedInfo = null, showBackButton = false) {
    hideLoading();
    resultDiv.textContent = '';

    const card = document.createElement('div');
    card.className = 'dog-card';

    // Add "Back to Breeds" button at the top if requested
    if (showBackButton) {
        const backBtnContainer = document.createElement('div');
        backBtnContainer.style.textAlign = 'left';
        backBtnContainer.style.marginBottom = '1rem';

        const backBtn = document.createElement('button');
        backBtn.className = 'api-button tertiary';
        backBtn.innerHTML = '← Back to Breeds';
        backBtn.style.width = 'auto';
        backBtn.style.padding = '0.5rem 1rem';
        backBtn.style.fontSize = '0.85rem';
        backBtn.onclick = getAllBreeds;

        backBtnContainer.appendChild(backBtn);
        card.appendChild(backBtnContainer);
    }

    const title = document.createElement('h3');
    title.textContent = `🐱 ${breedName}`;
    card.appendChild(title);

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = breedName;
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
    img.onload = function () { this.style.opacity = '1'; };
    card.appendChild(img);

    // Add breed details if available
    if (breedInfo) {
        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'breed-details';

        if (breedInfo.temperament) {
            const tempP = document.createElement('p');
            const tempStrong = document.createElement('strong');
            tempStrong.textContent = 'Temperament: ';
            tempP.appendChild(tempStrong);
            tempP.appendChild(document.createTextNode(breedInfo.temperament));
            detailsDiv.appendChild(tempP);
        }

        if (breedInfo.origin) {
            const originP = document.createElement('p');
            const originStrong = document.createElement('strong');
            originStrong.textContent = 'Origin: ';
            originP.appendChild(originStrong);
            originP.appendChild(document.createTextNode(breedInfo.origin));
            detailsDiv.appendChild(originP);
        }

        if (breedInfo.life_span) {
            const lifeP = document.createElement('p');
            const lifeStrong = document.createElement('strong');
            lifeStrong.textContent = 'Life Span: ';
            lifeP.appendChild(lifeStrong);
            lifeP.appendChild(document.createTextNode(`${breedInfo.life_span} years`));
            detailsDiv.appendChild(lifeP);
        }

        if (breedInfo.description) {
            const descP = document.createElement('p');
            const descStrong = document.createElement('strong');
            descStrong.textContent = 'About: ';
            descP.appendChild(descStrong);
            descP.appendChild(document.createTextNode(breedInfo.description));
            detailsDiv.appendChild(descP);
        }

        card.appendChild(detailsDiv);
    }

    const infoDiv = document.createElement('div');
    infoDiv.className = 'dog-info';

    const urlP = document.createElement('p');
    const urlStrong = document.createElement('strong');
    urlStrong.textContent = 'Image URL: ';
    urlP.appendChild(urlStrong);
    urlP.appendChild(document.createTextNode(imageUrl));
    infoDiv.appendChild(urlP);

    const sourceP = document.createElement('p');
    const sourceStrong = document.createElement('strong');
    sourceStrong.textContent = 'Source: ';
    sourceP.appendChild(sourceStrong);
    sourceP.appendChild(document.createTextNode('The Cat API'));
    infoDiv.appendChild(sourceP);

    card.appendChild(infoDiv);

    // Add a "🎲 Random Cat" button at the bottom for quick randomization
    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '1.5rem';
    btnContainer.style.textAlign = 'center';

    const innerRandomBtn = document.createElement('button');
    innerRandomBtn.className = 'api-button primary';
    innerRandomBtn.innerHTML = '🎲 Random Cat';
    innerRandomBtn.style.padding = '0.75rem 2rem';
    innerRandomBtn.style.cursor = 'pointer';
    innerRandomBtn.onclick = getRandomCat;

    btnContainer.appendChild(innerRandomBtn);
    card.appendChild(btnContainer);

    resultDiv.appendChild(card);
}

/**
 * Display a list of cat breeds
 * @param {Array} breeds - Array of breed objects
 */
// Helper function to show details for a specific breed
async function showBreedDetails(breed) {
    showLoading();
    try {
        const imageResponse = await fetch(`${CAT_API_BASE}/images/search?breed_ids=${breed.id}`);
        const imageData = await imageResponse.json();

        if (imageData && imageData.length > 0) {
            displayCatImage(imageData[0].url, breed.name, breed, true);
        } else {
            // Fallback if no images found for that specific ID
            displayCatImage('https://via.placeholder.com/400x300?text=No+Image', breed.name, breed, true);
        }
    } catch (error) {
        console.error('Error showing breed details:', error);
        showError(`Could not load details for ${breed.name}.`);
    }
}

function displayBreedList(breeds) {
    hideLoading();
    resultDiv.textContent = '';

    const listDiv = document.createElement('div');
    listDiv.className = 'breed-list';

    const title = document.createElement('h3');
    title.textContent = `🐱 All Cat Breeds (${breeds.length} total)`;
    listDiv.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = 'Discover all the unique cat breeds and their origins:';
    listDiv.appendChild(desc);

    const breedsContainer = document.createElement('div');
    breedsContainer.className = 'breed-list-container';

    breeds.forEach(breed => {
        const isObject = typeof breed === 'object';
        const name = isObject ? breed.name : breed;
        const origin = isObject && breed.origin ? breed.origin : 'Unknown Origin';
        const description = isObject && breed.temperament ? breed.temperament.split(',')[0].trim() : 'Active';

        // Get image URL - check different possible structures from API
        let imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';
        if (isObject) {
            if (breed.image && breed.image.url) {
                imageUrl = breed.image.url;
            } else if (breed.reference_image_id) {
                // If we only have the ID, we could fetch it, but for a list we'll try to guess the URL or use a placeholder
                imageUrl = `https://cdn2.thecatapi.com/images/${breed.reference_image_id}.jpg`;
            }
        }

        const breedCard = document.createElement('div');
        breedCard.className = 'breed-item';
        // Add click listener to show full details
        breedCard.onclick = () => showBreedDetails(breed);

        // Image at the top
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = name;
        img.onerror = function () { this.src = 'https://via.placeholder.com/300x200?text=Cat'; };
        breedCard.appendChild(img);

        // Content section
        const contentDiv = document.createElement('div');
        contentDiv.className = 'breed-item-content';

        const nameH4 = document.createElement('h4');
        const nameStrong = document.createElement('strong');
        nameStrong.textContent = name;
        nameH4.appendChild(nameStrong);
        contentDiv.appendChild(nameH4);

        const originP = document.createElement('p');
        originP.className = 'origin';
        originP.textContent = `📍 ${origin}`;
        contentDiv.appendChild(originP);

        const descP = document.createElement('p');
        descP.className = 'one-word';
        descP.textContent = `✨ ${description}`;
        contentDiv.appendChild(descP);

        breedCard.appendChild(contentDiv);
        breedsContainer.appendChild(breedCard);
    });

    listDiv.appendChild(breedsContainer);
    resultDiv.appendChild(listDiv);
}

/**
 * Display raw JSON data for debugging
 * @param {Object} jsonData - Raw JSON data from API
 */
function displayJsonData(jsonData) {
    hideLoading();
    resultDiv.textContent = '';

    const jsonDiv = document.createElement('div');
    jsonDiv.className = 'json-display';

    const title = document.createElement('h3');
    title.textContent = '📄 Raw JSON Response';
    jsonDiv.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = 'This is what the API actually returns:';
    jsonDiv.appendChild(desc);

    const pre = document.createElement('pre');
    pre.textContent = JSON.stringify(jsonData, null, 2);
    jsonDiv.appendChild(pre);

    resultDiv.appendChild(jsonDiv);
}

// ==========================================
// BONUS HELPER FUNCTIONS (✅ Pre-built)
// ==========================================

/**
 * Get search history from localStorage
 */
function getSearchHistory() {
    return JSON.parse(localStorage.getItem('breedSearchHistory') || '[]');
}

/**
 * Clear all saved data
 */
function clearAllData() {
    localStorage.removeItem('breedSearchHistory');
    console.log('Search history cleared');
}

// ==========================================
// STUDENT INSTRUCTIONS
// ==========================================
/*
🎯 YOUR MISSION: Complete 5 TODOs to build a working Cat API Explorer!

📝 RECOMMENDED ORDER:
1. TODO 1: getRandomCat() - Start here! Easiest one.
2. TODO 5: showRawJson() - Quick win, same pattern as TODO 1
3. TODO 2: getAllBreeds() - Similar to TODO 1, just different endpoint
4. TODO 4: getRandomBreed() - Chains two API calls together
5. TODO 3: searchBreed() - Most complex, uses localStorage

🧪 TESTING YOUR CODE:
- Click each button to test your implementation
- Open DevTools (F12) → Console to see logs and errors
- The error messages will guide you!

📚 API DOCUMENTATION:
- The Cat API: https://thecatapi.com/
- Free to use, no API key required for basic features

🔍 DEBUGGING TIPS:
- Use console.log() to see what data you receive
- Check the Network tab in DevTools to see API responses
- Read error messages carefully - they often tell you exactly what's wrong

💡 REMEMBER:
- The Cat API returns ARRAYS, not objects with status codes
- Use data[0] to get the first item from the array
- await is needed for both fetch() and response.json()
*/
