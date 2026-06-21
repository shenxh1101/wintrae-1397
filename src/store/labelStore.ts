import { create } from 'zustand';
import type { LabelData, LabelElement, ColorScheme, Ingredient, PrintSettings, Draft } from '@/types';
import { generateId } from '@/utils/units';
import { getTemplateById } from '@/utils/templates';

interface HistoryState {
  past: LabelData[];
  future: LabelData[];
}

interface LabelStore {
  currentLabel: LabelData | null;
  selectedElementId: string | null;
  printSettings: PrintSettings;
  history: HistoryState;
  drafts: Draft[];
  isSaving: boolean;
  autoSaveEnabled: boolean;
  
  initLabelFromTemplate: (templateId: string) => void;
  loadLabel: (labelData: LabelData) => void;
  updateLabelBasic: (updates: Partial<Pick<LabelData, 'name' | 'weight' | 'usage' | 'shelfLife' | 'batchNumber' | 'allergyWarning'>>) => void;
  updateLabelSize: (width: number, height: number) => void;
  updateColors: (colors: Partial<ColorScheme>) => void;
  applyColorScheme: (scheme: ColorScheme) => void;
  updateIngredientsListMode: (mode: 'inline' | 'list') => void;
  
  addElement: (element: Omit<LabelElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<LabelElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  selectElement: (id: string | null) => void;
  moveElementForward: (id: string) => void;
  moveElementBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  
  addIngredient: (ingredient: Omit<Ingredient, 'id'>) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  reorderIngredients: (startIndex: number, endIndex: number) => void;
  
  updatePrintSettings: (updates: Partial<PrintSettings>) => void;
  
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  
  saveDraft: (name: string, thumbnail: string) => void;
  loadDraft: (draftId: string) => void;
  deleteDraft: (draftId: string) => void;
  loadDraftsFromStorage: () => void;
}

const defaultPrintSettings: PrintSettings = {
  paperSize: 'A4',
  paperWidth: 210,
  paperHeight: 297,
  labelsPerRow: 3,
  labelsPerColumn: 5,
  marginTop: 10,
  marginBottom: 10,
  marginLeft: 10,
  marginRight: 10,
  gapX: 5,
  gapY: 5,
  showCropMarks: true,
  copies: 1,
};

function createLabelFromTemplate(templateId: string): LabelData | null {
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  const now = Date.now();
  return {
    id: generateId(),
    templateId: template.id,
    name: '',
    weight: '',
    ingredients: [
      { id: generateId(), name: '橄榄油', order: 0, isAllergen: false, percentage: '40%' },
      { id: generateId(), name: '椰子油', order: 1, isAllergen: false, percentage: '25%' },
      { id: generateId(), name: '棕榈油', order: 2, isAllergen: false, percentage: '20%' },
      { id: generateId(), name: '甜杏仁油', order: 3, isAllergen: true, percentage: '10%' },
      { id: generateId(), name: '精油', order: 4, isAllergen: false, percentage: '5%' },
    ],
    usage: '湿润双手和皂体，揉搓起泡后清洁肌肤，用清水冲洗干净。',
    shelfLife: '请于开盖后12个月内使用完毕',
    batchNumber: `B${now.toString().slice(-8)}`,
    allergyWarning: '含有坚果成分，过敏体质者请先进行皮肤测试',
    width: template.defaultWidth,
    height: template.defaultHeight,
    elements: template.defaultElements.map(el => ({ ...el, id: generateId() })),
    colors: { ...template.defaultColors },
    ingredientsListMode: 'inline',
    createdAt: now,
    updatedAt: now,
  };
}

export const useLabelStore = create<LabelStore>((set, get) => ({
  currentLabel: null,
  selectedElementId: null,
  printSettings: defaultPrintSettings,
  history: { past: [], future: [] },
  drafts: [],
  isSaving: false,
  autoSaveEnabled: true,
  
  initLabelFromTemplate: (templateId: string) => {
    const label = createLabelFromTemplate(templateId);
    if (label) {
      set({
        currentLabel: label,
        selectedElementId: null,
        history: { past: [], future: [] },
      });
    }
  },
  
  loadLabel: (labelData: LabelData) => {
    set({
      currentLabel: labelData,
      selectedElementId: null,
      history: { past: [], future: [] },
    });
  },
  
  updateLabelBasic: (updates) => {
    set((state) => ({
      currentLabel: state.currentLabel
        ? { ...state.currentLabel, ...updates, updatedAt: Date.now() }
        : null,
    }));
    get().saveToHistory();
  },
  
  updateLabelSize: (width, height) => {
    set((state) => ({
      currentLabel: state.currentLabel
        ? { ...state.currentLabel, width, height, updatedAt: Date.now() }
        : null,
    }));
    get().saveToHistory();
  },
  
  updateColors: (colors) => {
    set((state) => ({
      currentLabel: state.currentLabel
        ? {
            ...state.currentLabel,
            colors: { ...state.currentLabel.colors, ...colors },
            updatedAt: Date.now(),
          }
        : null,
    }));
  },
  
  applyColorScheme: (scheme) => {
    set((state) => ({
      currentLabel: state.currentLabel
        ? { ...state.currentLabel, colors: scheme, updatedAt: Date.now() }
        : null,
    }));
    get().saveToHistory();
  },

  updateIngredientsListMode: (mode) => {
    set((state) => ({
      currentLabel: state.currentLabel
        ? { ...state.currentLabel, ingredientsListMode: mode, updatedAt: Date.now() }
        : null,
    }));
    get().saveToHistory();
  },
  
  addElement: (element) => {
    const newElement: LabelElement = {
      ...element,
      id: generateId(),
    };
    set((state) => ({
      currentLabel: state.currentLabel
        ? {
            ...state.currentLabel,
            elements: [...state.currentLabel.elements, newElement],
            updatedAt: Date.now(),
          }
        : null,
      selectedElementId: newElement.id,
    }));
    get().saveToHistory();
  },
  
  updateElement: (id, updates) => {
    set((state) => ({
      currentLabel: state.currentLabel
        ? {
            ...state.currentLabel,
            elements: state.currentLabel.elements.map((el) =>
              el.id === id ? { ...el, ...updates } : el
            ),
            updatedAt: Date.now(),
          }
        : null,
    }));
  },
  
  deleteElement: (id) => {
    set((state) => ({
      currentLabel: state.currentLabel
        ? {
            ...state.currentLabel,
            elements: state.currentLabel.elements.filter((el) => el.id !== id),
            updatedAt: Date.now(),
          }
        : null,
      selectedElementId: state.selectedElementId === id ? null : state.selectedElementId,
    }));
    get().saveToHistory();
  },
  
  duplicateElement: (id) => {
    const element = get().currentLabel?.elements.find((el) => el.id === id);
    if (element) {
      const newElement: LabelElement = {
        ...element,
        id: generateId(),
        x: element.x + 5,
        y: element.y + 5,
      };
      set((state) => ({
        currentLabel: state.currentLabel
          ? {
              ...state.currentLabel,
              elements: [...state.currentLabel.elements, newElement],
              updatedAt: Date.now(),
            }
          : null,
        selectedElementId: newElement.id,
      }));
      get().saveToHistory();
    }
  },
  
  selectElement: (id) => {
    set({ selectedElementId: id });
  },
  
  moveElementForward: (id) => {
    set((state) => {
      if (!state.currentLabel) return {};
      const elements = [...state.currentLabel.elements];
      const index = elements.findIndex((el) => el.id === id);
      if (index < elements.length - 1) {
        const nextIndex = index + 1;
        const currentZ = elements[index].zIndex;
        const nextZ = elements[nextIndex].zIndex;
        elements[index] = { ...elements[index], zIndex: nextZ };
        elements[nextIndex] = { ...elements[nextIndex], zIndex: currentZ };
      }
      return {
        currentLabel: {
          ...state.currentLabel,
          elements,
          updatedAt: Date.now(),
        },
      };
    });
  },
  
  moveElementBackward: (id) => {
    set((state) => {
      if (!state.currentLabel) return {};
      const elements = [...state.currentLabel.elements];
      const index = elements.findIndex((el) => el.id === id);
      if (index > 0) {
        const prevIndex = index - 1;
        const currentZ = elements[index].zIndex;
        const prevZ = elements[prevIndex].zIndex;
        elements[index] = { ...elements[index], zIndex: prevZ };
        elements[prevIndex] = { ...elements[prevIndex], zIndex: currentZ };
      }
      return {
        currentLabel: {
          ...state.currentLabel,
          elements,
          updatedAt: Date.now(),
        },
      };
    });
  },
  
  bringToFront: (id) => {
    set((state) => {
      if (!state.currentLabel) return {};
      const maxZ = Math.max(...state.currentLabel.elements.map((el) => el.zIndex));
      return {
        currentLabel: {
          ...state.currentLabel,
          elements: state.currentLabel.elements.map((el) =>
            el.id === id ? { ...el, zIndex: maxZ + 1 } : el
          ),
          updatedAt: Date.now(),
        },
      };
    });
  },
  
  sendToBack: (id) => {
    set((state) => {
      if (!state.currentLabel) return {};
      const minZ = Math.min(...state.currentLabel.elements.map((el) => el.zIndex));
      return {
        currentLabel: {
          ...state.currentLabel,
          elements: state.currentLabel.elements.map((el) =>
            el.id === id ? { ...el, zIndex: minZ - 1 } : el
          ),
          updatedAt: Date.now(),
        },
      };
    });
  },
  
  addIngredient: (ingredient) => {
    const newIngredient: Ingredient = {
      ...ingredient,
      id: generateId(),
    };
    set((state) => ({
      currentLabel: state.currentLabel
        ? {
            ...state.currentLabel,
            ingredients: [...state.currentLabel.ingredients, newIngredient],
            updatedAt: Date.now(),
          }
        : null,
    }));
    get().saveToHistory();
  },
  
  updateIngredient: (id, updates) => {
    set((state) => ({
      currentLabel: state.currentLabel
        ? {
            ...state.currentLabel,
            ingredients: state.currentLabel.ingredients.map((ing) =>
              ing.id === id ? { ...ing, ...updates } : ing
            ),
            updatedAt: Date.now(),
          }
        : null,
    }));
  },
  
  deleteIngredient: (id) => {
    set((state) => ({
      currentLabel: state.currentLabel
        ? {
            ...state.currentLabel,
            ingredients: state.currentLabel.ingredients
              .filter((ing) => ing.id !== id)
              .map((ing, idx) => ({ ...ing, order: idx })),
            updatedAt: Date.now(),
          }
        : null,
    }));
    get().saveToHistory();
  },
  
  reorderIngredients: (startIndex, endIndex) => {
    set((state) => {
      if (!state.currentLabel) return {};
      const ingredients = [...state.currentLabel.ingredients];
      const [removed] = ingredients.splice(startIndex, 1);
      ingredients.splice(endIndex, 0, removed);
      return {
        currentLabel: {
          ...state.currentLabel,
          ingredients: ingredients.map((ing, idx) => ({ ...ing, order: idx })),
          updatedAt: Date.now(),
        },
      };
    });
    get().saveToHistory();
  },
  
  updatePrintSettings: (updates) => {
    set((state) => ({
      printSettings: { ...state.printSettings, ...updates },
    }));
  },
  
  saveToHistory: () => {
    const { currentLabel, history } = get();
    if (!currentLabel) return;
    
    set({
      history: {
        past: [...history.past, JSON.parse(JSON.stringify(currentLabel))],
        future: [],
      },
    });
  },
  
  undo: () => {
    const { history } = get();
    if (history.past.length === 0) return;
    
    const previous = history.past[history.past.length - 1];
    const newPast = history.past.slice(0, -1);
    
    set((state) => ({
      currentLabel: previous,
      history: {
        past: newPast,
        future: state.currentLabel
          ? [state.currentLabel, ...history.future]
          : history.future,
      },
    }));
  },
  
  redo: () => {
    const { history } = get();
    if (history.future.length === 0) return;
    
    const next = history.future[0];
    const newFuture = history.future.slice(1);
    
    set((state) => ({
      currentLabel: next,
      history: {
        past: state.currentLabel
          ? [...history.past, state.currentLabel]
          : history.past,
        future: newFuture,
      },
    }));
  },
  
  saveDraft: (name, thumbnail) => {
    const { currentLabel, drafts } = get();
    if (!currentLabel) return;
    
    const draft: Draft = {
      id: generateId(),
      name,
      thumbnail,
      labelData: JSON.parse(JSON.stringify(currentLabel)),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const newDrafts = [draft, ...drafts];
    set({ drafts: newDrafts, isSaving: true });
    
    try {
      localStorage.setItem('soap-label-drafts', JSON.stringify(newDrafts));
    } catch (e) {
      console.error('Failed to save draft:', e);
    }
    
    setTimeout(() => set({ isSaving: false }), 500);
  },
  
  loadDraft: (draftId) => {
    const draft = get().drafts.find((d) => d.id === draftId);
    if (draft) {
      get().loadLabel(draft.labelData);
    }
  },
  
  deleteDraft: (draftId) => {
    const newDrafts = get().drafts.filter((d) => d.id !== draftId);
    set({ drafts: newDrafts });
    localStorage.setItem('soap-label-drafts', JSON.stringify(newDrafts));
  },
  
  loadDraftsFromStorage: () => {
    try {
      const stored = localStorage.getItem('soap-label-drafts');
      if (stored) {
        set({ drafts: JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load drafts:', e);
    }
  },
}));
