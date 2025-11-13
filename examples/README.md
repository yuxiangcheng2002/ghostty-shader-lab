# Ghostty Shader Examples

This folder contains pure Ghostty-format shaders that are ready to use in Ghostty terminal.

## Available Shaders

### starfield.glsl
Animated starfield effect with stars moving toward you. Creates a spacey background for your terminal.

**Features:**
- 21 layers of stars for depth
- Configurable star density and colors
- Respects terminal content (shows through dark areas)

**Usage:**
```bash
cp starfield.glsl ~/.config/ghostty/shaders/
```

Add to `~/.config/ghostty/config`:
```
custom-shader = ~/.config/ghostty/shaders/starfield.glsl
custom-shader-animation = always
```

### bettercrt.glsl
Classic CRT monitor effect without color tinting.

**Features:**
- Screen curvature (simulates curved glass)
- Scanlines (horizontal lines like old TVs)
- No color tint (preserves original colors)
- Adjustable warp and scan parameters

**Usage:**
```bash
cp bettercrt.glsl ~/.config/ghostty/shaders/
```

Add to `~/.config/ghostty/config`:
```
custom-shader = ~/.config/ghostty/shaders/bettercrt.glsl
```

### retro-terminal.glsl
Retro CRT effect with teal/green tint.

**Features:**
- Screen curvature
- Scanlines
- Teal/green color tint (classic retro terminal look)
- Adjustable warp and scan parameters

**Usage:**
```bash
cp retro-terminal.glsl ~/.config/ghostty/shaders/
```

Add to `~/.config/ghostty/config`:
```
custom-shader = ~/.config/ghostty/shaders/retro-terminal.glsl
```

## Combining Shaders

You can stack multiple shaders by repeating the `custom-shader` line:

```
# Starfield + CRT effect
custom-shader = ~/.config/ghostty/shaders/starfield.glsl
custom-shader = ~/.config/ghostty/shaders/bettercrt.glsl
custom-shader-animation = always
```

Shaders are applied in the order they're listed.

## Customizing Shaders

All shaders have parameters at the top that you can adjust:

**starfield.glsl:**
- `repeats` - Star density (default: 30)
- `layers` - Depth layers (default: 21)
- `threshold` - When to show stars vs terminal content (default: 0.15)

**bettercrt.glsl & retro-terminal.glsl:**
- `warp` - Screen curvature amount (default: 0.25)
- `scan` - Scanline darkness (default: 0.50)

Edit the shader file and adjust these values, then restart Ghostty to see changes.
