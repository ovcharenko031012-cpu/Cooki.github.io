// DOM Elements
const textInput = document.getElementById('textInput');
const transformSelect = document.getElementById('transformSelect');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const copyBtn = document.getElementById('copyBtn');
const quickFillBtn = document.getElementById('quickFillBtn');
const clearBtn = document.getElementById('clearBtn');
const sendBtn = document.getElementById('sendBtn');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');
const EMAIL_ENDPOINT = 'https://formsubmit.co/ajax/ovcharenko031012@gmail.com';

// Transform functions
function transformText(text, mode) {
  if (!text) return '';
  
  switch (mode) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
    case 'titlecase':
      return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    case 'reverse':
      return text.split('').reverse().join('');
    case 'sentencecase':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case 'none':
    default:
      return text;
  }
}

// Update all transform cards
function updateAllOutputs() {
  const inputText = textInput.value;
  const formats = ['none', 'uppercase', 'lowercase', 'titlecase', 'reverse', 'sentencecase'];
  
  formats.forEach(format => {
    const outputElement = document.getElementById(`output-${format}`);
    if (outputElement) {
      const transformed = transformText(inputText, format);
      outputElement.textContent = transformed || (
        format === 'none' ? 'Your original text' :
        format === 'uppercase' ? 'TEXT IN CAPS' :
        format === 'lowercase' ? 'text in lowercase' :
        format === 'titlecase' ? 'Text In Title Case' :
        format === 'reverse' ? 'txet desrever' :
        'Sentence case text'
      );
    }
  });
  
  updateStats();
}

// Calculate stats
function updateStats() {
  const text = textInput.value;
  
  // Character count
  const chars = text.length;
  charCount.textContent = chars.toString();
  
  // Word count
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  wordCount.textContent = words.toString();
}

// Show toast notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Copy current output to clipboard
function copyToClipboard() {
  const formats = ['none', 'uppercase', 'lowercase', 'titlecase', 'reverse', 'sentencecase'];
  const selectedFormat = transformSelect.value;
  const outputElement = document.getElementById(`output-${selectedFormat}`);
  
  if (!outputElement || !outputElement.textContent) {
    showToast('Nothing to copy!');
    return;
  }
  
  const text = outputElement.textContent;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('✅ Copied to clipboard!'))
      .catch(() => showToast('Failed to copy'));
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('✅ Copied to clipboard!');
    } catch (err) {
      showToast('Failed to copy');
    }
    document.body.removeChild(textarea);
  }
}

// Quick fill with example
function quickFill() {
  textInput.value = "🍪 Cookie Transformation Station - Transform your text with magic! ✨";
  updateAllOutputs();
  textInput.focus();
}

// Clear all
function clearAll() {
  textInput.value = '';
  updateAllOutputs();
  textInput.focus();
}

async function sendTextToEmail() {
  const text = textInput.value.trim();
  if (!text) {
    showToast('⚠️ Enter some text first');
    return;
  }

  const payload = new URLSearchParams();
  payload.append('_subject', 'New Cookie text submission');
  payload.append('_captcha', 'false');
  payload.append('_template', 'table');
  payload.append('name', 'Cookie User');
  payload.append('email', 'no-reply@example.com');
  payload.append('message', `Text: ${text}\nFormat: ${transformSelect.value}\nChars: ${text.length}\nWords: ${text.trim().split(/\s+/).length}`);

  try {
    const response = await fetch(EMAIL_ENDPOINT, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: payload
    });

    if (!response.ok) {
      throw new Error('Send failed');
    }

    showToast('✉️ Sent to email');
  } catch (error) {
    showToast('❌ Could not send right now');
  }
}

// Theme management
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.classList.toggle('light-mode', savedTheme === 'light');
  updateThemeButton();
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  localStorage.setItem('theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  document.documentElement.classList.toggle('light-mode', newTheme === 'light');
  updateThemeButton();
}

function updateThemeButton() {
  const theme = localStorage.getItem('theme') || 'dark';
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Event listeners
textInput.addEventListener('input', updateAllOutputs);
transformSelect.addEventListener('change', updateAllOutputs);
copyBtn.addEventListener('click', copyToClipboard);
quickFillBtn.addEventListener('click', quickFill);
clearBtn.addEventListener('click', clearAll);
sendBtn.addEventListener('click', sendTextToEmail);
themeToggle.addEventListener('click', toggleTheme);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    sendTextToEmail();
  }
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    toggleTheme();
  }
});

// Initialize
loadTheme();
updateAllOutputs();
