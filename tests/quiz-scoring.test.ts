import { describe, it, expect } from "vitest";
import { gradeQuestion, normalizeShortAnswer } from "../src/lib/quiz-scoring";

describe("quiz-scoring", () => {
  it("normalizes Kazakh and Russian short answers deterministically", () => {
    expect(normalizeShortAnswer("  Қазақстан   Республикасы ")).toBe(
      "қазақстан республикасы"
    );
  });

  it("grades SINGLE choice questions accurately", () => {
    expect(
      gradeQuestion({
        type: "SINGLE",
        selected: ["opt-2"],
        correctOptionIds: ["opt-2"],
        correctOptionTexts: ["Ағаш"],
      })
    ).toBe(true);

    expect(
      gradeQuestion({
        type: "SINGLE",
        selected: ["opt-1"],
        correctOptionIds: ["opt-2"],
        correctOptionTexts: ["Ағаш"],
      })
    ).toBe(false);
  });

  it("grades MULTIPLE choice questions strictly (exact set match)", () => {
    expect(
      gradeQuestion({
        type: "MULTIPLE",
        selected: ["a", "c"],
        correctOptionIds: ["c", "a"],
        correctOptionTexts: [],
      })
    ).toBe(true);

    expect(
      gradeQuestion({
        type: "MULTIPLE",
        selected: ["a"],
        correctOptionIds: ["a", "c"],
        correctOptionTexts: [],
      })
    ).toBe(false);

    expect(
      gradeQuestion({
        type: "MULTIPLE",
        selected: ["a", "b", "c"],
        correctOptionIds: ["a", "c"],
        correctOptionTexts: [],
      })
    ).toBe(false);
  });

  it("grades TRUE_FALSE and SHORT answers accurately", () => {
    expect(
      gradeQuestion({
        type: "TRUE_FALSE",
        selected: ["true-id"],
        correctOptionIds: ["true-id"],
        correctOptionTexts: ["Дұрыс"],
      })
    ).toBe(true);

    expect(
      gradeQuestion({
        type: "SHORT",
        selected: ["  Астана "],
        correctOptionIds: ["s1"],
        correctOptionTexts: ["астана"],
      })
    ).toBe(true);

    expect(
      gradeQuestion({
        type: "SHORT",
        selected: [""],
        correctOptionIds: ["s1"],
        correctOptionTexts: ["астана"],
      })
    ).toBe(false);
  });
});
