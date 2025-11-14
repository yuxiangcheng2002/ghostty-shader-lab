// Ghostty Shader Lab - P5.js Sketch
// This file loads and previews .frag shaders in Ghostty format

let myShader;
let shaderTexture;
let currentShader = 'bettercrt.frag';

// List of available shaders
const SHADERS = [
  { name: 'Better CRT', file: 'bettercrt.frag' },
  { name: 'Retro Terminal', file: 'retro-terminal.frag' },
  { name: 'CRT', file: 'crt.frag' },
  { name: 'Bloom', file: 'bloom.frag' },
  { name: 'Dither', file: 'dither.frag' },
  { name: 'Negative', file: 'negative.frag' },
  { name: 'TFT', file: 'tft.frag' },
  { name: 'Spotlight', file: 'spotlight.frag' },
  { name: 'Water', file: 'water.frag' },
  { name: 'Underwater', file: 'underwater.frag' },
  { name: 'Gradient', file: 'gradient-background.frag' },
  { name: 'Animated Gradient', file: 'animated-gradient-shader.frag' },
  { name: 'Sin Interference', file: 'sin-interference.frag' },
  { name: 'Glitchy', file: 'glitchy.frag' },
  { name: 'RGB Split', file: 'glow-rgbsplit-twitchy.frag' },
  { name: 'Drunkard', file: 'drunkard.frag' },
  { name: 'Just Snow', file: 'just-snow.frag' },
  { name: 'Cubes', file: 'cubes.frag' },
  { name: 'Galaxy', file: 'galaxy.frag' },
  { name: 'Lava', file: 'cineShader-Lava.frag' },
  { name: 'Fireworks', file: 'fireworks.frag' },
  { name: 'Fireworks Rockets', file: 'fireworks-rockets.frag' },
  { name: 'Starfield Colors', file: 'starfield-colors.frag' },
  { name: 'Matrix Hallway', file: 'matrix-hallway.frag' },
  { name: 'Inside Matrix', file: 'inside-the-matrix.frag' },
  { name: 'Smoke & Ghost', file: 'smoke-and-ghost.frag' },
  { name: 'Sparks from Fire', file: 'sparks-from-fire.frag' },
  { name: 'Cursor Blaze', file: 'cursor_blaze.frag' },
  { name: 'Gears & Belts', file: 'gears-and-belts.frag' },
  { name: 'In-Game CRT', file: 'in-game-crt.frag' },
  { name: 'Mnoise', file: 'mnoise.frag' },
  { name: 'Template', file: 'shader-template.frag' }
];

let shaderDropdown;
let shaderLoaded = false;

function preload() {
  // Preload doesn't work well with dynamic loading, handle in setup
}

function setup() {
  // Use smaller canvas for better performance
  let w = min(windowWidth, 1200);
  let h = min(windowHeight, 800);
  createCanvas(w, h, WEBGL);
  noStroke();

  // Limit frame rate for better performance
  frameRate(30);

  // Create shader selection dropdown
  createShaderDropdown();

  // Create a texture to render content (simulates terminal content)
  updateTerminalTexture();

  // Load and compile initial shader
  loadAndCompileShader(currentShader);
}

function draw() {
  background(0);

  if (!shaderLoaded || !myShader) {
    // Show terminal text without shader
    push();
    resetShader();
    translate(-width/2, -height/2);
    image(shaderTexture, 0, 0, width, height);
    pop();
    return;
  }

  try {
    // Apply the shader to background only
    shader(myShader);

    // Set Ghostty-compatible uniforms
    myShader.setUniform('iTime', millis() / 1000.0);
    myShader.setUniform('iResolution', [width, height]);
    myShader.setUniform('iChannel0', shaderTexture);

    // Draw a rectangle covering the whole canvas
    rect(-width/2, -height/2, width, height);

    // Reset shader and draw text on top
    resetShader();
    push();
    translate(-width/2, -height/2);

    // Draw terminal text on top of shader
    drawTerminalText();

    pop();
  } catch(e) {
    // If shader fails, reset and show error
    resetShader();
    background(0);
    console.error('Shader runtime error:', e);
    shaderLoaded = false;
  }
}

