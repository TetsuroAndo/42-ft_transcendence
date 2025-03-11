import './styles/main.css';

// DOM content loaded event listener
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('root');
  
  if (app) {
    // Initialize the application
    initApp(app);
  }
});

/**
 * Initialize the application
 * @param rootElement - The root element to mount the application
 */
function initApp(rootElement: HTMLElement): void {
  // Set initial HTML content
  rootElement.innerHTML = `
    <div class="min-h-screen bg-background text-foreground">
      <header class="bg-primary p-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">ft_transcendence</h1>
          <nav>
            <ul class="flex space-x-4">
              <li><a href="#" class="text-white hover:text-gray-200" data-page="home">Home</a></li>
              <li><a href="#" class="text-white hover:text-gray-200" data-page="game">Game</a></li>
              <li><a href="#" class="text-white hover:text-gray-200" data-page="chat">Chat</a></li>
              <li><a href="#" class="text-white hover:text-gray-200" data-page="profile">Profile</a></li>
            </ul>
          </nav>
        </div>
      </header>
      <main class="container mx-auto p-4">
        <div id="page-content" class="mt-8">
          <!-- Page content will be loaded here -->
          <div class="text-center">
            <h2 class="text-3xl font-bold mb-4">Welcome to ft_transcendence</h2>
            <p class="mb-6">The ultimate online Pong game experience</p>
            <button id="start-game-btn" class="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Start Game
            </button>
          </div>
        </div>
      </main>
      <footer class="bg-background p-4 border-t border-gray-700 mt-auto">
        <div class="container mx-auto text-center text-gray-400">
          <p>&copy; 2025 ft_transcendence - 42 School Project</p>
        </div>
      </footer>
    </div>
  `;

  // Add event listeners
  setupEventListeners();
}

/**
 * Set up event listeners for the application
 */
function setupEventListeners(): void {
  // Navigation links
  document.querySelectorAll('a[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = (e.currentTarget as HTMLElement).getAttribute('data-page');
      navigateToPage(page || 'home');
    });
  });

  // Start game button
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
      navigateToPage('game');
    });
  }
}

/**
 * Navigate to a specific page
 * @param page - The page to navigate to
 */
function navigateToPage(page: string): void {
  const pageContent = document.getElementById('page-content');
  
  if (!pageContent) return;
  
  // In a real application, you would load the page content from separate modules
  // For now, we'll just change the content based on the page
  switch (page) {
    case 'home':
      pageContent.innerHTML = `
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4">Welcome to ft_transcendence</h2>
          <p class="mb-6">The ultimate online Pong game experience</p>
          <button id="start-game-btn" class="bg-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Start Game
          </button>
        </div>
      `;
      break;
    case 'game':
      pageContent.innerHTML = `
        <div>
          <h2 class="text-3xl font-bold mb-4">Pong Game</h2>
          <div class="bg-black w-full h-96 rounded-lg flex items-center justify-center">
            <p class="text-white">Game canvas will be loaded here</p>
          </div>
          <div class="mt-4 flex justify-center space-x-4">
            <button class="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Play vs Computer
            </button>
            <button class="bg-accent hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
              Play Online
            </button>
          </div>
        </div>
      `;
      break;
    case 'chat':
      pageContent.innerHTML = `
        <div>
          <h2 class="text-3xl font-bold mb-4">Chat</h2>
          <div class="bg-gray-800 rounded-lg p-4 h-96 flex flex-col">
            <div class="flex-grow overflow-y-auto mb-4 p-2">
              <p class="text-gray-400">No messages yet...</p>
            </div>
            <div class="flex">
              <input type="text" placeholder="Type a message..." class="flex-grow p-2 rounded-l bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary">
              <button class="bg-primary hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r">
                Send
              </button>
            </div>
          </div>
        </div>
      `;
      break;
    case 'profile':
      pageContent.innerHTML = `
        <div>
          <h2 class="text-3xl font-bold mb-4">User Profile</h2>
          <div class="bg-gray-800 rounded-lg p-6">
            <div class="flex items-center mb-6">
              <div class="w-20 h-20 bg-gray-600 rounded-full mr-4"></div>
              <div>
                <h3 class="text-xl font-bold">Username</h3>
                <p class="text-gray-400">Joined: January 2025</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-700 p-4 rounded">
                <h4 class="font-bold mb-2">Game Statistics</h4>
                <p>Wins: 0</p>
                <p>Losses: 0</p>
                <p>Win Rate: 0%</p>
              </div>
              <div class="bg-gray-700 p-4 rounded">
                <h4 class="font-bold mb-2">Settings</h4>
                <div class="flex items-center justify-between mb-2">
                  <span>Dark Mode</span>
                  <span class="w-10 h-6 bg-primary rounded-full relative">
                    <span class="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span>Notifications</span>
                  <span class="w-10 h-6 bg-gray-500 rounded-full relative">
                    <span class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      break;
    default:
      pageContent.innerHTML = '<p>Page not found</p>';
  }

  // Re-attach event listeners after changing the content
  if (page === 'home') {
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => {
        navigateToPage('game');
      });
    }
  }
}
