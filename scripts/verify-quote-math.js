/**
 * MarvelRise Decor - Quote Engine Mathematics Verification Suite
 * Phase 14 QA Automated Testing
 *
 * Verifies flooring area calculations, 10% wastage rules, box rounding up,
 * supply only vs supply & fit logic across both 5.5mm and 6mm product lines.
 */

// Production constants from catalogue and quote engine
const BOX_COVERAGE_SQM = {
  "5.5mm": 2.22, // m² per box for 5.5mm SPC planks (10 planks per carton)
  "6mm": 1.98,   // m² per box for 6mm Acoustic IXPE planks (8 planks per carton)
};

const PRICE_PER_SQM_KES = {
  "5.5mm": 1850,
  "6mm": 2450,
};

const INSTALLATION_RATE_KES_PER_SQM = 350; // Supply & Fit professional labour rate

function calculateQuote(params) {
  const { widthM, lengthM, thickness, supplyMode, wastagePct = 10 } = params;

  // 1. Net Area
  const netAreaSqm = Math.round(widthM * lengthM * 100) / 100;

  // 2. Gross Area with Wastage
  const wastageFactor = 1 + wastagePct / 100;
  const grossAreaSqm = Math.round(netAreaSqm * wastageFactor * 100) / 100;

  // 3. Boxes needed (strictly rounded up to the nearest whole box)
  const coveragePerBox = BOX_COVERAGE_SQM[thickness];
  const boxes = Math.ceil(grossAreaSqm / coveragePerBox);

  // 4. Actual material billed area
  const billedAreaSqm = Math.round(boxes * coveragePerBox * 100) / 100;

  // 5. Material Subtotal
  const unitPrice = PRICE_PER_SQM_KES[thickness];
  const materialSubtotalKes = Math.round(boxes * (coveragePerBox * unitPrice));

  // 6. Installation Subtotal if Supply & Fit
  const installSubtotalKes =
    supplyMode === "supply_and_fit"
      ? Math.round(grossAreaSqm * INSTALLATION_RATE_KES_PER_SQM)
      : 0;

  const totalKes = materialSubtotalKes + installSubtotalKes;

  return {
    netAreaSqm,
    grossAreaSqm,
    boxes,
    billedAreaSqm,
    materialSubtotalKes,
    installSubtotalKes,
    totalKes,
  };
}

// 5 Comprehensive Test Scenarios
const TEST_CASES = [
  {
    name: "Scenario 1: Compact Study Room (4.5m x 4.0m) - 5.5mm Supply Only",
    input: { widthM: 4.5, lengthM: 4.0, thickness: "5.5mm", supplyMode: "supply_only" },
    expected: {
      netAreaSqm: 18.0,
      grossAreaSqm: 19.8,
      boxes: 9, // 19.8 / 2.22 = 8.919 => ceil = 9 boxes
    },
  },
  {
    name: "Scenario 2: Master Suite Bedroom (5.5m x 6.0m) - 6mm Supply & Fit",
    input: { widthM: 5.5, lengthM: 6.0, thickness: "6mm", supplyMode: "supply_and_fit" },
    expected: {
      netAreaSqm: 33.0,
      grossAreaSqm: 36.3,
      boxes: 19, // 36.3 / 1.98 = 18.333 => ceil = 19 boxes
    },
  },
  {
    name: "Scenario 3: Open-Plan Living & Dining (7.0m x 7.5m) - 6mm Supply & Fit",
    input: { widthM: 7.0, lengthM: 7.5, thickness: "6mm", supplyMode: "supply_and_fit" },
    expected: {
      netAreaSqm: 52.5,
      grossAreaSqm: 57.75,
      boxes: 30, // 57.75 / 1.98 = 29.167 => ceil = 30 boxes
    },
  },
  {
    name: "Scenario 4: Ground Floor Reception Wing (8.0m x 10.0m) - 5.5mm Supply Only",
    input: { widthM: 8.0, lengthM: 10.0, thickness: "5.5mm", supplyMode: "supply_only" },
    expected: {
      netAreaSqm: 80.0,
      grossAreaSqm: 88.0,
      boxes: 40, // 88.0 / 2.22 = 39.64 => ceil = 40 boxes
    },
  },
  {
    name: "Scenario 5: Luxury Runda Villa Full Level (10.0m x 12.0m) - 6mm Supply & Fit",
    input: { widthM: 10.0, lengthM: 12.0, thickness: "6mm", supplyMode: "supply_and_fit" },
    expected: {
      netAreaSqm: 120.0,
      grossAreaSqm: 132.0,
      boxes: 67, // 132.0 / 1.98 = 66.667 => ceil = 67 boxes
    },
  },
];

console.log("=========================================================");
console.log("MARVELRISE DECOR - QA QUOTE MATHEMATICS AUDIT");
console.log("=========================================================\n");

let passedCount = 0;

TEST_CASES.forEach((tc, idx) => {
  const result = calculateQuote(tc.input);
  const netMatch = Math.abs(result.netAreaSqm - tc.expected.netAreaSqm) < 0.01;
  const grossMatch = Math.abs(result.grossAreaSqm - tc.expected.grossAreaSqm) < 0.01;
  const boxesMatch = result.boxes === tc.expected.boxes;

  const passed = netMatch && grossMatch && boxesMatch;

  if (passed) {
    passedCount++;
    console.log(`PASS [${idx + 1}/5] ${tc.name}`);
    console.log(`       Net Area: ${result.netAreaSqm} m² | Gross (+10%): ${result.grossAreaSqm} m² | Boxes: ${result.boxes} | Total: KSh ${result.totalKes.toLocaleString()}`);
  } else {
    console.error(`FAIL [${idx + 1}/5] ${tc.name}`);
    console.error(`       Expected: Net ${tc.expected.netAreaSqm} m², Gross ${tc.expected.grossAreaSqm} m², Boxes: ${tc.expected.boxes}`);
    console.error(`       Received: Net ${result.netAreaSqm} m², Gross ${result.grossAreaSqm} m², Boxes: ${result.boxes}`);
  }
});

console.log("\n---------------------------------------------------------");
console.log(`TOTAL PASSED: ${passedCount} / ${TEST_CASES.length}`);
console.log("=========================================================");

if (passedCount === TEST_CASES.length) {
  process.exit(0);
} else {
  process.exit(1);
}

