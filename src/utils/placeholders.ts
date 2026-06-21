import type { LabelData, Ingredient } from '@/types';

export interface PlaceholderContext {
  name: string;
  weight: string;
  ingredients: Ingredient[];
  usage: string;
  shelfLife: string;
  batchNumber: string;
  allergyWarning: string;
}

export function createPlaceholderContext(labelData: LabelData): PlaceholderContext {
  return {
    name: labelData.name || '',
    weight: labelData.weight || '',
    ingredients: labelData.ingredients || [],
    usage: labelData.usage || '',
    shelfLife: labelData.shelfLife || '',
    batchNumber: labelData.batchNumber || '',
    allergyWarning: labelData.allergyWarning || '',
  };
}

function formatIngredients(ingredients: Ingredient[], showPercentage: boolean = true): string {
  const sorted = [...ingredients].sort((a, b) => a.order - b.order);
  return sorted
    .map((ing) => {
      let name = ing.name;
      if (ing.isAllergen) {
        name = `【${name}】`;
      }
      if (showPercentage && ing.percentage) {
        return `${name}${ing.percentage}`;
      }
      return name;
    })
    .join('、');
}

function formatIngredientsMultiline(ingredients: Ingredient[], showPercentage: boolean = true): string {
  const sorted = [...ingredients].sort((a, b) => a.order - b.order);
  return sorted
    .map((ing, idx) => {
      let name = ing.name;
      if (ing.isAllergen) {
        name = `【${name}】`;
      }
      if (showPercentage && ing.percentage) {
        return `${idx + 1}. ${name} ${ing.percentage}`;
      }
      return `${idx + 1}. ${name}`;
    })
    .join('\n');
}

export function replacePlaceholders(text: string, context: PlaceholderContext): string {
  if (!text) return '';
  
  let result = text;
  
  result = result.replace(/\{\{皂名\}\}/g, context.name || '皂名');
  result = result.replace(/\{\{重量\}\}/g, context.weight || '');
  result = result.replace(/\{\{净含量\}\}/g, context.weight || '');
  result = result.replace(/\{\{成分\}\}/g, formatIngredients(context.ingredients));
  result = result.replace(/\{\{成分列表\}\}/g, formatIngredientsMultiline(context.ingredients));
  result = result.replace(/\{\{使用方法\}\}/g, context.usage || '');
  result = result.replace(/\{\{保存期限\}\}/g, context.shelfLife || '');
  result = result.replace(/\{\{批次编号\}\}/g, context.batchNumber || '');
  result = result.replace(/\{\{批次\}\}/g, context.batchNumber || '');
  result = result.replace(/\{\{过敏提示\}\}/g, context.allergyWarning || '');
  result = result.replace(/\{\{过敏原\}\}/g, () => {
    const allergens = context.ingredients.filter((i) => i.isAllergen).map((i) => i.name);
    if (allergens.length === 0) return '';
    return `过敏原：${allergens.join('、')}`;
  });
  
  return result;
}

export function hasPlaceholders(text: string): boolean {
  return /\{\{.*?\}\}/.test(text || '');
}
