/**
 * LocalStorage Service
 * Replaces backend API — all data persisted in browser localStorage
 * Provides CRUD operations for projects and calculations
 */

const PROJECTS_KEY = 'ccs_projects';
const CALCULATIONS_KEY = 'ccs_calculations';

// ==================== HELPERS ====================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function getStore(key) {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStore(key, data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// ==================== PROJECTS ====================

export function getProjects(search = '') {
  let projects = getStore(PROJECTS_KEY);
  if (search) {
    const q = search.toLowerCase();
    projects = projects.filter((p) =>
      p.project_name.toLowerCase().includes(q)
    );
  }
  // Sort by updated_at descending
  projects.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  // Attach calculation count
  const allCalcs = getStore(CALCULATIONS_KEY);
  projects = projects.map((p) => ({
    ...p,
    calculation_count: allCalcs.filter((c) => c.project_id === p.id).length,
  }));

  return { projects, total: projects.length };
}

export function getProject(id) {
  const projects = getStore(PROJECTS_KEY);
  const project = projects.find((p) => p.id === id);
  if (!project) return null;

  const allCalcs = getStore(CALCULATIONS_KEY);
  const calculations = allCalcs
    .filter((c) => c.project_id === id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return { ...project, calculations };
}

export function createProject(projectName, description = '') {
  const projects = getStore(PROJECTS_KEY);
  const now = new Date().toISOString();
  const project = {
    id: generateId(),
    project_name: projectName,
    description,
    status: 'active',
    created_at: now,
    updated_at: now,
  };
  projects.push(project);
  setStore(PROJECTS_KEY, projects);
  return project;
}

export function updateProject(id, data) {
  const projects = getStore(PROJECTS_KEY);
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  projects[idx] = {
    ...projects[idx],
    ...(data.projectName !== undefined && { project_name: data.projectName }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.status !== undefined && { status: data.status }),
    updated_at: new Date().toISOString(),
  };
  setStore(PROJECTS_KEY, projects);
  return projects[idx];
}

export function deleteProject(id) {
  // Delete project
  let projects = getStore(PROJECTS_KEY);
  projects = projects.filter((p) => p.id !== id);
  setStore(PROJECTS_KEY, projects);

  // Delete associated calculations
  let calcs = getStore(CALCULATIONS_KEY);
  calcs = calcs.filter((c) => c.project_id !== id);
  setStore(CALCULATIONS_KEY, calcs);
}

// ==================== CALCULATIONS ====================

export function getCalculations({ calculatorType, projectId, limit = 50 } = {}) {
  let calcs = getStore(CALCULATIONS_KEY);

  if (calculatorType) {
    calcs = calcs.filter((c) => c.calculator_type === calculatorType);
  }
  if (projectId) {
    calcs = calcs.filter((c) => c.project_id === projectId);
  }

  calcs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const total = calcs.length;
  calcs = calcs.slice(0, limit);

  return { calculations: calcs, total };
}

export function saveCalculation({ calculatorType, inputData, resultData, projectId, notes }) {
  const calcs = getStore(CALCULATIONS_KEY);
  const calc = {
    id: generateId(),
    calculator_type: calculatorType,
    input_data: inputData,
    result_data: resultData,
    project_id: projectId || null,
    notes: notes || null,
    created_at: new Date().toISOString(),
  };
  calcs.push(calc);
  setStore(CALCULATIONS_KEY, calcs);

  // Update project's updated_at timestamp
  if (projectId) {
    const projects = getStore(PROJECTS_KEY);
    const idx = projects.findIndex((p) => p.id === projectId);
    if (idx !== -1) {
      projects[idx].updated_at = new Date().toISOString();
      setStore(PROJECTS_KEY, projects);
    }
  }

  return calc;
}

export function deleteCalculation(id) {
  let calcs = getStore(CALCULATIONS_KEY);
  calcs = calcs.filter((c) => c.id !== id);
  setStore(CALCULATIONS_KEY, calcs);
}
