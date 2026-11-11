/**
 * Generates lightweight, fully-compliant binary glTF (GLB 2.0) 3D assets
 * for MarvelRise Decor AR visualization (WebXR / QuickLook).
 *
 * Models created:
 * 1. spc-flooring-plank.glb — Scaled click-lock plank (1.22m x 0.18m x 0.008m) with warm oak PBR
 * 2. lampshade-pendant.glb — Fluted cylindrical pendant lampshade with suspension cord & glow
 * 3. decor-vase-sculpture.glb — Modern faceted ceramic artifact with matte slate finish
 * 4. wpc-fluted-panel.glb — Architectural ribbed fluted slat wall panel sample (0.3m x 0.9m)
 */

const fs = require('fs');
const path = require('path');

function createGLB({ vertices, normals, uvs, indices, material, name }) {
  // 1. Pack binary buffer
  // Calculate component sizes
  const posCount = vertices.length / 3;
  const indCount = indices.length;

  // Vertex buffer: [x,y,z, nx,ny,nz, u,v] per vertex
  const vertexData = Buffer.alloc(posCount * (3 + 3 + 2) * 4);
  let vOffset = 0;

  // Calculate min/max for position
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < posCount; i++) {
    const x = vertices[i * 3];
    const y = vertices[i * 3 + 1];
    const z = vertices[i * 3 + 2];

    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;

    // Position
    vertexData.writeFloatLE(x, vOffset); vOffset += 4;
    vertexData.writeFloatLE(y, vOffset); vOffset += 4;
    vertexData.writeFloatLE(z, vOffset); vOffset += 4;

    // Normal
    vertexData.writeFloatLE(normals[i * 3] || 0, vOffset); vOffset += 4;
    vertexData.writeFloatLE(normals[i * 3 + 1] || 1, vOffset); vOffset += 4;
    vertexData.writeFloatLE(normals[i * 3 + 2] || 0, vOffset); vOffset += 4;

    // UV
    vertexData.writeFloatLE(uvs[i * 2] || 0, vOffset); vOffset += 4;
    vertexData.writeFloatLE(uvs[i * 2 + 1] || 0, vOffset); vOffset += 4;
  }

  // Index buffer: UNSIGNED_SHORT
  const indexData = Buffer.alloc(indCount * 2);
  let minIndex = Infinity, maxIndex = -Infinity;
  for (let i = 0; i < indCount; i++) {
    const idx = indices[i];
    if (idx < minIndex) minIndex = idx;
    if (idx > maxIndex) maxIndex = idx;
    indexData.writeUInt16LE(idx, i * 2);
  }

  // Pad vertex buffer to 4 bytes
  const vertexPadding = (4 - (vertexData.length % 4)) % 4;
  const paddedVertexData = Buffer.concat([vertexData, Buffer.alloc(vertexPadding)]);

  // Pad index buffer to 4 bytes
  const indexPadding = (4 - (indexData.length % 4)) % 4;
  const paddedIndexData = Buffer.concat([indexData, Buffer.alloc(indexPadding)]);

  const binBuffer = Buffer.concat([paddedVertexData, paddedIndexData]);

  const vertexByteLength = vertexData.length;
  const indexByteOffset = paddedVertexData.length;
  const indexByteLength = indexData.length;

  const gltf = {
    asset: {
      version: "2.0",
      generator: "MarvelRise Decor AR Asset Pipeline v1.0",
    },
    scene: 0,
    scenes: [{ name: "Scene", nodes: [0] }],
    nodes: [{ name: name || "Node", mesh: 0 }],
    materials: [
      {
        name: material.name || "Material",
        pbrMetallicRoughness: {
          baseColorFactor: material.baseColorFactor || [0.8, 0.6, 0.4, 1.0],
          metallicFactor: material.metallicFactor !== undefined ? material.metallicFactor : 0.05,
          roughnessFactor: material.roughnessFactor !== undefined ? material.roughnessFactor : 0.55,
        },
        emissiveFactor: material.emissiveFactor || [0, 0, 0],
        doubleSided: true,
      },
    ],
    meshes: [
      {
        name: name || "Mesh",
        primitives: [
          {
            attributes: {
              POSITION: 0,
              NORMAL: 1,
              TEXCOORD_0: 2,
            },
            indices: 3,
            material: 0,
            mode: 4, // TRIANGLES
          },
        ],
      },
    ],
    accessors: [
      {
        // 0: POSITION
        bufferView: 0,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: posCount,
        type: "VEC3",
        max: [maxX, maxY, maxZ],
        min: [minX, minY, minZ],
      },
      {
        // 1: NORMAL
        bufferView: 0,
        byteOffset: 12,
        componentType: 5126, // FLOAT
        count: posCount,
        type: "VEC3",
      },
      {
        // 2: TEXCOORD_0
        bufferView: 0,
        byteOffset: 24,
        componentType: 5126, // FLOAT
        count: posCount,
        type: "VEC2",
      },
      {
        // 3: INDICES
        bufferView: 1,
        byteOffset: 0,
        componentType: 5123, // UNSIGNED_SHORT
        count: indCount,
        type: "SCALAR",
        max: [maxIndex],
        min: [minIndex],
      },
    ],
    bufferViews: [
      {
        // 0: Vertices (Position + Normal + UV interleaved)
        buffer: 0,
        byteOffset: 0,
        byteLength: vertexByteLength,
        byteStride: 32, // (3 + 3 + 2) * 4
        target: 34962, // ARRAY_BUFFER
      },
      {
        // 1: Indices
        buffer: 0,
        byteOffset: indexByteOffset,
        byteLength: indexByteLength,
        target: 34963, // ELEMENT_ARRAY_BUFFER
      },
    ],
    buffers: [
      {
        byteLength: binBuffer.length,
      },
    ],
  };

  const jsonStr = JSON.stringify(gltf);
  const jsonBuffer = Buffer.from(jsonStr, 'utf8');

  // JSON chunk must be padded with spaces (0x20) to a 4-byte boundary
  const jsonPadding = (4 - (jsonBuffer.length % 4)) % 4;
  const paddedJsonBuffer = Buffer.concat([
    jsonBuffer,
    Buffer.alloc(jsonPadding, 0x20),
  ]);

  // BIN chunk must be padded with null bytes (0x00) to 4-byte boundary
  const binPadding = (4 - (binBuffer.length % 4)) % 4;
  const paddedBinBuffer = Buffer.concat([
    binBuffer,
    Buffer.alloc(binPadding, 0x00),
  ]);

  // Total GLB size:
  // 12 bytes header + 8 bytes (chunk 0 header) + json len + 8 bytes (chunk 1 header) + bin len
  const totalLength =
    12 + 8 + paddedJsonBuffer.length + 8 + paddedBinBuffer.length;

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // 'glTF'
  header.writeUInt32LE(2, 4); // version 2
  header.writeUInt32LE(totalLength, 8);

  const chunk0Header = Buffer.alloc(8);
  chunk0Header.writeUInt32LE(paddedJsonBuffer.length, 0);
  chunk0Header.writeUInt32LE(0x4e4f534a, 4); // 'JSON'

  const chunk1Header = Buffer.alloc(8);
  chunk1Header.writeUInt32LE(paddedBinBuffer.length, 0);
  chunk1Header.writeUInt32LE(0x004e4942, 4); // 'BIN\0'

  return Buffer.concat([
    header,
    chunk0Header,
    paddedJsonBuffer,
    chunk1Header,
    paddedBinBuffer,
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Geometry Builders
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. SPC Flooring Plank: 1.22m long, 0.18m wide, 0.008m high, sits flush on floor (Y=0)
 */
function buildPlankGeometry(length = 1.22, width = 0.18, height = 0.008) {
  const hx = length / 2;
  const hy = height;
  const hz = width / 2;

  // Box vertices (6 faces * 4 vertices = 24 vertices)
  const v = [];
  const n = [];
  const uv = [];
  const ind = [];

  const addFace = (p0, p1, p2, p3, norm) => {
    const base = v.length / 3;
    v.push(...p0, ...p1, ...p2, ...p3);
    n.push(...norm, ...norm, ...norm, ...norm);
    uv.push(0, 0, 1, 0, 1, 1, 0, 1);
    ind.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };

  // Top (+Y)
  addFace([-hx, hy, -hz], [hx, hy, -hz], [hx, hy, hz], [-hx, hy, hz], [0, 1, 0]);
  // Bottom (-Y)
  addFace([-hx, 0, hz], [hx, 0, hz], [hx, 0, -hz], [-hx, 0, -hz], [0, -1, 0]);
  // Front (+Z)
  addFace([-hx, 0, hz], [hx, 0, hz], [hx, hy, hz], [-hx, hy, hz], [0, 0, 1]);
  // Back (-Z)
  addFace([hx, 0, -hz], [-hx, 0, -hz], [-hx, hy, -hz], [hx, hy, -hz], [0, 0, -1]);
  // Right (+X)
  addFace([hx, 0, hz], [hx, 0, -hz], [hx, hy, -hz], [hx, hy, hz], [1, 0, 0]);
  // Left (-X)
  addFace([-hx, 0, -hz], [-hx, 0, hz], [-hx, hy, hz], [-hx, hy, -hz], [-1, 0, 0]);

  return { vertices: v, normals: n, uvs: uv, indices: ind };
}

/**
 * 2. Lampshade Pendant: Fluted cylinder / pleated cone suspended in air
 */
function buildLampshadeGeometry(topR = 0.14, bottomR = 0.22, height = 0.38, segments = 24) {
  const v = [];
  const n = [];
  const uv = [];
  const ind = [];

  const startY = 1.6; // Suspended at standard ceiling height in AR

  // Outer pleated cone
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    // Pleat modulation
    const pleat = (i % 2 === 0 ? 0.015 : -0.015);
    const rT = topR + pleat;
    const rB = bottomR + pleat;

    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    // Top ring
    v.push(cos * rT, startY + height, sin * rT);
    n.push(cos, 0.2, sin);
    uv.push(i / segments, 1);

    // Bottom ring
    v.push(cos * rB, startY, sin * rB);
    n.push(cos, 0.2, sin);
    uv.push(i / segments, 0);
  }

  for (let i = 0; i < segments; i++) {
    const t0 = i * 2;
    const b0 = i * 2 + 1;
    const t1 = (i + 1) * 2;
    const b1 = (i + 1) * 2 + 1;

    ind.push(t0, b0, b1);
    ind.push(t0, b1, t1);
  }

  // Suspension Cord: thin vertical line from startY + height up to startY + height + 0.6m
  const cordBase = v.length / 3;
  const cordR = 0.005;
  const cordTopY = startY + height + 0.5;

  for (let i = 0; i < 6; i++) {
    const th = (i / 6) * Math.PI * 2;
    const cx = Math.cos(th) * cordR;
    const cz = Math.sin(th) * cordR;

    v.push(cx, cordTopY, cz);
    n.push(cx, 0, cz);
    uv.push(i / 6, 1);

    v.push(cx, startY + height, cz);
    n.push(cx, 0, cz);
    uv.push(i / 6, 0);
  }

  for (let i = 0; i < 5; i++) {
    const t0 = cordBase + i * 2;
    const b0 = cordBase + i * 2 + 1;
    const t1 = cordBase + (i + 1) * 2;
    const b1 = cordBase + (i + 1) * 2 + 1;

    ind.push(t0, b0, b1);
    ind.push(t0, b1, t1);
  }

  return { vertices: v, normals: n, uvs: uv, indices: ind };
}

/**
 * 3. Sculptural Ceramic Vase / Artifact
 */
function buildVaseGeometry(height = 0.45, segments = 16) {
  const v = [];
  const n = [];
  const uv = [];
  const ind = [];

  // Profile curve along Y: [y, radius]
  const profile = [
    [0.0, 0.08],
    [0.08, 0.14],
    [0.20, 0.16],
    [0.32, 0.09],
    [0.42, 0.07],
    [height, 0.085],
  ];

  for (let p = 0; p < profile.length; p++) {
    const [y, r] = profile[p];
    for (let s = 0; s <= segments; s++) {
      const th = (s / segments) * Math.PI * 2;
      const x = Math.cos(th) * r;
      const z = Math.sin(th) * r;

      v.push(x, y, z);
      n.push(Math.cos(th), 0.1, Math.sin(th));
      uv.push(s / segments, y / height);
    }
  }

  const ringVerts = segments + 1;
  for (let p = 0; p < profile.length - 1; p++) {
    const r0 = p * ringVerts;
    const r1 = (p + 1) * ringVerts;
    for (let s = 0; s < segments; s++) {
      const v00 = r0 + s;
      const v01 = r0 + s + 1;
      const v10 = r1 + s;
      const v11 = r1 + s + 1;

      ind.push(v00, v10, v11);
      ind.push(v00, v11, v01);
    }
  }

  return { vertices: v, normals: n, uvs: uv, indices: ind };
}

/**
 * 4. WPC Fluted Wall Panel Slat Sample: 0.3m wide, 0.9m high with 4 fluted ribs
 */
function buildWpcPanelGeometry(width = 0.30, height = 0.90, thickness = 0.02) {
  const v = [];
  const n = [];
  const uv = [];
  const ind = [];

  const addQuad = (p0, p1, p2, p3, norm) => {
    const base = v.length / 3;
    v.push(...p0, ...p1, ...p2, ...p3);
    n.push(...norm, ...norm, ...norm, ...norm);
    uv.push(0, 0, 1, 0, 1, 1, 0, 1);
    ind.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };

  const ribCount = 4;
  const ribWidth = (width / ribCount) * 0.65;
  const ribGap = (width / ribCount) * 0.35;
  const ribDepth = 0.015;

  // Base backboard
  addQuad([-width / 2, 0, 0], [width / 2, 0, 0], [width / 2, height, 0], [-width / 2, height, 0], [0, 0, 1]);

  // Ribs
  for (let i = 0; i < ribCount; i++) {
    const leftX = -width / 2 + i * (ribWidth + ribGap) + ribGap / 2;
    const rightX = leftX + ribWidth;

    // Front face of rib
    addQuad([leftX, 0, ribDepth], [rightX, 0, ribDepth], [rightX, height, ribDepth], [leftX, height, ribDepth], [0, 0, 1]);
    // Left side of rib
    addQuad([leftX, 0, 0], [leftX, 0, ribDepth], [leftX, height, ribDepth], [leftX, height, 0], [-1, 0, 0]);
    // Right side of rib
    addQuad([rightX, 0, ribDepth], [rightX, 0, 0], [rightX, height, 0], [rightX, height, ribDepth], [1, 0, 0]);
  }

  return { vertices: v, normals: n, uvs: uv, indices: ind };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Build Execution
// ─────────────────────────────────────────────────────────────────────────────

const outDir = path.join(__dirname, '..', 'public', 'models');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("Generating MarvelRise Decor AR GLB 2.0 assets...");

// 1. SPC Flooring Plank
const plankGeom = buildPlankGeometry();
const plankGLB = createGLB({
  ...plankGeom,
  name: "MarvelRise_SPC_Plank",
  material: {
    name: "Natural_Oak_Finish",
    baseColorFactor: [0.72, 0.54, 0.38, 1.0], // French Oak wood tone
    metallicFactor: 0.02,
    roughnessFactor: 0.68,
  },
});
fs.writeFileSync(path.join(outDir, 'spc-flooring-plank.glb'), plankGLB);
console.log(`✓ Generated: spc-flooring-plank.glb (${(plankGLB.length / 1024).toFixed(1)} KB)`);

// 2. Lampshade Pendant
const lampGeom = buildLampshadeGeometry();
const lampGLB = createGLB({
  ...lampGeom,
  name: "MarvelRise_MRDP_Lampshade",
  material: {
    name: "Pleated_Polyester_WarmGlow",
    baseColorFactor: [0.94, 0.90, 0.82, 1.0],
    emissiveFactor: [0.35, 0.28, 0.15], // Warm ambient interior glow
    metallicFactor: 0.05,
    roughnessFactor: 0.75,
  },
});
fs.writeFileSync(path.join(outDir, 'lampshade-pendant.glb'), lampGLB);
console.log(`✓ Generated: lampshade-pendant.glb (${(lampGLB.length / 1024).toFixed(1)} KB)`);

// 3. Decor Vase
const vaseGeom = buildVaseGeometry();
const vaseGLB = createGLB({
  ...vaseGeom,
  name: "MarvelRise_Atelier_Vase",
  material: {
    name: "Matte_Charcoal_Ceramic",
    baseColorFactor: [0.18, 0.20, 0.24, 1.0],
    metallicFactor: 0.15,
    roughnessFactor: 0.45,
  },
});
fs.writeFileSync(path.join(outDir, 'decor-vase-sculpture.glb'), vaseGLB);
console.log(`✓ Generated: decor-vase-sculpture.glb (${(vaseGLB.length / 1024).toFixed(1)} KB)`);

// 4. WPC Fluted Panel
const wpcGeom = buildWpcPanelGeometry();
const wpcGLB = createGLB({
  ...wpcGeom,
  name: "MarvelRise_WPC_Fluted_Slat",
  material: {
    name: "Walnut_Architectural_Flute",
    baseColorFactor: [0.42, 0.28, 0.18, 1.0],
    metallicFactor: 0.02,
    roughnessFactor: 0.70,
  },
});
fs.writeFileSync(path.join(outDir, 'wpc-fluted-panel.glb'), wpcGLB);
console.log(`✓ Generated: wpc-fluted-panel.glb (${(wpcGLB.length / 1024).toFixed(1)} KB)`);

console.log("All AR GLB assets generated successfully in public/models/.");

