# Ghostty Shader Lab

A p5.js framework for creating and previewing Ghostty-compatible GLSL shaders.

## Features

- Preview shaders in real-time using p5.js
- Write shaders in Ghostty-compatible format
- Separate GLSL files that can be directly used in Ghostty terminal
- Minimal HTML setup (like p5.js web editor)

## Project Structure

```
ghostty-shader-lab/
├── index.html      # Minimal HTML file (loads p5.js)
├── sketch.js       # P5.js sketch that loads and renders the shader
├── shader.vert     # Vertex shader (standard, rarely needs changes)
├── shader.frag     # Fragment shader (YOUR SHADER HERE!)
└── README.md       # This file
```

## Quick Start

1. Open `index.html` in your browser
2. Edit `shader.frag` to create your shader
3. Refresh the browser to see changes
4. When ready, extract the Ghostty-compatible code from `shader.frag`

## How It Works

### P5.js Preview

The `sketch.js` file:
- Creates a simulated terminal with sample text
- Loads your shader from `shader.frag`
- Passes Ghostty-compatible uniforms (iTime, iResolution, iChannel0)
- Renders the result in real-time

### Ghostty-Compatible Shader Format

Your `shader.frag` file uses the `mainImage()` function format that Ghostty expects:

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 terminalColor = texture2D(iChannel0, uv);

    // Your shader effect here

    fragColor = vec4(color, terminalColor.a);
}
```

### Available Uniforms (Ghostty-compatible)

- `iTime` - Time in seconds (for animations)
- `iResolution` - Screen resolution as vec2(width, height)
- `iChannel0` - Terminal content texture (sampler2D)

## Using Your Shader in Ghostty

### Option 1: Extract the mainImage function

1. Copy everything ABOVE the `// P5.js main function` comment in `shader.frag`
2. Remove the P5.js-specific parts:
   - Remove `#ifdef GL_ES` block
   - Remove `varying vec2 vTexCoord;`
   - Change `texture2D` to `texture`
3. Save as a `.glsl` file

### Option 2: Use the conversion script (coming soon)

We'll add a script to automatically convert from p5.js format to pure Ghostty format.

## Example: Converting to Ghostty

**From `shader.frag`:**
```glsl
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 terminalColor = texture2D(iChannel0, uv);
    fragColor = terminalColor;
}

void main() {
    vec2 fragCoord = vTexCoord * iResolution;
    mainImage(gl_FragColor, fragCoord);
}
```

**To Ghostty format (save as `my-shader.glsl`):**
```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 terminalColor = texture(iChannel0, uv);
    fragColor = terminalColor;
}
```

## Installing Shader in Ghostty

1. Save your converted shader to `~/.config/ghostty/shaders/my-shader.glsl`
2. Add to `~/.config/ghostty/config`:
   ```
   custom-shader = ~/.config/ghostty/shaders/my-shader.glsl
   custom-shader-animation = true
   ```
3. Restart Ghostty

## Tips

- Use `iTime` for animations
- Sample `iChannel0` to get the terminal content
- Test frequently in the browser before converting to Ghostty
- Keep shaders simple for better performance

## Examples

Check out these existing Ghostty shaders for inspiration:
- starfield.glsl - Animated starfield background
- bettercrt.glsl - CRT monitor effect with scanlines
- retro-terminal.glsl - Retro terminal with color tint

Happy shader coding!
