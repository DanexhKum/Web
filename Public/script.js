// Mood Constants
const MOOD_EMOJIS = {
    happy: '😊',
    sad: '😢',
    stressed: '😫',
    angry: '😠'
  };
  
  const MOOD_COLORS = {
    happy: '#FF9AA2',
    sad: '#A0E7E5',
    stressed: '#B5EAD7',
    angry: '#FFB7B2'
  };
  
  const MOOD_GRADIENTS = {
    happy: 'linear-gradient(135deg, #FF9AA2 0%, #FFB7B2 100%)',
    sad: 'linear-gradient(135deg, #A0E7E5 0%, #B5EAD7 100%)',
    stressed: 'linear-gradient(135deg, #B5EAD7 0%, #C7CEEA 100%)',
    angry: 'linear-gradient(135deg, #FFB7B2 0%, #FFDAC1 100%)'
  };
  
  const HUME_API_KEY = "BaGpB845r3TsSHm0tKFtj7rQWvYWEhA9p50BEeQ7lBt3nFY0"; 
  const SPOONACULAR_API_KEY = "92737eae949d49b29ca741277f7c166c"; 
  
  // DOM Elements
  const recordBtn = document.getElementById('record-btn');
  const moodDisplay = document.getElementById('mood-display');
  const moodResult = document.getElementById('mood-result');
  const recipesContainer = document.getElementById('recipes-container');
  const manualMood = document.getElementById('manual-mood');
  const loading = document.getElementById('loading');
  const recipeModal = document.getElementById('recipe-modal');
  const closeModal = document.querySelector('.close-modal');
  const modalRecipeImage = document.getElementById('modal-recipe-image');
  const modalRecipeTitle = document.getElementById('modal-recipe-title');
  const modalRecipeTime = document.getElementById('modal-recipe-time');
  const modalRecipeServings = document.getElementById('modal-recipe-servings');
  const modalRecipeInstructions = document.getElementById('modal-recipe-instructions');
  
  // Audio Variables
  let mediaRecorder;
  let audioChunks = [];
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    showManualMoodButtons();
    checkMicrophonePermission();
  });
  
  // Record Button Handler
  recordBtn.addEventListener('click', toggleRecording);
  
  // Modal close handler
  closeModal.addEventListener('click', () => {
    recipeModal.classList.add('hidden');
  });
  
  // Close modal when clicking outside
  recipeModal.addEventListener('click', (e) => {
    if (e.target === recipeModal) {
      recipeModal.classList.add('hidden');
    }
  });
  
  async function toggleRecording() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      await startRecording();
    } else {
      stopRecording();
    }
  }
  
  async function startRecording() {
    try {
      audioChunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = analyzeMood;
      
      recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
      recordBtn.classList.add('recording');
      moodDisplay.classList.remove('hidden');
      moodResult.classList.add('hidden');
      recipesContainer.innerHTML = '';
      
      mediaRecorder.start(100);
      
      setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, 5000);
      
    } catch (error) {
      console.error('Recording failed:', error);
      showError('Microphone access denied. Please enable permissions.');
      showManualMoodButtons();
    }
  }
  
  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      
      recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Record Voice';
      recordBtn.classList.remove('recording');
      moodDisplay.classList.add('hidden');
    }
  }
  
  async function analyzeMood() {
    showLoading(true);
    
    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      const mood = await detectMoodFromAudio(audioBlob);
      
      displayMoodResult(mood);
      await fetchRecipes(mood);
      
      if (mood === 'happy') {
        triggerConfetti();
      }
      
    } catch (error) {
      console.error('Analysis failed:', error);
      showError('Mood analysis failed. Try manual selection below.');
      // Fallback to mock mood selection
      const mockMoods = ['happy', 'sad', 'stressed', 'angry'];
      const randomMood = mockMoods[Math.floor(Math.random() * mockMoods.length)];
      displayMoodResult(randomMood);
      await fetchRecipes(randomMood);
    } finally {
      showLoading(false);
    }
  }
  
  async function detectMoodFromAudio(audioBlob) {
    // In a real implementation, we would use Hume API here
    // This is a simplified version that simulates API call
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock API response processing
    const emotions = {
      happy: Math.random(),
      sad: Math.random(),
      stressed: Math.random(),
      angry: Math.random()
    };
    
    // Find the dominant emotion
    let maxEmotion = 'happy';
    let maxValue = emotions.happy;
    
    for (const [emotion, value] of Object.entries(emotions)) {
      if (value > maxValue) {
        maxValue = value;
        maxEmotion = emotion;
      }
    }
    
    return maxEmotion;
  }
  
  function displayMoodResult(mood) {
    moodResult.innerHTML = `
      <div class="mood-result ${mood}">
        <div class="mood-emoji">${MOOD_EMOJIS[mood]}</div>
        <h2>You're feeling ${mood}</h2>
        <p>Here are some recipes that might help...</p>
      </div>
    `;
    moodResult.classList.remove('hidden');
  }
  
  async function fetchRecipes(mood) {
    try {
      // Map moods to recipe categories
      const moodToQuery = {
        happy: 'dessert',
        sad: 'comfort food',
        stressed: 'healthy',
        angry: 'spicy'
      };
  
      // First fetch recipe IDs based on mood
      const searchResponse = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${moodToQuery[mood]}&number=5&apiKey=${SPOONACULAR_API_KEY}`
      );
      
      if (!searchResponse.ok) {
        throw new Error('Failed to fetch recipes');
      }
  
      const searchData = await searchResponse.json();
      
      if (!searchData.results || searchData.results.length === 0) {
        throw new Error('No recipes found for this mood');
      }
  
      // Get detailed information for each recipe
      const recipes = await Promise.all(
        searchData.results.map(recipe => 
          fetchRecipeDetails(recipe.id)
        )
      );
  
      displayRecipes(recipes, mood);
      
    } catch (error) {
      console.error('Fetch error:', error);
      showError(error.message || 'Failed to load recipes');
    }
  }
  
  async function fetchRecipeDetails(recipeId) {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }
    
    const data = await response.json();
    
    return {
      title: data.title,
      image: data.image,
      readyInMinutes: data.readyInMinutes,
      servings: data.servings,
      summary: data.summary.replace(/<[^>]*>?/gm, ''),
      instructions: data.instructions.replace(/<[^>]*>?/gm, '') || 'Instructions not available.',
      sourceUrl: data.sourceUrl
    };
  }
  
  function displayRecipes(recipes, mood) {
    recipesContainer.innerHTML = recipes.map((recipe, index) => `
      <div class="recipe-card" style="animation-delay: ${index * 0.2}s">
        <div class="recipe-image" style="background-image: url('${recipe.image}')"></div>
        <div class="recipe-content">
          <h3>${recipe.title}</h3>
          <div class="recipe-meta">
            <span><i class="fas fa-clock"></i> ${recipe.readyInMinutes} mins</span>
            <span><i class="fas fa-utensils"></i> ${recipe.servings} servings</span>
          </div>
          <p class="recipe-desc">${recipe.summary}</p>
          <div class="recipe-actions">
            <button class="btn-recipe" onclick="showRecipeModal(${JSON.stringify(recipe).replace(/"/g, '&quot;')})">
              <i class="fas fa-book-open"></i> View Recipe
            </button>
            <button class="btn-save" onclick="saveRecipe('${mood}', ${JSON.stringify(recipe).replace(/'/g, "\\'")})">
              <i class="fas fa-heart"></i> Save
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
  
  function showRecipeModal(recipe) {
    modalRecipeImage.style.backgroundImage = `url('${recipe.image}')`;
    modalRecipeTitle.textContent = recipe.title;
    modalRecipeTime.textContent = recipe.readyInMinutes;
    modalRecipeServings.textContent = recipe.servings;
    modalRecipeInstructions.textContent = recipe.instructions || "Instructions not available.";
    recipeModal.classList.remove('hidden');
  }
  
  function showManualMoodButtons() {
    manualMood.innerHTML = `
      <div class="or-divider"><span>or</span></div>
      <p>Select your mood manually:</p>
      <div class="mood-buttons">
        ${Object.entries(MOOD_EMOJIS).map(([mood, emoji]) => `
          <button class="mood-btn" onclick="selectMood('${mood}')" 
                  style="background: ${MOOD_GRADIENTS[mood]}">
            <span class="mood-emoji">${emoji}</span>
            <span class="mood-text">${mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
          </button>
        `).join('')}
      </div>
    `;
  }
  
  function selectMood(mood) {
    moodResult.classList.add('hidden');
    recipesContainer.innerHTML = '';
    displayMoodResult(mood);
    fetchRecipes(mood);
  }
  
  function showLoading(show) {
    if (show) {
      loading.classList.remove('hidden');
    } else {
      loading.classList.add('hidden');
    }
  }
  
  function showError(message) {
    recipesContainer.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
      </div>
    `;
  }
  
  function triggerConfetti() {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7']
    });
  }
  
  function checkMicrophonePermission() {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then(permissionStatus => {
        if (permissionStatus.state === 'denied') {
          showError('Microphone access is blocked. Please enable it in browser settings.');
        }
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            showManualMoodButtons();
          }
        };
      });
    }
  }
  
  function saveRecipe(mood, recipe) {
    const savedRecipes = JSON.parse(localStorage.getItem('savedRecipes') || '{}');
    if (!savedRecipes[mood]) savedRecipes[mood] = [];
    savedRecipes[mood].push(recipe);
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    
    const btn = event.target.closest('.btn-save');
    btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
    btn.style.background = '#4CAF50';
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-heart"></i> Save';
      btn.style.background = '#f8f9fa';
    }, 2000);
  }
  
  // Expose functions to global scope
  window.selectMood = selectMood;
  window.saveRecipe = saveRecipe;
  window.showRecipeModal = showRecipeModal;