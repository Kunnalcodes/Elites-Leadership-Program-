import fs from 'fs';

const content = fs.readFileSync('e:/threads-elite/public/SilverSurfer.obj', 'utf8');
const lines = content.split('\n');

let minX = Infinity, maxX = -Infinity;
let minY = Infinity, maxY = -Infinity;
let minZ = Infinity, maxZ = -Infinity;

for (const line of lines) {
  if (line.startsWith('v ')) {
    const parts = line.trim().split(/\s+/).slice(1).map(Number);
    if (parts.length >= 3) {
      minX = Math.min(minX, parts[0]);
      maxX = Math.max(maxX, parts[0]);
      minY = Math.min(minY, parts[1]);
      maxY = Math.max(maxY, parts[1]);
      minZ = Math.min(minZ, parts[2]);
      maxZ = Math.max(maxZ, parts[2]);
    }
  }
}

console.log('Bounds:');
console.log(`X: [${minX.toFixed(2)}, ${maxX.toFixed(2)}] (size: ${(maxX - minX).toFixed(2)})`);
console.log(`Y: [${minY.toFixed(2)}, ${maxY.toFixed(2)}] (size: ${(maxY - minY).toFixed(2)})`);
console.log(`Z: [${minZ.toFixed(2)}, ${maxZ.toFixed(2)}] (size: ${(maxZ - minZ).toFixed(2)})`);
console.log(`Center: [${((minX+maxX)/2).toFixed(2)}, ${((minY+maxY)/2).toFixed(2)}, ${((minZ+maxZ)/2).toFixed(2)}]`);
