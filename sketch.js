// Ghostty Shader Lab - P5.js Sketch
// This file loads and previews Ghostty-compatible GLSL shaders

let shader;
let shaderTexture;

function preload() {
  // Load the shader file
  shader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  // Create a texture to render content (simulates terminal content)
  shaderTexture = createGraphics(width, height);
  shaderTexture.background(0);
  shaderTexture.fill(255);
  shaderTexture.textSize(16);
  shaderTexture.textAlign(LEFT, TOP);

  // Draw some sample terminal text
  for (let i = 0; i < 30; i++) {
    shaderTexture.text('$ echo "Hello from terminal line ' + i + '"', 10, i * 20);
  }
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

  // Recreate texture with new size
  shaderTexture = createGraphics(width, height);
  shaderTexture.background(0);
  shaderTexture.fill(255);
  shaderTexture.textSize(16);
  shaderTexture.textAlign(LEFT, TOP);

  for (let i = 0; i < 30; i++) {
    shaderTexture.text('$ echo "Hello from terminal line ' + i + '"', 10, i * 20);
  }
}
