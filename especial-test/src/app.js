/**
 * Pastel Color Generator Logic
 */

// Helper to generate a random pastel color using HSL
// Pastels have high lightness (75-85%) and medium/high saturation (70-85%)
function generatePastelColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 15) + 70; // 70% to 85%
    const lightness = Math.floor(Math.random() * 10) + 75;  // 75% to 85%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Helper to parse HSL values from string format "hsl(H, S%, L%)"
function parseHsl(hslStr) {
    const matches = hslStr.match(/\d+/g);
    if (matches && matches.length >= 3) {
        return {
            h: parseInt(matches[0]),
            s: parseInt(matches[1]),
            l: parseInt(matches[2])
        };
    }
    return { h: 0, s: 70, l: 80 };
}

// Convert HSL to HEX format
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Convert HSL to RGB string format "R, G, B" for dropshadow styling
function hslToRgbString(hslStr) {
    const { h, s, l } = parseHsl(hslStr);
    const sPct = s / 100;
    const lPct = l / 100;
    const c = (1 - Math.abs(2 * lPct - 1)) * sPct;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = lPct - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
        r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
        r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
        r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
        r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
        r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
        r = c; g = 0; b = x;
    }
    
    return `${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}`;
}

// Function to regenerate colors for all boxes
function updateColors() {
    const boxes = document.querySelectorAll('.color-box');
    
    boxes.forEach((box) => {
        const pastelColor = generatePastelColor();
        const preview = box.querySelector('.color-preview');
        const hexDisplay = box.querySelector('.color-hex');
        
        // Update background color with ease transition (handled in CSS)
        preview.style.backgroundColor = pastelColor;
        
        // Add dynamic colored glow to the box preview
        const rgbString = hslToRgbString(pastelColor);
        preview.style.boxShadow = `0 12px 30px rgba(${rgbString}, 0.25), 0 4px 10px rgba(${rgbString}, 0.15)`;
        
        // Update Hex Display text
        const { h, s, l } = parseHsl(pastelColor);
        hexDisplay.textContent = hslToHex(h, s, l);
    });
}

// Setup events
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn-change');
    if (btn) {
        btn.addEventListener('click', () => {
            // Button scale effect micro-animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 100);
            
            updateColors();
        });
    }
    
    // Initial color generation
    updateColors();
});
