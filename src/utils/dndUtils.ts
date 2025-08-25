export function replaceButtonRefs(
  text: string,
  oldToNew: Record<number, number>
): string {
  if (!text) return text;
  return text.replace(
    /Button\s*\[\s*(\d+)\s*\]/g,
    (match, p1) => {
      const oldArrIdx = Number(p1);
      const newArrIdx = oldToNew[oldArrIdx];
      return newArrIdx !== undefined ? `Button[${newArrIdx}]` : match;
    }
  );
}
