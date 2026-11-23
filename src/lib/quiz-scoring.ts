export function normalizeShortAnswer(input: string): string {
  return input.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

export function gradeQuestion({
  type,
  selected,
  correctOptionIds,
  correctOptionTexts,
}: {
  type: string;
  selected: string[];
  correctOptionIds: string[];
  correctOptionTexts: string[];
}): boolean {
  if (type === "SHORT") {
    const submitted = normalizeShortAnswer(selected[0] || "");
    if (!submitted) return false;
    return correctOptionTexts.some(
      (text) => normalizeShortAnswer(text) === submitted
    );
  }

  const uniqueSelected = [...new Set(selected.filter(Boolean))];
  const uniqueCorrect = [...new Set(correctOptionIds.filter(Boolean))];
  if (uniqueCorrect.length === 0) return false;

  return (
    uniqueSelected.length === uniqueCorrect.length &&
    uniqueCorrect.every((id) => uniqueSelected.includes(id))
  );
}

