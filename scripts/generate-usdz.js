/**
 * Generates lightweight Apple Quick Look USDZ archives (uncompressed zip)
 * for iOS Safari native Augmented Reality.
 */

const fs = require('fs');
const path = require('path');

// Helper to create an uncompressed ZIP archive (USDZ is a plain ZIP with compression method 0 = STORE)
function createUncompressedZip(entries) {
  const fileHeaders = [];
  const centralDirHeaders = [];
  let offset = 0;

  for (const entry of entries) {
    const filenameBuf = Buffer.from(entry.name, 'utf8');
    const dataBuf = Buffer.from(entry.data);
    const crc = crc32(dataBuf);

    // Local file header: 30 bytes + filename
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // min version
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(0, 8); // compression: 0 = STORE (uncompressed)
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(crc, 14); // crc32
    localHeader.writeUInt32LE(dataBuf.length, 18); // compressed size
    localHeader.writeUInt32LE(dataBuf.length, 22); // uncompressed size
    localHeader.writeUInt16LE(filenameBuf.length, 26); // filename length
    localHeader.writeUInt16LE(0, 28); // extra field length

    const fileRecord = Buffer.concat([localHeader, filenameBuf, dataBuf]);
    fileHeaders.push(fileRecord);

    // Central directory header: 46 bytes + filename
    const cdHeader = Buffer.alloc(46);
    cdHeader.writeUInt32LE(0x02014b50, 0); // signature
    cdHeader.writeUInt16LE(20, 4); // version made by
    cdHeader.writeUInt16LE(20, 6); // version needed
    cdHeader.writeUInt16LE(0, 8); // flags
    cdHeader.writeUInt16LE(0, 10); // compression 0
    cdHeader.writeUInt16LE(0, 12); // mod time
    cdHeader.writeUInt16LE(0, 14); // mod date
    cdHeader.writeUInt32LE(crc, 16); // crc32
    cdHeader.writeUInt32LE(dataBuf.length, 20); // compressed size
    cdHeader.writeUInt32LE(dataBuf.length, 24); // uncompressed size
    cdHeader.writeUInt16LE(filenameBuf.length, 28); // filename length
    cdHeader.writeUInt16LE(0, 30); // extra field length
    cdHeader.writeUInt16LE(0, 32); // comment length
    cdHeader.writeUInt16LE(0, 34); // disk number start
    cdHeader.writeUInt16LE(0, 36); // internal attrs
    cdHeader.writeUInt32LE(0, 38); // external attrs
    cdHeader.writeUInt32LE(offset, 42); // relative offset of local header

    centralDirHeaders.push(Buffer.concat([cdHeader, filenameBuf]));
    offset += fileRecord.length;
  }

  const allFileRecords = Buffer.concat(fileHeaders);
  const allCdRecords = Buffer.concat(centralDirHeaders);

  // End of central directory record (22 bytes)
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // signature
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk where cd starts
  eocd.writeUInt16LE(entries.length, 8); // num of cd entries on disk
  eocd.writeUInt16LE(entries.length, 10); // total num of cd entries
  eocd.writeUInt32LE(allCdRecords.length, 12); // size of central directory
  eocd.writeUInt32LE(allFileRecords.length, 16); // offset of start of central directory
  eocd.writeUInt16LE(0, 20); // zip comment length

  return Buffer.concat([allFileRecords, allCdRecords, eocd]);
}

// Simple CRC-32 table computation
function crc32(buf) {
  let crc = 0 ^ -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const CRC_TABLE = new Int32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  CRC_TABLE[i] = c;
}

// ─────────────────────────────────────────────────────────────────────────────
// USDA Generators
// ─────────────────────────────────────────────────────────────────────────────

function generatePlankUsda() {
  return `#usda 1.0
(
    defaultPrim = "Plank"
    metersPerUnit = 1.0
    upAxis = "Y"
)

def Xform "Plank" (
    assetInfo = {
        string name = "MarvelRise SPC Plank"
    }
)
{
    def Cube "Mesh"
    {
        double size = 1.0
        matrix4d xformOp:transform = ( (1.22, 0, 0, 0), (0, 0.008, 0, 0), (0, 0, 0.18, 0), (0, 0.004, 0, 1) )
        uniform token[] xformOpOrder = ["xformOp:transform"]
        
        color3f[] primvars:displayColor = [(0.72, 0.54, 0.38)]
    }
}
`;
}

function generateLampshadeUsda() {
  return `#usda 1.0
(
    defaultPrim = "Lampshade"
    metersPerUnit = 1.0
    upAxis = "Y"
)

def Xform "Lampshade" (
    assetInfo = {
        string name = "MarvelRise MRDP Lampshade"
    }
)
{
    def Cylinder "Pendant"
    {
        double height = 0.38
        double radius = 0.20
        matrix4d xformOp:transform = ( (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 1.7, 0, 1) )
        uniform token[] xformOpOrder = ["xformOp:transform"]
        
        color3f[] primvars:displayColor = [(0.94, 0.90, 0.82)]
    }
}
`;
}

function generateVaseUsda() {
  return `#usda 1.0
(
    defaultPrim = "Vase"
    metersPerUnit = 1.0
    upAxis = "Y"
)

def Xform "Vase" (
    assetInfo = {
        string name = "MarvelRise Atelier Vase"
    }
)
{
    def Cylinder "Body"
    {
        double height = 0.45
        double radius = 0.12
        matrix4d xformOp:transform = ( (1, 0, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (0, 0.225, 0, 1) )
        uniform token[] xformOpOrder = ["xformOp:transform"]
        
        color3f[] primvars:displayColor = [(0.18, 0.20, 0.24)]
    }
}
`;
}

function generateWpcUsda() {
  return `#usda 1.0
(
    defaultPrim = "WpcPanel"
    metersPerUnit = 1.0
    upAxis = "Y"
)

def Xform "WpcPanel" (
    assetInfo = {
        string name = "MarvelRise WPC Panel"
    }
)
{
    def Cube "Panel"
    {
        double size = 1.0
        matrix4d xformOp:transform = ( (0.30, 0, 0, 0), (0, 0.90, 0, 0), (0, 0, 0.02, 0), (0, 0.45, 0, 1) )
        uniform token[] xformOpOrder = ["xformOp:transform"]
        
        color3f[] primvars:displayColor = [(0.42, 0.28, 0.18)]
    }
}
`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Build USDZ files
// ─────────────────────────────────────────────────────────────────────────────

const outDir = path.join(__dirname, '..', 'public', 'models');

const models = [
  { name: 'spc-flooring-plank.usdz', usdaName: 'plank.usda', usda: generatePlankUsda() },
  { name: 'lampshade-pendant.usdz', usdaName: 'lampshade.usda', usda: generateLampshadeUsda() },
  { name: 'decor-vase-sculpture.usdz', usdaName: 'vase.usda', usda: generateVaseUsda() },
  { name: 'wpc-fluted-panel.usdz', usdaName: 'wpc.usda', usda: generateWpcUsda() },
];

console.log("Generating Apple Quick Look USDZ assets...");

for (const m of models) {
  const zip = createUncompressedZip([{ name: m.usdaName, data: m.usda }]);
  fs.writeFileSync(path.join(outDir, m.name), zip);
  console.log(`✓ Generated: ${m.name} (${(zip.length / 1024).toFixed(1)} KB)`);
}

console.log("All USDZ assets generated successfully in public/models/.");

