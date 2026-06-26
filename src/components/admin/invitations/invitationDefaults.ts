import type { OptionItem, Step, StepKey } from "../../../api";

export const STEP_KEYS: StepKey[] = ["film", "table", "glass", "activity"];

const STEP_DEFAULTS: Record<StepKey, { title: string; subtitle: string }> = {
  film: {
    title: "THE FILM",
    subtitle: "Lights out. Candles up. Private cinema.",
  },
  table: {
    title: "THE TABLE",
    subtitle: "Something tasteful and chosen by you.",
  },
  glass: {
    title: "THE GLASS",
    subtitle: "Pick your poison — or keep it innocent.",
  },
  activity: {
    title: "THE ACTIVITY",
    subtitle: "A small ritual for the right kind of date.",
  },
};

const STEP_OPTION_DEFAULTS: Record<StepKey, OptionItem[]> = {
  film: [
    {
      id: "film-blondes",
      label: "Gentlemen prefer blonds",
      imageUrl:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "film-prestige",
      label: "The Prestige",
      imageUrl:
        "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "film-kill-bill",
      label: "Kill Bill",
      imageUrl:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
    },
  ],
  table: [
    {
      id: "table-dessert",
      label: "Sweet dessert",
      imageUrl:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "table-popcorn",
      label: "Popcorn",
      imageUrl:
        "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "table-italian",
      label: "Italian",
      imageUrl:
        "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?auto=format&fit=crop&w=600&q=80",
    },
  ],
  glass: [
    {
      id: "glass-mojito",
      label: "Mojito",
      imageUrl:
        "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "glass-gin-tonic",
      label: "Gin Tonic",
      imageUrl:
        "https://images.unsplash.com/photo-1621873495884-845a939892d7?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "glass-zero",
      label: "0%",
      imageUrl:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80",
    },
  ],
  activity: [
    {
      id: "activity-cards",
      label: "Cards",
      imageUrl:
        "https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "activity-cooking",
      label: "Cooking together",
      imageUrl:
        "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "activity-dancing",
      label: "Dancing",
      imageUrl:
        "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
    },
  ],
};

export const DEFAULT_LETTER_BODY =
  "I send this letter as an invite,\nfor Saturday, soft and light.\n\nYou've had long tests, little rest,\nso I planned something gentle —\nbut dressed its best.\n\nA film, a flavour, something to do,\nall quietly chosen, but left up to you.\n\nSo take your pick, my dear May —\nand I'll take care of the rest of the day.";

export const DEFAULT_PICKUP_TIME = "1:00 PM, Saturday 27.06.2026";

export function duplicateSteps(steps: Step[]): Step[] {
  return steps.map((step) => ({
    ...step,
    options: step.options.map((option) => ({ ...option })),
  }));
}

export function defaultSteps(): Step[] {
  return STEP_KEYS.map((key) => ({
    key,
    ...STEP_DEFAULTS[key],
    options: STEP_OPTION_DEFAULTS[key].map((option) => ({ ...option })),
  }));
}
