import type { Project } from "../../types/content";

const azuki: Project = {
  slug: "azuki",
  title: "Azuki: Elemental XR Experience",
  tags: ["XR", "VFX", "Shaders"],
  blurb: {
    en: "An augmented reality experience promoting Azuki's merchandise through four real-time elemental VFX systems.",
    tr: "Azuki'nin merchandise'ını dört gerçek zamanlı elementel VFX sistemiyle öne çıkaran bir artırılmış gerçeklik deneyimi.",
  },
  sections: [
    { kind: "heading", text: "Azuki: Elemental XR Experience", className: "center" },
    {
      kind: "gallery",
      gallery: {
        type: "slider",
        attr: { size: "0 0 150px", ratio: "vertical" },
        items: [
          { type: "webm", src: "/media/azuki/azuki-earth.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          { type: "webm", src: "/media/azuki/azuki-fire.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          { type: "webm", src: "/media/azuki/azuki-lightning.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          { type: "webm", src: "/media/azuki/azuki-water.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
        ],
      },
    },
    {
      kind: "paragraph",
      className: "center",
      text: {
        en: "An augmented reality experience built to promote Azuki's merchandise through effects tied to the brand's character universe.",
        tr: "Azuki'nin karakter evreninden ilham alınan efektlerle markanın merchandise'ını öne çıkarmak için tasarlanmış bir artırılmış gerçeklik deneyimi.",
      },
    },
    {
      kind: "gallery",
      gallery: {
        type: "ig",
        attr: { ratio: "square", igmodal: true },
        items: [
          { type: "webm", src: "/media/azuki/src0.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          {
            type: "text",
            content: {
              en: "Custom GPU shaders that drive both the particle systems and vertex displacement",
              tr: "Particle system ve vertex displacement değerlerini yöneten özel GPU shader'lar",
            },
          },
          { type: "webm", src: "/media/azuki/src6.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          { type: "webp", src: "/media/azuki/src_code.png" },
          { type: "webm", src: "/media/azuki/src10.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          { type: "webm", src: "/media/azuki/src1.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          {
            type: "text",
            title: { en: "Four Real-time VFX", tr: "Gerçek zamanlı VFX" },
            content: { en: "Inspired by Azuki universe", tr: "Azuki evreninden esinlendi" },
          },
          { type: "webp", src: "/media/azuki/src7.png" },
          { type: "webm", src: "/media/azuki/src3.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          { type: "webm", src: "/media/azuki/src9.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          {
            type: "text",
            content: {
              en: "High visual fidelity within mobile XR performance constraints",
              tr: "Mobil XR performans kısıtları içinde yüksek görüntü kalitesi sağlayan optimizasyon",
            },
          },
          { type: "webp", src: "/media/azuki/src8.png" },
        ],
      },
    },
  ],
};

export default azuki;