function drawTerminalText() {
  // Create a 2D graphics buffer for crisp text rendering
  if (!window.textBuffer) {
    window.textBuffer = createGraphics(width, height);
  }

  // Clear the buffer
  window.textBuffer.clear();

  // Draw text on the buffer with pixel-perfect rendering
  window.textBuffer.fill(255);
  window.textBuffer.textSize(12);
  window.textBuffer.textFont('monospace');
  window.textBuffer.textAlign(LEFT, TOP);

  let lines = [
    '$ ssh user@remote-server.com',
    'user@remote-server.com\'s password: ********',
    'Last login: Wed Nov 13 13:42:15 2025 from 192.168.1.100',
    '',
    'Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-89-generic x86_64)',
    '',
    ' * Documentation:  https://help.ubuntu.com',
    ' * Management:     https://landscape.canonical.com',
    ' * Support:        https://ubuntu.com/advantage',
    '',
    '  System load:  0.24              Processes:           245',
    '  Usage of /:   42.3% of 98.12GB  Users logged in:     2',
    '  Memory usage: 18%               IPv4 address:        10.0.0.5',
    '  Swap usage:   0%',
    '',
    '127 updates can be applied immediately.',
    '89 of these updates are standard security updates.',
    'To see these additional updates run: apt list --upgradable',
    '',
    'user@remote-server:~$ ls -la',
    'total 48',
    'drwxr-xr-x 6 user user 4096 Nov 13 13:40 .',
    'drwxr-xr-x 3 root root 4096 Jan 15  2024 ..',
    '-rw------- 1 user user 2847 Nov 13 13:42 .bash_history',
    '-rw-r--r-- 1 user user  220 Jan 15  2024 .bash_logout',
    '-rw-r--r-- 1 user user 3771 Jan 15  2024 .bashrc',
    'drwx------ 2 user user 4096 Mar 22  2024 .cache',
    'drwxrwxr-x 3 user user 4096 Aug 19 10:23 projects',
    'drwx------ 2 user user 4096 Feb 11  2024 .ssh',
    '',
    'user@remote-server:~$ █'
  ];

  let y = 10;
  for (let line of lines) {
    window.textBuffer.text(line, 10, y);
    y += 14;
  }

  // Display the buffer as an image
  image(window.textBuffer, 0, 0, width, height);
}

function windowResized() {
  let w = min(windowWidth, 1200);
  let h = min(windowHeight, 800);
  resizeCanvas(w, h);
  updateTerminalTexture();

  // Recreate text buffer with new size
  if (window.textBuffer) {
    window.textBuffer.remove();
    window.textBuffer = null;
  }

  // Reposition dropdown at bottom left
  if (shaderDropdown) {
    let dropdownHeight = 45;
    shaderDropdown.position(20, windowHeight - dropdownHeight - 20);
  }
}

function createShaderDropdown() {
  // Create dropdown menu
  shaderDropdown = createSelect();

  // Position at bottom left
  let dropdownHeight = 45;
  shaderDropdown.position(20, windowHeight - dropdownHeight - 20);

  // Add shader options in reverse order for drop-up effect
  for (let i = SHADERS.length - 1; i >= 0; i--) {
    shaderDropdown.option(SHADERS[i].name, SHADERS[i].file);
  }

  // Set current shader as selected
  shaderDropdown.value(currentShader);

  // Style the dropdown
  shaderDropdown.style('padding', '10px 15px');
  shaderDropdown.style('background-color', '#333');
  shaderDropdown.style('color', 'white');
  shaderDropdown.style('border', '1px solid #555');
  shaderDropdown.style('border-radius', '4px');
  shaderDropdown.style('cursor', 'pointer');
  shaderDropdown.style('font-family', 'monospace');
  shaderDropdown.style('font-size', '14px');
  shaderDropdown.style('z-index', '1000');
  shaderDropdown.style('min-width', '200px');

  // Add change event listener
  shaderDropdown.changed(() => {
    let selectedFile = shaderDropdown.value();
    switchShader(selectedFile);
  });
}

