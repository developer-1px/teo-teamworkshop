import React, { useState } from 'react';
import { Item } from '../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  defaultDropAnimationSideEffects,
  DragOverlayProps,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableListProps {
  items: Item[];
  initialOrder?: string[];
  onComplete: (orderedIds: string[]) => void;
  title: string;
  description: string;
  submitLabel: string;
  colorTheme: string;
}

// Helper for theme classes
const getThemeStyles = (theme: string) => {
  if (theme === 'cyan') {
    return {
      activeBorder: 'border-cyan-500',
      activeRing: 'ring-cyan-200',
      rankBadgeTop: 'bg-cyan-600/80 text-white',
      rankBadgeNormal: 'bg-gray-100/80 text-gray-600',
      overlayBorder: 'border-cyan-600',
      overlayBg: 'bg-cyan-600/90',
      previewPanelBg: 'bg-cyan-50',
      previewPanelBorder: 'border-cyan-200',
      previewPanelIcon: 'bg-cyan-600',
      button: 'bg-cyan-700 hover:bg-cyan-600 shadow-cyan-900/20',
    };
  }
  // Default to slate
  return {
    activeBorder: 'border-slate-500',
    activeRing: 'ring-slate-200',
    rankBadgeTop: 'bg-slate-700/80 text-white',
    rankBadgeNormal: 'bg-gray-100/80 text-gray-600',
    overlayBorder: 'border-slate-700',
    overlayBg: 'bg-slate-700/90',
    previewPanelBg: 'bg-slate-50',
    previewPanelBorder: 'border-slate-200',
    previewPanelIcon: 'bg-slate-700',
    button: 'bg-slate-800 hover:bg-slate-700 shadow-slate-900/20',
  };
};

// --- Sortable Item Component ---
interface SortableItemProps {
  id: string;
  item: Item;
  rank: number;
  isActive?: boolean;
  themeStyles: ReturnType<typeof getThemeStyles>;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, item, rank, isActive, themeStyles }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative aspect-square flex flex-col p-3 rounded-2xl border-2 transition-all select-none touch-manipulation bg-white
        ${isActive ? `${themeStyles.activeBorder} ring-4 ${themeStyles.activeRing}` : 'border-gray-100 shadow-sm'}
        hover:border-gray-300
      `}
    >
      <div className={`
        absolute top-2 left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-sm backdrop-blur-[1px]
        ${rank <= 3 ? themeStyles.rankBadgeTop : themeStyles.rankBadgeNormal}
      `}>
        {rank}
      </div>
      
      <div className="flex-1 flex items-center justify-center text-center mt-3 overflow-hidden px-1">
        <span className="text-[11px] leading-tight font-bold text-gray-700 line-clamp-3 break-words">
          {item.name}
        </span>
      </div>
    </div>
  );
};

// --- Item Component for Overlay (Drag Preview) ---
const ItemOverlay: React.FC<{ item: Item; rank: number; themeStyles: ReturnType<typeof getThemeStyles> }> = ({ item, rank, themeStyles }) => (
  <div className={`aspect-square flex flex-col p-3 rounded-2xl border-2 ${themeStyles.overlayBorder} bg-white shadow-2xl opacity-95 scale-105 cursor-grabbing`}>
    <div className={`absolute top-2 left-2 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${themeStyles.overlayBg} text-white shadow-sm`}>
      {rank}
    </div>
    <div className="flex-1 flex items-center justify-center text-center mt-3">
       <span className="text-xs leading-tight font-bold text-gray-900">
          {item.name}
        </span>
    </div>
  </div>
);

// --- Main Component ---
const SortableList: React.FC<SortableListProps> = ({ 
  items, 
  initialOrder, 
  onComplete, 
  title, 
  description,
  submitLabel,
  colorTheme
}) => {
  const themeStyles = getThemeStyles(colorTheme);

  // Ordered Items
  const [activeItems, setActiveItems] = useState<Item[]>(() => {
    if (initialOrder) {
      return initialOrder
        .map(id => items.find(i => i.id === id))
        .filter((i): i is Item => !!i);
    }
    return [...items];
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setOverId(active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setOverId(over ? (over.id as string) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setActiveItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
    setOverId(null);
  };

  // Get current rank of active item for display
  const activeItemObj = activeId ? activeItems.find(i => i.id === activeId) : null;
  const activeIndex = activeId ? activeItems.findIndex(i => i.id === activeId) : -1;
  const overIndex = (overId && activeItems) ? activeItems.findIndex(i => i.id === overId) : -1;
  
  // Calculate target rank (if overIndex is valid, use it, otherwise fallback to activeIndex)
  const targetRank = overIndex !== -1 ? overIndex + 1 : activeIndex + 1;
  const currentRank = activeIndex + 1;
  const isRankChanging = activeId && overId && activeIndex !== overIndex && overIndex !== -1;

  const dropAnimation: DragOverlayProps['dropAnimation'] = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
      <div className="px-5 py-6 shrink-0">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{title}</h2>
        <p className="text-gray-500 text-sm mb-5 leading-relaxed">{description}</p>
        
        {/* Preview Panel: Shows details of the item currently being interacted with */}
        <div className={`
          h-20 p-4 rounded-2xl border flex items-center transition-all shadow-sm
          ${activeItemObj ? `${themeStyles.previewPanelBg} ${themeStyles.previewPanelBorder}` : 'bg-gray-50 border-gray-100'}
        `}>
          {activeItemObj ? (
            <div className="flex items-center w-full animate-fade-in">
              <div className="mr-4 flex items-center justify-center shrink-0 min-w-[3.5rem]">
                {isRankChanging ? (
                  <div className="flex items-center space-x-2 bg-white/60 px-2 py-1 rounded-full border border-gray-200/50">
                    <span className="text-gray-400 font-bold text-lg line-through decoration-2 opacity-60">
                      {currentRank}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span className={`w-9 h-9 rounded-full ${themeStyles.previewPanelIcon} text-white flex items-center justify-center font-bold text-lg shadow-md transform scale-110`}>
                      {targetRank}
                    </span>
                  </div>
                ) : (
                  <span className={`w-10 h-10 rounded-full ${themeStyles.previewPanelIcon} text-white flex items-center justify-center font-bold text-xl shadow-md`}>
                    {currentRank}
                  </span>
                )}
              </div>
              <p className="font-bold text-gray-800 text-base leading-tight line-clamp-2">
                {activeItemObj.name}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm font-medium text-center w-full">
              타일을 길게 눌러 드래그하여 중요도 순으로 배치하세요
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-32 scrollbar-hide">
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter} 
          onDragStart={handleDragStart} 
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={activeItems.map(i => i.id)} 
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-4 gap-3">
              {activeItems.map((item, index) => (
                <SortableItem 
                  key={item.id} 
                  id={item.id} 
                  item={item} 
                  rank={index + 1}
                  isActive={item.id === activeId}
                  themeStyles={themeStyles}
                />
              ))}
            </div>
          </SortableContext>
          
          <DragOverlay dropAnimation={dropAnimation}>
            {activeItemObj ? (
              <ItemOverlay item={activeItemObj} rank={targetRank} themeStyles={themeStyles} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white/90 backdrop-blur-md border-t border-gray-100 z-10 flex justify-center">
        <button
          onClick={() => onComplete(activeItems.map(i => i.id))}
          className={`
            w-full max-w-md py-4 px-6 rounded-2xl font-bold text-white text-lg shadow-lg transform transition active:scale-[0.98]
            ${themeStyles.button}
          `}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default SortableList;