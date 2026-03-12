/**
 * Construction Calculation Engine
 * Pure functions for each calculator type — reusable and testable
 */

// ==================== 1. CONCRETE VOLUME CALCULATOR ====================
/**
 * Calculates total concrete volume for columns
 * @param {number} width    - Column width in cm
 * @param {number} length   - Column length in cm
 * @param {number} height   - Column height in m
 * @param {number} quantity - Number of columns
 * @returns {object} Result with volume in m³
 */
function calculateConcreteVolume({ width, length, height, quantity }) {
  // Convert cm to m for width and length
  const widthM = width / 100;
  const lengthM = length / 100;

  // Volume = width(m) × length(m) × height(m) × quantity
  const totalVolume = widthM * lengthM * height * quantity;

  return {
    volume_per_unit_m3: parseFloat((widthM * lengthM * height).toFixed(4)),
    total_volume_m3: parseFloat(totalVolume.toFixed(4)),
    quantity,
    unit: 'm³',
  };
}

// ==================== 2. STEEL REBAR WEIGHT CALCULATOR ====================
/**
 * Calculates total weight of steel rebar
 * Formula: weight = (diameter² / 162) × length × quantity
 * The 162 constant comes from the unit weight formula for steel bars
 * @param {number} diameter - Steel bar diameter in mm
 * @param {number} length   - Bar length in m
 * @param {number} quantity - Number of bars
 * @returns {object} Result with weight in kg and tons
 */
function calculateRebarWeight({ diameter, length, quantity }) {
  // Unit weight per meter = diameter² / 162 (kg/m)
  const weightPerMeter = (diameter * diameter) / 162;
  const weightPerBar = weightPerMeter * length;
  const totalWeightKg = weightPerBar * quantity;
  const totalWeightTons = totalWeightKg / 1000;

  return {
    weight_per_meter_kg: parseFloat(weightPerMeter.toFixed(4)),
    weight_per_bar_kg: parseFloat(weightPerBar.toFixed(4)),
    total_weight_kg: parseFloat(totalWeightKg.toFixed(4)),
    total_weight_tons: parseFloat(totalWeightTons.toFixed(6)),
    quantity,
  };
}

// ==================== 3. EXCAVATION VOLUME CALCULATOR ====================
/**
 * Calculates excavation volume
 * @param {number} length - Excavation length in m
 * @param {number} width  - Excavation width in m
 * @param {number} depth  - Excavation depth in m
 * @returns {object} Result with volume in m³
 */
function calculateExcavationVolume({ length, width, depth }) {
  const totalVolume = length * width * depth;

  // Swell factor: excavated soil expands ~20-30% (use 25% as default)
  const swellFactor = 1.25;
  const swelledVolume = totalVolume * swellFactor;

  return {
    net_volume_m3: parseFloat(totalVolume.toFixed(4)),
    swelled_volume_m3: parseFloat(swelledVolume.toFixed(4)),
    swell_factor: swellFactor,
    unit: 'm³',
  };
}

// ==================== 4. WALL MATERIAL CALCULATOR ====================
/**
 * Calculates the number of bricks and mortar needed for a wall
 * Standard brick sizes (L × H in cm):
 *   - standard:  24 × 11.5 × 7.1  → ~60 bricks/m² (half brick wall)
 *   - large:     29 × 19 × 13.5
 * @param {number} wallLength - Wall length in m
 * @param {number} wallHeight - Wall height in m
 * @param {string} brickSize  - 'standard' | 'large'
 * @returns {object} Brick count and mortar estimation
 */
function calculateWallMaterials({ wallLength, wallHeight, brickSize = 'standard' }) {
  const wallArea = wallLength * wallHeight; // m²

  // Brick dimensions in cm (including mortar joint of ~1 cm)
  const brickData = {
    standard: { l: 25, h: 8, bricksPerM2: 50, mortarPerM2: 0.03 },
    large:    { l: 30, h: 20, bricksPerM2: 17, mortarPerM2: 0.04 },
  };

  const brick = brickData[brickSize] || brickData.standard;
  const totalBricks = Math.ceil(wallArea * brick.bricksPerM2);
  const totalMortarM3 = wallArea * brick.mortarPerM2;

  // Add 5% waste factor
  const bricksWithWaste = Math.ceil(totalBricks * 1.05);

  return {
    wall_area_m2: parseFloat(wallArea.toFixed(4)),
    brick_size: brickSize,
    total_bricks: totalBricks,
    total_bricks_with_waste: bricksWithWaste,
    mortar_volume_m3: parseFloat(totalMortarM3.toFixed(4)),
    waste_factor: '5%',
  };
}

// ==================== 5. CONSTRUCTION COST ESTIMATOR ====================
/**
 * Estimates total construction cost based on material quantities and unit prices
 * @param {number} concreteVolume  - Total concrete in m³
 * @param {number} concretePricePerM3 - Price per m³ of concrete
 * @param {number} steelWeightKg   - Total steel weight in kg
 * @param {number} steelPricePerKg - Price per kg of steel
 * @param {number} laborCost       - Total labor cost
 * @param {number} totalArea       - Project total area in m² (for per-m² cost)
 * @returns {object} Cost breakdown
 */
function calculateConstructionCost({
  concreteVolume,
  concretePricePerM3,
  steelWeightKg,
  steelPricePerKg,
  laborCost,
  totalArea,
}) {
  const concreteCost = concreteVolume * concretePricePerM3;
  const steelCost = steelWeightKg * steelPricePerKg;
  const materialCost = concreteCost + steelCost;
  const totalCost = materialCost + laborCost;
  const costPerM2 = totalArea > 0 ? totalCost / totalArea : 0;

  return {
    concrete_cost: parseFloat(concreteCost.toFixed(2)),
    steel_cost: parseFloat(steelCost.toFixed(2)),
    material_cost: parseFloat(materialCost.toFixed(2)),
    labor_cost: parseFloat(laborCost.toFixed(2)),
    total_cost: parseFloat(totalCost.toFixed(2)),
    cost_per_m2: parseFloat(costPerM2.toFixed(2)),
    currency: 'TRY',
  };
}

// ==================== CALCULATOR DISPATCHER ====================
/**
 * Routes a calculation request to the correct calculator function
 * @param {string} type  - Calculator type identifier
 * @param {object} input - Input parameters
 * @returns {object} Calculation result
 */
function runCalculation(type, input) {
  const calculators = {
    concrete_volume: calculateConcreteVolume,
    rebar_weight: calculateRebarWeight,
    excavation_volume: calculateExcavationVolume,
    wall_materials: calculateWallMaterials,
    construction_cost: calculateConstructionCost,
  };

  const calculator = calculators[type];
  if (!calculator) {
    throw new Error(`Unknown calculator type: ${type}`);
  }

  return calculator(input);
}

module.exports = {
  calculateConcreteVolume,
  calculateRebarWeight,
  calculateExcavationVolume,
  calculateWallMaterials,
  calculateConstructionCost,
  runCalculation,
};
