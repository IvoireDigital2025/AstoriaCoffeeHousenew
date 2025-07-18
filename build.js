import { promises as fs } from 'fs';
import path from 'path';

// For production on Render, we use the production.js server directly
// Copy production.js to dist/index.js
await fs.copyFile('server/production.js', 'dist/index.js');

console.log('Production server build complete!');