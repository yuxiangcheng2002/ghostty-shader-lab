# Ghostty Shader Lab

A p5.js framework for creating and previewing Ghostty-compatible GLSL shaders.

Write shaders in pure Ghostty format (`.glsl` files) and preview them in real-time with p5.js!

## Features

- **Pure `.glsl` format** - Write shaders exactly as they'll run in Ghostty
- **Instant preview** - See your shader running in real-time in the browser
- **Interactive UI** - Click buttons to switch between shaders
- **No conversion needed** - Same file works in p5.js and Ghostty
- **Minimal setup** - Just like p5.js web editor
- **Example shaders included** - Learn from working examples

## Credits

Example shaders sourced from:
- [0xhckr/ghostty-shaders](https://github.com/0xhckr/ghostty-shaders) - bettercrt.glsl, retro-terminal.glsl
- [m-ahdal/ghostty-shaders](https://github.com/m-ahdal/ghostty-shaders) - starfield.glsl

## Project Structure

```
ghostty-shader-lab/
├── index.html            # Minimal HTML file
├── sketch.js             # P5.js code (handles conversion + UI)
├── starfield.glsl        # Animated starfield shader
├── bettercrt.glsl        # CRT effect shader
├── retro-terminal.glsl   # Retro CRT with teal tint
├── shader-template.glsl  # Template for creating new shaders
└── README.md             # This file
```

## Quick Start

### 1. Open the Lab

```bash
cd ~/Desktop/ghostty-shader-lab
open index.html
```

You'll see:
- The starfield shader running with simulated terminal text
- Buttons on the left to switch between shaders

### 2. Try Different Shaders

Click the buttons to preview different shaders:
- **Starfield** - Animated stars moving toward you
- **Better CRT** - Classic CRT monitor effect
- **Retro Terminal** - CRT with green/teal tint
- **Template** - Minimal starting point

### 3. Create Your Own Shader

```bash
cp shader-template.glsl my-shader.glsl
# Edit my-shader.glsl with your effect
```

To preview your new shader, add it to the `SHADERS` array in `sketch.js`:

```javascript
const SHADERS = [
  { name: 'Starfield', file: 'starfield.glsl' },
  { name: 'Better CRT', file: 'bettercrt.glsl' },
  { name: 'Retro Terminal', file: 'retro-terminal.glsl' },
  { name: 'Template', file: 'shader-template.glsl' },
  { name: 'My Shader', file: 'my-shader.glsl' }  // Add yours here!
];
```

Refresh the browser and you'll see a new button!

### 4. Use in Ghostty

When you're happy with your shader:

```bash
# Copy to Ghostty shaders folder
cp my-shader.glsl ~/.config/ghostty/shaders/
```

Add to `~/.config/ghostty/config`:
```
custom-shader = ~/.config/ghostty/shaders/my-shader.glsl
custom-shader-animation = true
```

Restart Ghostty. Done!

## How It Works

### Pure Ghostty Format

Your `.glsl` files use the exact format Ghostty expects:

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord / iResolution.xy;
    vec4 terminalColor = texture(iChannel0, uv);

    // Your shader effect here

    fragColor = vec4(color, terminalColor.a);
}
```

### Automatic Conversion

The `sketch.js` file automatically:
- Adds p5.js-specific headers
- Converts `texture()` to `texture2D()` for p5.js
- Wraps your shader in the required p5.js format
- Creates interactive buttons to switch shaders
- Handles all the boilerplate

**You never need to modify your `.glsl` files for p5.js!**

### Available Uniforms (Ghostty-compatible)

- `iTime` - Time in seconds (for animations)
- `iResolution` - Screen resolution as vec2(width, height)
- `iChannel0` - Terminal content texture (sampler2D)

## Workflow

```
1. Edit shader.glsl (pure Ghostty format)
   ↓
2. Click button in browser to preview
   ↓
3. Iterate until perfect
   ↓
4. Copy shader.glsl directly to Ghostty
   ↓
5. Done! No conversion needed!
```

## Tips

- **Animation**: Use `iTime` for time-based effects
- **Terminal content**: Sample `iChannel0` to see/blend with terminal text
- **Quick switching**: Use the buttons to compare different effects
- **Performance**: Keep shaders simple - they run on every frame
- **New shaders**: Add them to the `SHADERS` array in `sketch.js` to get a button

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

## Adding New Shaders to the UI

1. Create your shader file (e.g., `cool-effect.glsl`)
2. Edit `sketch.js` and add to the `SHADERS` array:
   ```javascript
   const SHADERS = [
     { name: 'Starfield', file: 'starfield.glsl' },
     { name: 'Better CRT', file: 'bettercrt.glsl' },
     { name: 'Retro Terminal', file: 'retro-terminal.glsl' },
     { name: 'Cool Effect', file: 'cool-effect.glsl' }  // Your shader
   ];
   ```
3. Refresh the browser - you'll see a new button!

## Troubleshooting

**Shader not loading?**
- Check the browser console for errors
- Make sure the file name in `SHADERS` array matches the actual file
- Ensure your shader has the `mainImage()` function

**Buttons not showing?**
- Check that `sketch.js` loaded correctly
- Look for JavaScript errors in the browser console

**Shader works in p5.js but not Ghostty?**
- This shouldn't happen! The format is identical
- Check Ghostty's error logs
- Verify the shader file was copied correctly

**Performance issues?**
- Reduce iterations in loops
- Simplify calculations
- Lower animation frame rate in Ghostty config

Happy shader coding! 🎨
