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
                        <g transform="translate(10, 360) scale(0.085, -0.085)" fill="white">
                            ${paths}
                        </g>
                    </mask>`;

let binaryLines = [];
let yOffset = 20;
for(let i=0; i<38; i++) {
    let line = '';
    for(let j=0; j<45; j++) {
        line += Math.random() > 0.5 ? '1' : '0';
    }
    binaryLines.push(`<tspan x="0" y="${yOffset}">${line}</tspan>`);
    yOffset += 10;
}
let binaryText = binaryLines.join('\n');

function processFile(file, panelColor) {
    let content = fs.readFileSync(file, 'utf8');
    
    // The previous structure had:
    // <clipPath id="photo-clip"> ... </clipPath>
    // <g clip-path="url(#photo-clip)"> ... </g>
    
    let regex = /<clipPath id="photo-clip">[\s\S]*?<\/g>\s*<!-- ASCII Reveal -->/;
    
    let replacement = `${maskDef}
                    
                    <g mask="url(#photo-mask)">
                        <text class="ascii" fill="#FFFFFF" font-size="10" line-height="10">
${binaryText}
                        </text>
                    </g>
                    
                    <!-- ASCII Reveal -->`;
                    
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
}

processFile(darkFile, '#0F172A');
processFile(lightFile, '#F8FAFC');
console.log("Updated masks.");
