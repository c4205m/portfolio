import type { ExternalProject } from "../../types/content";

export const externalProjects: ExternalProject[] = [
  {
    slug: "0-days-without-accidents",
    title: "0 Days Without Accidents",
    blurb: {
      en: "An award-winning endless runner that took 1st place at a Devpost hackathon, with levels assembled by a modular tile-based generation system.",
      tr: "Devpost hackathon birinciliği kazanan endless runner; modüler tile-based üretim sistemiyle level kurulumu.",
    },
    tags: ["Unity", "Game", "Procedural"],
    url: "https://devpost.com/software/dayswoaccident",
    label: {
      en: "View on Devpost",
      tr: "Devpost'ta Görüntüle",
    },
  },
  {
    slug: "nla-batch-editor",
    title: "NLA Batch Editor",
    blurb: {
      en: "A GNU-licensed, open-source Blender add-on for faster work in the NLA Editor: batch pushdown, track and strip management, and bulk cleanup.",
      tr: "NLA Editor içinde hızlı çalışma için GNU lisanslı açık kaynak Blender add-on'u: batch pushdown, track ve strip yönetimi, toplu temizleme.",
    },
    tags: ["Blender", "Python", "Open Source"],
    url: "https://github.com/c4205m/NLA-Batch-Editor",
    label: {
      en: "View on Github",
      tr: "Github'da Görüntüle",
    },
  },
];
