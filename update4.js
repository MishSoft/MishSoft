const fs = require('fs');

const darkFile = 'dark.svg';
const lightFile = 'light.svg';

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove LEFT PANEL
    let leftPanelRegex = /\s*<!-- LEFT PANEL \(ASCII\) -->[\s\S]*?<!-- RIGHT PANEL -->/;
    content = content.replace(leftPanelRegex, '\n            <!-- RIGHT PANEL -->');
    
    // Expand RIGHT PANEL
    content = content.replace(/<g transform="translate\(442, 0\)">/, '<g transform="translate(0, 0)">');
    content = content.replace(/width="658"/g, 'width="1100"');
    
    // Terminal Header Path
    content = content.replace(/L614 0 Q658 0 658 44 L658 44 L0 44 Z/g, 'L1056 0 Q1100 0 1100 44 L1100 44 L0 44 Z');
    content = content.replace(/L658 44" stroke=/g, 'L1100 44" stroke=');
    
    // Terminal Title centering (329 to 550)
    content = content.replace(/x="329"/g, 'x="550"');
    
    // Add more padding to content
    content = content.replace(/<g transform="translate\(44, 90\)">/g, '<g transform="translate(80, 90)">');
    
    fs.writeFileSync(file, content);
}

processFile(darkFile);
processFile(lightFile);
console.log("Removed left panel and expanded terminal to full width.");
