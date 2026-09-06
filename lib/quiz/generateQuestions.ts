import type { QuizQuestion } from "@/types/quiz";
import { SAMPLE_WORDS } from "@/lib/dictionary/sampleWords";
import { PHRASAL_VERBS } from "@/lib/phrasalVerbs/data";
import { GRAMMAR_POINTS } from "@/lib/grammar/data";
import { IDIOMS } from "@/lib/idioms/data";
import { PREPOSITIONS } from "@/lib/prepositions/data";
import { DISCOVERY_ENTRIES } from "@/lib/discovery/data";

/**
 * Every quiz question is generated from data that already exists — no
 * separate quiz content was authored. The correct answer for one entry
 * becomes a distractor for others in the same module, so question quality
 * scales automatically as each module's content grows.
 *
 * Vocabulary deliberately draws from the 20 curated SAMPLE_WORDS rather
 * than the full Core 3000 list: those are the only words with complete
 * offline definitions (Core 3000 itself is just word/slug/level/part of
 * speech — full definitions come from a network dictionary lookup). Using
 * them keeps quiz generation fully local and instant for every module,
 * with no loading state or network-failure handling needed anywhere in
 * the quiz flow.
 */

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuestion<T>(
  moduleId: string,
  moduleLabel: string,
  pool: T[],
  correctItem: T,
  promptFn: (item: T) => string,
  answerFn: (item: T) => string,
  slugFn: (item: T) => string,
  hrefFn: (slug: string) => string
): QuizQuestion | null {
  const correctAnswer = answerFn(correctItem);
  const distractorPool = pool.filter((item) => item !== correctItem && answerFn(item) !== correctAnswer);
  if (distractorPool.length < 3) return null;

  const distractors = shuffle(distractorPool).slice(0, 3).map(answerFn);
  const options = shuffle([correctAnswer, ...distractors]);
  const slug = slugFn(correctItem);

  return {
    id: `${moduleId}-${slug}`,
    moduleId,
    moduleLabel,
    prompt: promptFn(correctItem),
    options,
    correctAnswer,
    sourceSlug: slug,
    sourceHref: hrefFn(slug),
  };
}

function vocabularyQuestions(count: number): QuizQuestion[] {
  const picks = shuffle(SAMPLE_WORDS).slice(0, count);
  return picks
    .map((w) =>
      buildQuestion(
        "vocabulary",
        "Vocabulary",
        SAMPLE_WORDS,
        w,
        (item) => `What does "${item.word}" mean?`,
        (item) => item.definitions[0]?.simpleDefinition ?? item.definitions[0]?.meaning ?? "",
        (item) => item.slug,
        (slug) => `/word/${slug}`
      )
    )
    .filter((q): q is QuizQuestion => q !== null);
}

function phrasalVerbQuestions(count: number): QuizQuestion[] {
  const picks = shuffle(PHRASAL_VERBS).slice(0, count);
  return picks
    .map((p) =>
      buildQuestion(
        "phrasal-verbs",
        "Phrasal Verbs",
        PHRASAL_VERBS,
        p,
        (item) => `What does "${item.phrase}" mean?`,
        (item) => item.senses[0]?.simpleDefinition ?? item.senses[0]?.meaning ?? "",
        (item) => item.slug,
        (slug) => `/phrasal-verbs/${slug}`
      )
    )
    .filter((q): q is QuizQuestion => q !== null);
}

function grammarQuestions(count: number): QuizQuestion[] {
  const picks = shuffle(GRAMMAR_POINTS).slice(0, count);
  return picks
    .map((g) =>
      buildQuestion(
        "grammar",
        "Grammar",
        GRAMMAR_POINTS,
        g,
        (item) => `What is "${item.title}"?`,
        (item) => item.explanation,
        (item) => item.slug,
        (slug) => `/grammar/${slug}`
      )
    )
    .filter((q): q is QuizQuestion => q !== null);
}

function idiomQuestions(count: number): QuizQuestion[] {
  const picks = shuffle(IDIOMS).slice(0, count);
  return picks
    .map((i) =>
      buildQuestion(
        "idioms",
        "Idioms",
        IDIOMS,
        i,
        (item) => `What does the idiom "${item.idiom}" mean?`,
        (item) => item.simpleDefinition,
        (item) => item.slug,
        (slug) => `/idioms/${slug}`
      )
    )
    .filter((q): q is QuizQuestion => q !== null);
}

function prepositionQuestions(count: number): QuizQuestion[] {
  const picks = shuffle(PREPOSITIONS).slice(0, count);
  return picks
    .map((p) =>
      buildQuestion(
        "prepositions",
        "Prepositions",
        PREPOSITIONS,
        p,
        (item) => `How is "${item.phrase}" used?`,
        (item) => item.senses[0]?.explanation ?? "",
        (item) => item.slug,
        (slug) => `/prepositions/${slug}`
      )
    )
    .filter((q): q is QuizQuestion => q !== null);
}

function encyclopediaQuestions(count: number): QuizQuestion[] {
  const picks = shuffle(DISCOVERY_ENTRIES).slice(0, count);
  return picks
    .map((e) =>
      buildQuestion(
        "encyclopedia",
        "Encyclopedia",
        DISCOVERY_ENTRIES,
        e,
        (item) => `Which fact is true about ${item.name}?`,
        (item) => item.facts[0] ?? item.simpleFact,
        (item) => item.slug,
        (slug) => `/encyclopedia/${slug}`
      )
    )
    .filter((q): q is QuizQuestion => q !== null);
}

const MODULE_GENERATORS: Record<string, (count: number) => QuizQuestion[]> = {
  vocabulary: vocabularyQuestions,
  "phrasal-verbs": phrasalVerbQuestions,
  grammar: grammarQuestions,
  idioms: idiomQuestions,
  prepositions: prepositionQuestions,
  encyclopedia: encyclopediaQuestions,
};

export const QUIZ_MODULE_IDS = Object.keys(MODULE_GENERATORS);

export const QUIZ_MODULE_LABEL: Record<string, string> = {
  vocabulary: "Vocabulary",
  "phrasal-verbs": "Phrasal Verbs",
  grammar: "Grammar",
  idioms: "Idioms",
  prepositions: "Prepositions",
  encyclopedia: "Encyclopedia",
};

/** Random Mix mode: questions spread across all modules. */
export function generateRandomQuiz(count = 10): QuizQuestion[] {
  const perModule = Math.max(2, Math.ceil(count / QUIZ_MODULE_IDS.length));
  const all = QUIZ_MODULE_IDS.flatMap((id) => MODULE_GENERATORS[id](perModule));
  return shuffle(all).slice(0, count);
}

/** Topic mode: questions from a single module. */
export function generateTopicQuiz(moduleId: string, count = 10): QuizQuestion[] {
  const generator = MODULE_GENERATORS[moduleId];
  if (!generator) return [];
  return generator(count);
}

/** Model Test mode: a longer, fixed composition spanning every module evenly. */
export function generateExamQuiz(perModule = 4): QuizQuestion[] {
  const all = QUIZ_MODULE_IDS.flatMap((id) => MODULE_GENERATORS[id](perModule));
  return shuffle(all);
}
