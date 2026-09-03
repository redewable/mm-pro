"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";

// Drag-and-drop reorderable list or grid. Works with mouse, touch (press and
// hold on the handle) and keyboard. Up/down buttons are always present as a
// fallback for lists; grids rely on the handle.
export function SortableList<T extends { id: string }>({
  items,
  onChange,
  render,
  className = "",
  layout = "list",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  render: (item: T, index: number, controls: ReactNode) => ReactNode;
  className?: string;
  layout?: "list" | "grid";
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    onChange(arrayMove(items, from, to));
  }

  function move(index: number, d: number) {
    const to = index + d;
    if (to < 0 || to >= items.length) return;
    onChange(arrayMove(items, index, to));
  }

  const grid = layout === "grid";

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={grid ? rectSortingStrategy : verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item, index) => (
            <Row key={item.id} id={item.id} grid={grid}>
              {(handle) =>
                render(
                  item,
                  index,
                  grid ? (
                    handle
                  ) : (
                    <div className="flex items-center gap-0.5">
                      {handle}
                      <button
                        type="button"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        className="hidden sm:inline-flex p-1.5 rounded text-slate hover:text-navy hover:bg-gray-100 disabled:opacity-30"
                        aria-label="Move up"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        className="hidden sm:inline-flex p-1.5 rounded text-slate hover:text-navy hover:bg-gray-100 disabled:opacity-30"
                        aria-label="Move down"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                      </button>
                    </div>
                  )
                )
              }
            </Row>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function Row({ id, grid, children }: { id: string; grid: boolean; children: (handle: ReactNode) => ReactNode }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      className={
        grid
          ? "w-8 h-8 rounded-full bg-white/90 text-navy shadow flex items-center justify-center cursor-grab active:cursor-grabbing touch-none hover:bg-white"
          : "p-1.5 rounded text-slate hover:text-navy hover:bg-gray-100 cursor-grab active:cursor-grabbing touch-none"
      }
      aria-label="Drag to reorder"
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
      </svg>
    </button>
  );
  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "relative z-10 opacity-90 shadow-xl" : ""}>
      {children(handle)}
    </div>
  );
}
