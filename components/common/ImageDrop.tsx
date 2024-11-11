"use client";
import { ReactNode, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { cn } from "@/libs/utils";
type Props = {
  children?: ReactNode;
};

const ImageDrop = (props: Props) => {
  const [images, setImages] = useState([1, 2, 3, 4, 5]);

  const handleDragEnd = (e: DragEndEvent) => {
    console.log("Drag end data", e);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Dropable />
    </DndContext>
  );
};

const Dropable = (props: Props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="h-28 bg-orange-300">
      {props.children}
    </div>
  );
};

const Draggable = (props: Props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
};

export { ImageDrop };
