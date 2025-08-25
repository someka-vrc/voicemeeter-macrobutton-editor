import { useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { MacroButton } from "../types/macroButton";
import { replaceButtonRefs } from "../utils/dndUtils";

export function useMacroButtonDnD(items: MacroButton[], setItems: (items: MacroButton[]) => void) {
  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      let newItems = arrayMove(items, oldIndex, newIndex);
      const oldToNewArrIdx: Record<number, number> = {};
      newItems.forEach((item, newArrIdx) => {
        const oldArrIdx = items.indexOf(item);
        oldToNewArrIdx[oldArrIdx] = newArrIdx;
      });
      newItems = newItems.map((item, newArrIdx) => {
        return {
          ...item,
          index: newArrIdx + 1,
          VBHIDMapItem: {
            ...item.VBHIDMapItem,
            name: `Button#${newArrIdx}`,
            id: `MBhid${newArrIdx}`,
          },
          MB_InitRequest: replaceButtonRefs(item.MB_InitRequest, oldToNewArrIdx),
          MB_OnRequest: replaceButtonRefs(item.MB_OnRequest, oldToNewArrIdx),
          MB_OffRequest: replaceButtonRefs(item.MB_OffRequest, oldToNewArrIdx),
        };
      });
      setItems(newItems);
    }
  }, [items, setItems]);

  return { handleDragEnd };
}
