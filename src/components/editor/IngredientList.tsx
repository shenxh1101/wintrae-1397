import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, AlertTriangle, Plus } from 'lucide-react';
import { useLabelStore } from '@/store/labelStore';
import type { Ingredient } from '@/types';

interface IngredientItemProps {
  ingredient: Ingredient;
  index: number;
}

function IngredientItem({ ingredient, index }: IngredientItemProps) {
  const updateIngredient = useLabelStore((state) => state.updateIngredient);
  const deleteIngredient = useLabelStore((state) => state.deleteIngredient);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ingredient.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 bg-white rounded-xl border ${
        ingredient.isAllergen ? 'border-red-200 bg-red-50/50' : 'border-brown-100'
      } group`}
    >
      <button
        className="p-1 text-brown-300 hover:text-brown-500 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <span className="text-xs text-brown-400 w-5">{index + 1}</span>

      <input
        type="text"
        value={ingredient.name}
        onChange={(e) => updateIngredient(ingredient.id, { name: e.target.value })}
        placeholder="成分名称"
        className="flex-1 px-2 py-1 bg-transparent border-b border-transparent focus:border-brown-300 outline-none text-sm text-brown-700"
      />

      <input
        type="text"
        value={ingredient.percentage || ''}
        onChange={(e) => updateIngredient(ingredient.id, { percentage: e.target.value })}
        placeholder="%"
        className="w-16 px-2 py-1 bg-cream-50 rounded-lg text-center text-sm text-brown-600 border border-brown-100 focus:border-brown-300 outline-none"
      />

      <button
        onClick={() => updateIngredient(ingredient.id, { isAllergen: !ingredient.isAllergen })}
        className={`p-1.5 rounded-lg transition-colors ${
          ingredient.isAllergen
            ? 'bg-red-100 text-red-500'
            : 'bg-cream-100 text-brown-400 hover:bg-red-50 hover:text-red-400'
        }`}
        title={ingredient.isAllergen ? '取消过敏原标记' : '标记为过敏原'}
      >
        <AlertTriangle size={16} />
      </button>

      <button
        onClick={() => deleteIngredient(ingredient.id)}
        className="p-1.5 rounded-lg text-brown-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function IngredientList() {
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const addIngredient = useLabelStore((state) => state.addIngredient);
  const reorderIngredients = useLabelStore((state) => state.reorderIngredients);

  const sortedIngredients = currentLabel?.ingredients
    ? [...currentLabel.ingredients].sort((a, b) => a.order - b.order)
    : [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    addIngredient({
      name: '',
      order: sortedIngredients.length,
      isAllergen: false,
      percentage: '',
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortedIngredients.findIndex((i) => i.id === active.id);
      const newIndex = sortedIngredients.findIndex((i) => i.id === over.id);
      reorderIngredients(oldIndex, newIndex);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-brown-600 text-sm">成分列表</h4>
        <button
          onClick={handleAdd}
          className="btn-ghost flex items-center gap-1 text-xs"
        >
          <Plus size={14} />
          添加
        </button>
      </div>

      <div className="text-xs text-brown-400 mb-2">
        拖拽调整顺序 · 点击 ⚠ 标记过敏原
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedIngredients.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
            {sortedIngredients.map((ingredient, index) => (
              <IngredientItem
                key={ingredient.id}
                ingredient={ingredient}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sortedIngredients.length === 0 && (
        <div className="text-center py-6 text-brown-400 text-sm">
          还没有添加成分
        </div>
      )}
    </div>
  );
}
