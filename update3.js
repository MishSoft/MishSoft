const fs = require('fs');

const darkFile = 'dark.svg';
const lightFile = 'light.svg';
const photoFile = '1750613272896-removebg-preview.svg';

let photoSvg = fs.readFileSync(photoFile, 'utf8');

// Extract paths
let pathsMatch = photoSvg.match(/<path[\s\S]*?\/>/g);
let paths = pathsMatch ? pathsMatch.join('\n') : '';

let maskDef = `                    <mask id="photo-mask">
                        <rect x="-50" y="-50" width="500" height="500" fill="black" />
                        <g transform="translate(19, 410) scale(0.098, -0.098)" fill="white">
                            ${paths}
                        </g>
                    </mask>`;

let binaryLines = [];
let yOffset = 20;
for(let i=0; i<45; i++) {
    let line = '';
    for(let j=0; j<55; j++) {
        line += Math.random() > 0.5 ? '1' : '0';
    }
    binaryLines.push(`<tspan x="0" y="${yOffset}">${line}</tspan>`);
    yOffset += 10;
}
let binaryText = binaryLines.join('\n');

function processFile(file, panelColor) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Update the mask definition and text
    let regexMask = /<mask id="photo-mask">[\s\S]*?<\/text>\s*<\/g>/;
    
    let replacementMask = `${maskDef}
                    
                    <g mask="url(#photo-mask)">
                        <text class="ascii" fill="#FFFFFF" font-size="10" line-height="10">
${binaryText}
                        </text>
                    </g>`;
                    
    content = content.replace(regexMask, replacementMask);
    
    // Remove the Scanline completely
    let scanlineRegex = /\s*<!-- Scanline -->\s*<rect x="0" y="0" width="418" height="3" fill="rgba\(34,211,238,0\.3\)">\s*<animate attributeName="y" values="-10;540;-10" dur="4s" repeatCount="indefinite" \/>\s*<\/rect>/;
    content = content.replace(scanlineRegex, '');
    
    fs.writeFileSync(file, content);
}

processFile(darkFile, '#0F172A');
processFile(lightFile, '#F8FAFC');
console.log("Updated files to enlarge photo and remove scanline.");
