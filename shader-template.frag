// Ghostty Shader Template
// This is a minimal template for creating Ghostty-compatible shaders
// Copy this file to create your own shader!

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord / iResolution.xy;

    // Sample the terminal content
    vec4 terminalColor = texture(iChannel0, uv);

    // ============================================
    // YOUR SHADER CODE HERE
    // ============================================

    // Example: Add a subtle animated color overlay
    vec3 effect = vec3(
        0.5 + 0.5 * sin(iTime + uv.x * 3.0),
        0.5 + 0.5 * sin(iTime + uv.y * 3.0),
        0.5 + 0.5 * sin(iTime + (uv.x + uv.y) * 2.0)
    ) * 0.1; // Multiply by 0.1 for subtle effect

    // Blend with terminal content
    vec3 finalColor = terminalColor.rgb + effect;

    // ============================================
    // END YOUR SHADER CODE
    // ============================================

    // Output final color
    fragColor = vec4(finalColor, terminalColor.a);
}
