const fs = require('fs');

const darkFile = 'dark.svg';
const lightFile = 'light.svg';
const photoFile = '1750613272896-removebg-preview.svg';

let photoSvg = fs.readFileSync(photoFile, 'utf8');

// Extract paths
let pathsMatch = photoSvg.match(/<path[\s\S]*?\/>/g);
let paths = pathsMatch ? pathsMatch.join('\n') : '';

let clipPathDef = `                    <clipPath id="photo-clip">
                        <g transform="translate(20, 360) scale(0.08, -0.08)">
                            ${paths}
                        </g>
                    </clipPath>`;

let binaryLines = [];
let yOffset = 0;
for(let i=0; i<35; i++) {
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
    
    // Replace URL
    content = content.replace(/https:\/\/misho\.dev/g, 'https://mishodev.vercel.app/');
    
    // Replace Email
    content = content.replace(/hello@misho\.dev/g, 'mishikoaspanidze1999@gmail.com');
    
    // Replace Icon Links
    content = content.replace(/href="#"/g, 'href="https://mishodev.vercel.app/"');
    
    let newAsciiBlock = `                <!-- Floating ASCII (Photo) -->
                <g transform="translate(40, 70)">
                    <animateTransform attributeName="transform" type="translate" values="40,70; 40,60; 40,70" dur="6s" repeatCount="indefinite" />
                    
${clipPathDef}
                    
                    <g clip-path="url(#photo-clip)">
                        <text class="ascii" fill="#FFFFFF" font-size="10" line-height="10">
${binaryText}
                        </text>
                    </g>
                    
                    <!-- ASCII Reveal -->
                    <rect x="-20" y="-20" width="360" height="400" fill="${panelColor}">
                        <animate attributeName="height" values="400;0" dur="3s" fill="freeze" />
                    </rect>
                </g>`;

    let asciiRegex = /<!-- Floating ASCII -->[\s\S]*?<\/g>\s*<!-- Scanline -->/;
    
    content = content.replace(asciiRegex, newAsciiBlock + '\n\n                <!-- Scanline -->');
    
    fs.writeFileSync(file, content);
}

processFile(darkFile, '#0F172A');
processFile(lightFile, '#F8FAFC');
console.log("Updated SVG files.");
