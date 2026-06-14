import type { Project } from "../../types/content";

const thorn: Project = {
  slug: "thorn",
  title: "THORN — Parametric Lighting System",
  tags: ["Blender", "Parametric", "3D"],
  blurb: {
    en: "A Red Dot Award–winning modular ceiling light, taken to production with a parametric Geometry Nodes pipeline.",
    tr: "Red Dot Award sahibi modüler bir tavan armatürü; parametrik Geometry Nodes pipeline'ı ile üretime taşındı.",
  },
  sections: [
    { kind: "heading", text: "THORN — Parametric Lighting System", className: "center" },
    {
      kind: "paragraph",
      className: "center scroll-fade",
      text: {
        en: "Thorn is a Red Dot Award–winning modular ceiling light by QZENS, built from three primary component types. Taking it to production meant solving a combinatorial problem: how do you document every valid configuration without manually tracking hundreds of part combinations?",
        tr: "Thorn, QZENS'in ürettiği ve Red Dot Award sahibi modüler bir tavan armatürüdür; üç temel bileşen tipi üzerine kurulmuştur. Projeyi üretime taşımak, kombinatoryal bir problemi çözmeyi gerektiriyordu: yüzlerce parça kombinasyonunu manuel olarak takip etmeden tüm geçerli konfigürasyonları nasıl belgelersiniz?",
      },
    },
    {
      kind: "gallery",
      gallery: {
        type: "ig",
        attr: { ratio: "square", igmodal: true },
        items: [
          { type: "webm", src: "/media/thorn/thorn-03-m.webm", attrs: ["autoplay", "muted", "playsinline"] },
          { type: "webp", src: "/media/thorn/thorn-07.webp" },
          { type: "webm", src: "/media/thorn/thorn-02-m.webm", attrs: ["autoplay", "muted", "playsinline"] },
          { type: "webm", src: "/media/thorn/thorn-01-m.webm", attrs: ["autoplay", "muted", "playsinline", "loop"] },
          {
            type: "text",
            content: {
              en: "A design-to-production pipeline where the 3D model and the manufacturing docs stay in sync",
              tr: "Tasarımdan üretime uzanan bir pipeline: 3D model ile üretim dökümanları her zaman senkron halinde",
            },
          },
          { type: "webp", src: "/media/thorn/thorn-00.webp" },
          { type: "webp", src: "/media/thorn/thorn-03.webp" },
          { type: "webp", src: "/media/thorn/thorn-06.webp" },
          {
            type: "text",
            content: {
              en: "A parametric generation system in Blender using Geometry Nodes and the Blender API that encodes the assembly rules directly into the node graph",
              tr: "Montaj kurallarını <em>node graph</em>'e kodlayan Geometry Nodes ve Blender API kullanarak gerçekleştirilen parametrik bir üretim sistemi",
            },
          },
          {
            type: "text",
            content: {
              en: "A custom export add-on reads the geometry at output time and compiles the component counts, part types, and configuration data",
              tr: "Çıktı anında bileşen sayılarını, parça tiplerini ve konfigürasyon verilerini üretime hazır dokümantasyonda derleyen add-on",
            },
          },
          { type: "webp", src: "/media/thorn/thorn-02.webp" },
          { type: "webp", src: "/media/thorn/thorn-05.webp" },
        ],
      },
    },
  ],
};

export default thorn;
