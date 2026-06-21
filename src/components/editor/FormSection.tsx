import { useLabelStore } from '@/store/labelStore';
import IngredientList from './IngredientList';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function FormSection() {
  const currentLabel = useLabelStore((state) => state.currentLabel);
  const updateLabelBasic = useLabelStore((state) => state.updateLabelBasic);
  const updateLabelSize = useLabelStore((state) => state.updateLabelSize);
  const reorderIngredients = useLabelStore((state) => state.reorderIngredients);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  if (!currentLabel) return null;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const sorted = [...currentLabel.ingredients].sort((a, b) => a.order - b.order);
      const oldIndex = sorted.findIndex((i) => i.id === active.id);
      const newIndex = sorted.findIndex((i) => i.id === over.id);
      reorderIngredients(oldIndex, newIndex);
    }
  };

  const presetSizes = [
    { name: '3cm 圆形', width: 3, height: 3 },
    { name: '5cm 圆形', width: 5, height: 5 },
    { name: '8cm 圆形', width: 8, height: 8 },
    { name: 'A7 卡片', width: 7.4, height: 10.5 },
    { name: 'A6 卡片', width: 10.5, height: 14.8 },
    { name: 'A5 卡片', width: 14.8, height: 21 },
  ];

  return (
    <div className="space-y-6">
      {/* 基础信息 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brown-600 mb-1.5">皂名</label>
          <input
            type="text"
            value={currentLabel.name}
            onChange={(e) => updateLabelBasic({ name: e.target.value })}
            placeholder="例如：薰衣草舒缓皂"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-600 mb-1.5">重量</label>
          <input
            type="text"
            value={currentLabel.weight}
            onChange={(e) => updateLabelBasic({ weight: e.target.value })}
            placeholder="例如：100g / 净含量 100克"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-brown-600 mb-1.5">宽度 (cm)</label>
            <input
              type="number"
              value={currentLabel.width}
              onChange={(e) => updateLabelSize(parseFloat(e.target.value) || 5, currentLabel.height)}
              step="0.1"
              min="1"
              max="30"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown-600 mb-1.5">高度 (cm)</label>
            <input
              type="number"
              value={currentLabel.height}
              onChange={(e) => updateLabelSize(currentLabel.width, parseFloat(e.target.value) || 5)}
              step="0.1"
              min="1"
              max="30"
              className="input-field"
            />
          </div>
        </div>

        {/* 预设尺寸 */}
        <div>
          <label className="block text-sm font-medium text-brown-600 mb-2">预设尺寸</label>
          <div className="flex flex-wrap gap-1.5">
            {presetSizes.map((size) => (
              <button
                key={size.name}
                onClick={() => updateLabelSize(size.width, size.height)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  currentLabel.width === size.width && currentLabel.height === size.height
                    ? 'bg-brown-400 text-white'
                    : 'bg-cream-100 text-brown-600 hover:bg-cream-200'
                }`}
              >
                {size.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-cream-200 pt-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={currentLabel.ingredients.map(i => i.id)}
            strategy={verticalListSortingStrategy}
          >
            <IngredientList />
          </SortableContext>
        </DndContext>
      </div>

      <div className="border-t border-cream-200 pt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-brown-600 mb-1.5">使用方法</label>
          <textarea
            value={currentLabel.usage}
            onChange={(e) => updateLabelBasic({ usage: e.target.value })}
            placeholder="请输入使用方法..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brown-600 mb-1.5">保存期限</label>
          <input
            type="text"
            value={currentLabel.shelfLife}
            onChange={(e) => updateLabelBasic({ shelfLife: e.target.value })}
            placeholder="例如：请于开盖后12个月内使用"
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-brown-600 mb-1.5">批次编号</label>
            <input
              type="text"
              value={currentLabel.batchNumber}
              onChange={(e) => updateLabelBasic({ batchNumber: e.target.value })}
              placeholder="例如：B20240101"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown-600 mb-1.5">过敏提示</label>
            <input
              type="text"
              value={currentLabel.allergyWarning}
              onChange={(e) => updateLabelBasic({ allergyWarning: e.target.value })}
              placeholder="过敏提示"
              className="input-field"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
