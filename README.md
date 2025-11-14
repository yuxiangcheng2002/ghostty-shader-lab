# Ghostty Shader Lab

A p5.js framework for creating and previewing Ghostty-compatible GLSL shaders.

Write shaders in Ghostty format and preview them in real-time with p5.js - works great in the p5.js web editor!

## Features

- **P5.js Web Editor Compatible** - Uses `.frag` extension for easy upload
- **Pure Ghostty format** - Write shaders exactly as they'll run in Ghostty
- **Instant preview** - See your shader running in real-time in the browser
- **Interactive UI** - Click buttons to switch between shaders
- **No conversion needed** - Just rename `.frag` to `.glsl` for Ghostty
- **Minimal setup** - Just like p5.js web editor
- **Example shaders included** - Learn from working examples

## Credits

Example shaders sourced from:
- [0xhckr/ghostty-shaders](https://github.com/0xhckr/ghostty-shaders) - bettercrt, retro-terminal
- [m-ahdal/ghostty-shaders](https://github.com/m-ahdal/ghostty-shaders) - starfield

## Project Structure

```
ghostty-shader-lab/
├── index.html            # Minimal HTML file
├── sketch.js             # P5.js code (handles conversion + UI)
├── starfield.frag        # Animated starfield shader
├── bettercrt.frag        # CRT effect shader
├── retro-terminal.frag   # Retro CRT with teal tint
├── shader-template.frag  # Template for creating new shaders
└── README.md             # This file
```

## Quick Start

### Option 1: Local (Desktop)

```bash
cd ~/Desktop/ghostty-shader-lab
open index.html
```

### Option 2: P5.js Web Editor

1. Go to [editor.p5js.org](https://editor.p5js.org)
2. Create a new sketch
3. Upload all files from this project
4. Click Run!

You'll see:
- The starfield shader running with simulated terminal text
- Buttons on the left to switch between shaders

### Try Different Shaders

Click the buttons to preview different shaders:
- **Starfield** - Animated stars moving toward you
- **Better CRT** - Classic CRT monitor effect
- **Retro Terminal** - CRT with green/teal tint
- **Template** - Minimal starting point

## Creating Your Own Shader

### 1. Start with the Template

```bash
cp shader-template.frag my-shader.frag
# Edit my-shader.frag with your effect
```

### 2. Add to the UI

Edit `sketch.js` and add your shader to the `SHADERS` array:

```javascript
const SHADERS = [
  { name: 'Starfield', file: 'starfield.frag' },
  { name: 'Better CRT', file: 'bettercrt.frag' },
  { name: 'Retro Terminal', file: 'retro-terminal.frag' },
  { name: 'Template', file: 'shader-template.frag' },
  { name: 'My Shader', file: 'my-shader.frag' }  // Add yours here!
];
```

### 3. Preview

Refresh the browser and click the new button!

### 4. Use in Ghostty

When you're happy with your shader:

```bash
# Just rename .frag to .glsl!
cp my-shader.frag ~/.config/ghostty/shaders/my-shader.glsl
```

Add to `~/.config/ghostty/config`:
```
custom-shader = ~/.config/ghostty/shaders/my-shader.glsl
custom-shader-animation = true
```

Restart Ghostty. Done!

## How It Works

### Ghostty-Compatible Format

Your `.frag` files use the exact format Ghostty expects (in its `mainImage()` function):

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;
    vec4 terminalColor = texture(iChannel0, uv);

    // Your shader effect here

    fragColor = vec4(color, terminalColor.a);
}
```

### Why `.frag` instead of `.glsl`?

- P5.js web editor only accepts `.frag` and `.vert` for shaders
- Ghostty uses `.glsl` extension
- **Solution**: Use `.frag` for development, rename to `.glsl` for Ghostty
- The content is identical - just the extension changes!

### Automatic Conversion

The `sketch.js` file automatically:
- Adds p5.js-specific headers
- Converts `texture()` to `texture2D()` for p5.js
- Wraps your shader in the required p5.js format
- Creates interactive buttons to switch shaders
- Handles all the boilerplate

**You never need to modify your `.frag` files for p5.js!**

### Available Uniforms (Ghostty-compatible)

- `iTime` - Time in seconds (for animations)
- `iResolution` - Screen resolution as vec2(width, height)
- `iChannel0` - Terminal content texture (sampler2D)

## Workflow

```
1. Edit shader.frag (Ghostty format with .frag extension)
   ↓
2. Click button in browser to preview
   ↓
3. Iterate until perfect
   ↓
4. Rename .frag to .glsl and copy to Ghostty
   ↓
5. Done!
```

## Tips

- **Animation**: Use `iTime` for time-based effects
- **Terminal content**: Sample `iChannel0` to see/blend with terminal text
- **Quick switching**: Use the buttons to compare different effects
- **Performance**: Keep shaders simple - they run on every frame
- **New shaders**: Add them to the `SHADERS` array in `sketch.js` to get a button
- **P5.js web editor**: Upload all `.frag` files along with `sketch.js` and `index.html`

## Common Shader Patterns

### Basic Terminal Overlay
```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 terminalColor = texture(iChannel0, uv);

    // Your effect
    vec3 effect = vec3(sin(iTime), 0.5, 0.5) * 0.1;

    fragColor = vec4(terminalColor.rgb + effect, terminalColor.a);
}
```

### Animated Effect
```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 terminalColor = texture(iChannel0, uv);

    // Animated wave
    float wave = sin(uv.x * 10.0 + iTime) * 0.5 + 0.5;

    fragColor = vec4(terminalColor.rgb * wave, terminalColor.a);
}
```

### Conditional Effect (like starfield)
```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec4 terminalColor = texture(iChannel0, uv);

    // Create effect
    vec3 effect = vec3(1.0); // white

    // Only show where terminal is dark
    float brightness = dot(terminalColor.rgb, vec3(0.299, 0.587, 0.114));
    float mask = 1.0 - step(0.1, brightness);

    vec3 finalColor = mix(terminalColor.rgb, effect, mask);
    fragColor = vec4(finalColor, terminalColor.a);
}
```

## Using in P5.js Web Editor

1. Go to [editor.p5js.org](https://editor.p5js.org)
2. Create new sketch
3. Click the `>` arrow next to "Sketch Files"
4. Upload files:
   - `sketch.js`
   - `starfield.frag`
   - `bettercrt.frag`
   - `retro-terminal.frag`
   - `shader-template.frag`
5. Click Run!

The buttons will appear and you can switch between shaders.

## Converting for Ghostty

Simple one-liner:

```bash
# Rename and copy to Ghostty
cp my-shader.frag ~/.config/ghostty/shaders/my-shader.glsl
```

That's it! The file content is identical, just the extension changes.

## Troubleshooting

**Shader not loading in p5.js web editor?**
- Make sure files are named `.frag` not `.glsl`
- Check the browser console for errors
- Ensure your shader has the `mainImage()` function

**Buttons not showing?**
- Check that `sketch.js` loaded correctly
- Look for JavaScript errors in the browser console

**Shader works in p5.js but not Ghostty?**
- Make sure you renamed `.frag` to `.glsl`
- Check Ghostty's error logs
- Verify the shader file was copied correctly

**Performance issues?**
- Reduce iterations in loops
- Simplify calculations
- Lower animation frame rate in Ghostty config

## File Extension Summary

- **Development (p5.js)**: Use `.frag` extension
- **Production (Ghostty)**: Rename to `.glsl` extension
- **Content**: Exactly the same in both cases!

Happy shader coding! 🎨
