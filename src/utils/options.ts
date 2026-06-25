import { nextSundaySchedule } from "./dates";

export type ChoiceCategoryId = "film" | "table" | "glass" | "activity";

export interface ChoiceOption {
  id: string;
  title: string;
  description: string;
  tag: string;
  imageUrl: string;
}

export interface ChoiceCategory {
  id: ChoiceCategoryId;
  label: string;
  type: "single" | "multi";
  prompt: string;
  options: ChoiceOption[];
}

export interface DateEvent {
  id: string;
  title: string;
  dateLabel: string;
  opensAt: string;
  deadlineAt: string;
  pickupAt: string;
  pickupNote: string;
  venueNote: string;
  hostNote: string;
  letterBody: string;
  categories: ChoiceCategory[];
  response: unknown;
  status: "waiting" | "open" | "locked";
  createdAt: string;
  updatedAt: string;
}

export const defaultLetterBody = [
  "I send this letter as an invite,",
  "for Saturday, soft and light.",
  "",
  "You’ve had long skies, little rest,",
  "so I planned something gentle —",
  "but dressed its best.",
  "",
  "A film, a flavour, something to do,",
  "all quietly chosen, but left up to you.",
  "",
  "So take your pick, my dear May —",
  "and I’ll take care of the rest of the day."
].join("\n");

export const categoryOrder: ChoiceCategoryId[] = ["film", "table", "glass", "activity"];

export const categoryBlueprints: Record<ChoiceCategoryId, Omit<ChoiceCategory, "options">> = {
  film: {
    id: "film",
    label: "The Film",
    type: "single",
    prompt: "Lights out. Candles up. Private cinema."
  },
  table: {
    id: "table",
    label: "The Table",
    type: "single",
    prompt: "Something tasteful and chosen by you."
  },
  glass: {
    id: "glass",
    label: "The Glass",
    type: "single",
    prompt: "Pick your poison — or keep it innocent."
  },
  activity: {
    id: "activity",
    label: "The Activity",
    type: "multi",
    prompt: "A small ritual for the right kind of date."
  }
};

export function defaultCategories(): ChoiceCategory[] {
  return [
    {
      ...categoryBlueprints.film,
      options: [
        option("gentlemen-prefer-blondes", "Gentlemen prefer blonds", "Old Hollywood sparkle and mischief.", "glamour", "https://image.tmdb.org/t/p/w500/fE7bGk6orH12Nv0KxZxm2lVD8P0.jpg"),
        option("the-prestige", "The Prestige", "Private cinema, candle-dark magic.", "cinema", "https://image.tmdb.org/t/p/w500/bdN3gXuIZYaJP7ftKK2sU0nPtEA.jpg"),
        option("kill-bill", "Kill Bill", "Sharp, iconic, bold.", "bold", "https://image.tmdb.org/t/p/w500/v7TaX8kXMXs5yFFGR41guUDNcnB.jpg")
      ]
    },
    {
      ...categoryBlueprints.table,
      options: [
        option("sweet-dessert", "Sweet dessert", "A soft little plate after everything.", "sweet", "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80"),
        option("popcorn", "Popcorn", "Cinema ritual, dressed up just enough.", "film", "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80"),
        option("italian", "Italian", "Tomatoes, herbs, and a good table.", "table", "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80")
      ]
    },
    {
      ...categoryBlueprints.glass,
      options: [
        option("mojito", "Mojito", "Bright, minty, and fresh.", "fresh", "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80"),
        option("gin-tonic", "Gin Tonic", "Clear, crisp, a little grown up.", "classic", "https://images.unsplash.com/photo-1587223962930-cb7f31384c19?auto=format&fit=crop&w=600&q=80"),
        option("zero-percent", "0%", "Pretty and innocent.", "soft", "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80")
      ]
    },
    {
      ...categoryBlueprints.activity,
      options: [
        option("cards", "Cards", "A small game with candlelight nearby.", "play", "https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80"),
        option("cooking-together", "Cooking together", "I save you a graceful little task.", "together", "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80"),
        option("dancing", "Dancing", "One song, no audience.", "dance", "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80")
      ]
    }
  ];
}

export function createBlankEventDraft(): DateEvent {
  const schedule = nextSundaySchedule();
  const now = new Date().toISOString();

  return {
    id: "",
    title: "Sunday, written in candlelight",
    dateLabel: schedule.dateLabel,
    opensAt: schedule.opensAtIso,
    deadlineAt: schedule.deadlineAtIso,
    pickupAt: schedule.pickupAtIso,
    pickupNote: "I’ll pick you up",
    venueNote: "Home table, candles, something pretty waiting.",
    hostNote: "A small invitation for a soft Sunday.",
    letterBody: defaultLetterBody,
    categories: defaultCategories(),
    response: null,
    status: "open",
    createdAt: now,
    updatedAt: now
  };
}

export function duplicateEventDraft(event: DateEvent): DateEvent {
  return {
    ...event,
    id: "",
    title: `${event.title} copy`,
    response: null,
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function emptyOption(prefix: string, index: number): ChoiceOption {
  return option(`${prefix}-${index + 1}`, "", "", "");
}

export function slugify(value: string, fallback = "option") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || fallback;
}

function option(id: string, title: string, description: string, tag: string, imageUrl = ""): ChoiceOption {
  return { id, title, description, tag, imageUrl };
}