function switchShader(shaderFile) {
  if (currentShader === shaderFile) return;

  currentShader = shaderFile;

  // Load and compile new shader
  loadAndCompileShader(currentShader);
}

function loadAndCompileShader(filename) {
  shaderLoaded = false;
  console.log('Loading shader:', filename);

  // Load shader file
  loadStrings(filename, (lines) => {
    let glslCode = lines.join('\n');
    console.log('Loaded GLSL code, length:', glslCode.length);

    // Convert Ghostty GLSL to p5.js shader
    let fragShader = convertGhosttyToP5(glslCode);
    let vertShader = getDefaultVertexShader();

    console.log('Creating shader...');

    // Create the shader - p5.js will handle compilation
    myShader = createShader(vertShader, fragShader);

    // Mark as loaded - if there's an error, draw() will catch it
    shaderLoaded = true;
    console.log('Shader created:', filename);
  }, (error) => {
    console.error('Error loading shader file:', filename, error);
  });
}

function updateTerminalTexture() {
  // Use lower resolution texture for better performance
  let texWidth = min(width, 800);
  let texHeight = min(height, 600);
  shaderTexture = createGraphics(texWidth, texHeight);
  shaderTexture.background(0);
  shaderTexture.fill(255); // White terminal text
  shaderTexture.textSize(12);
  shaderTexture.textFont('monospace');
  shaderTexture.textAlign(LEFT, TOP);

  // Simulate SSH session
  let lines = [
    '$ ssh user@remote-server.com',
    'user@remote-server.com\'s password: ********',
    'Last login: Wed Nov 13 13:42:15 2025 from 192.168.1.100',
    '',
    'Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-89-generic x86_64)',
    '',
    ' * Documentation:  https://help.ubuntu.com',
    ' * Management:     https://landscape.canonical.com',
    ' * Support:        https://ubuntu.com/advantage',
    '',
    '  System load:  0.24              Processes:           245',
    '  Usage of /:   42.3% of 98.12GB  Users logged in:     2',
    '  Memory usage: 18%               IPv4 address:        10.0.0.5',
    '  Swap usage:   0%',
    '',
    '127 updates can be applied immediately.',
    '89 of these updates are standard security updates.',
    'To see these additional updates run: apt list --upgradable',
    '',
    'user@remote-server:~$ ls -la',
    'total 48',
    'drwxr-xr-x 6 user user 4096 Nov 13 13:40 .',
    'drwxr-xr-x 3 root root 4096 Jan 15  2024 ..',
    '-rw------- 1 user user 2847 Nov 13 13:42 .bash_history',
    '-rw-r--r-- 1 user user  220 Jan 15  2024 .bash_logout',
    '-rw-r--r-- 1 user user 3771 Jan 15  2024 .bashrc',
    'drwx------ 2 user user 4096 Mar 22  2024 .cache',
    'drwxrwxr-x 3 user user 4096 Aug 19 10:23 projects',
    'drwx------ 2 user user 4096 Feb 11  2024 .ssh',
    '',
    'user@remote-server:~$ █'
  ];

  // Draw normally - fix texture coordinate flipping in shader instead
  let y = 10;
  for (let line of lines) {
    shaderTexture.text(line, 10, y);
    y += 16;
  }
}

// Convert Ghostty GLSL format to p5.js format
function convertGhosttyToP5(glslCode) {
  // Add p5.js-specific header
  let p5Header = `#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTexCoord;

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

`;

  // Add p5.js main function wrapper with flipped Y coordinate
  let p5Main = `

void main() {
  // Flip Y coordinate to fix WebGL texture orientation
  vec2 flippedTexCoord = vec2(vTexCoord.x, 1.0 - vTexCoord.y);
  vec2 fragCoord = flippedTexCoord * iResolution;
  mainImage(gl_FragColor, fragCoord);
}
`;

  // Replace texture() with texture2D() for p5.js compatibility
  glslCode = glslCode.replace(/\btexture\(/g, 'texture2D(');

  // Combine all parts
  return p5Header + glslCode + p5Main;
}

// Default vertex shader for p5.js
function getDefaultVertexShader() {
  return `attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  gl_Position = positionVec4;
}
`;
}
