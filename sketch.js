// Ghostty Shader Lab - P5.js Sketch
// This file loads and previews .glsl shaders in Ghostty format

let shader;
let shaderTexture;
let glslCode;
let currentShader = 'starfield.glsl';

// List of available shaders
const SHADERS = [
  { name: 'Starfield', file: 'starfield.glsl' },
  { name: 'Better CRT', file: 'bettercrt.glsl' },
  { name: 'Retro Terminal', file: 'retro-terminal.glsl' },
  { name: 'Template', file: 'shader-template.glsl' }
];

let buttons = [];

function preload() {
  // Load the default shader
  loadShaderFile(currentShader);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create shader selection buttons
  createShaderButtons();

  // Create shader from loaded GLSL
  compileShader();

  // Create a texture to render content (simulates terminal content)
  updateTerminalTexture();
}

function draw() {
  // Apply the shader
  shader(shader);

  // Set Ghostty-compatible uniforms
  shader.setUniform('iTime', millis() / 1000.0);
  shader.setUniform('iResolution', [width, height]);
  shader.setUniform('iChannel0', shaderTexture);

  // Draw a rectangle covering the whole canvas
  rect(-width/2, -height/2, width, height);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateTerminalTexture();
  repositionButtons();
}

function createShaderButtons() {
  let x = 20;
  let y = 20;
  let spacing = 10;

  SHADERS.forEach((shaderInfo, index) => {
    let btn = createButton(shaderInfo.name);
    btn.position(x, y);
    btn.mousePressed(() => switchShader(shaderInfo.file));
    btn.style('padding', '10px 15px');
    btn.style('background-color', currentShader === shaderInfo.file ? '#4CAF50' : '#333');
    btn.style('color', 'white');
    btn.style('border', 'none');
    btn.style('border-radius', '4px');
    btn.style('cursor', 'pointer');
    btn.style('font-family', 'monospace');
    btn.style('font-size', '14px');

    // Hover effect
    btn.mouseOver(() => {
      if (currentShader !== shaderInfo.file) {
        btn.style('background-color', '#555');
      }
    });
    btn.mouseOut(() => {
      if (currentShader !== shaderInfo.file) {
        btn.style('background-color', '#333');
      }
    });

    buttons.push({ btn, file: shaderInfo.file });
    y += 45 + spacing;
  });
}

function repositionButtons() {
  let x = 20;
  let y = 20;
  let spacing = 10;

  buttons.forEach(buttonInfo => {
    buttonInfo.btn.position(x, y);
    y += 45 + spacing;
  });
}

function switchShader(shaderFile) {
  if (currentShader === shaderFile) return;

  currentShader = shaderFile;

  // Update button colors
  buttons.forEach(buttonInfo => {
    if (buttonInfo.file === currentShader) {
      buttonInfo.btn.style('background-color', '#4CAF50');
    } else {
      buttonInfo.btn.style('background-color', '#333');
    }
  });

  // Load and compile new shader
  loadShaderFile(currentShader);
  compileShader();
}

function loadShaderFile(filename) {
  // Use synchronous loading since we need it before compilation
  httpGet(filename, 'text', false, (response) => {
    glslCode = response;
  });
}

function compileShader() {
  if (!glslCode) {
    console.error('No shader code loaded');
    return;
  }

  // Convert Ghostty GLSL to p5.js shader
  let fragShader = convertGhosttyToP5(glslCode);

  try {
    // Create shader with default vertex shader and converted fragment shader
    shader = createShader(getDefaultVertexShader(), fragShader);
  } catch (e) {
    console.error('Shader compilation error:', e);
  }
}

function updateTerminalTexture() {
  shaderTexture = createGraphics(width, height);
  shaderTexture.background(0);
  shaderTexture.fill(255);
  shaderTexture.textSize(16);
  shaderTexture.textAlign(LEFT, TOP);

  // Draw some sample terminal text
  for (let i = 0; i < 30; i++) {
    shaderTexture.text('$ echo "Hello from terminal line ' + i + '"', 10, i * 20 + 100);
  }
}

// Convert Ghostty GLSL format to p5.js format
function convertGhosttyToP5(glslCode) {
  // Add p5.js-specific header
  let p5Header = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

`;

  // Add p5.js main function wrapper
  let p5Main = `

void main() {
  vec2 fragCoord = vTexCoord * iResolution;
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
  return `
attribute vec3 aPosition;
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
