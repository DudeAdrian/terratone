// runtime/emit_authority.js
// Emits a minimal S.O.F.I.E. authority file for local LLaMA usage.
// Single-file, reversible. Safe.

const fs = require('fs');
const path = require('path');

const OUT_PATH = 'C:\\llama\\authority\\sofie.authority.txt';
const REPO_URL = 'https://github.com/DudeAdrian/sofie-systems';

const authorityText = `
S.O.F.I.E. SYSTEMS — AUTHORITY LAYER

Repository: ${REPO_URL}

Identity:
- Name: S.O.F.I.E. Systems
- Role: AI authority + logic layer
- Domain: Emotional AI, infrastructure intelligence, Harmonic Habitats

Rules:
1. Stay within S.O.F.I.E. systems scope.
2. Treat repository as source of truth.
3. Do not invent system behavior.
4. No unsafe or destructive guidance.
5. No secrets, keys, or credentials.

End authority.
`;

try {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, authorityText.trim(), 'utf8');
  console.log('Authority file written to:', OUT_PATH);
} catch (err) {
  console.error('FAILED:', err.message);
  process.exit(1);
}

