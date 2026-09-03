import { Font, StyleSheet } from "@react-pdf/renderer";
import { asset } from "../asset";

Font.register({
  family: "Inter",
  fonts: [
    { src: asset("/fonts/Inter-Regular.ttf"), fontWeight: 400 },
    { src: asset("/fonts/Inter-Bold.ttf"), fontWeight: 700 },
    { src: asset("/fonts/Inter-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

export const INK = "#000000";
export const MUTED = "#555555";
export const LINE = "#000000";

export const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 9.5,
    lineHeight: 1.45,
    color: INK,
    backgroundColor: "#ffffff",
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 28,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingBottom: 10,
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    lineHeight: 1.2,
    fontWeight: 700,
    letterSpacing: -0.4,
  },
  label: {
    fontSize: 10,
    color: MUTED,
    marginTop: 7,
  },
  contact: {
    fontSize: 8.5,
    color: MUTED,
    textAlign: "right",
    lineHeight: 1.5,
  },
  contactLink: {
    color: MUTED,
    textDecoration: "none",
  },
  summary: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 11,
    fontWeight: 700,
    marginTop: 6,
    marginBottom: 8,
  },
  item: {
    marginBottom: 11,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  rowTitle: {
    fontWeight: 700,
    flexShrink: 1,
    paddingRight: 12,
  },
  rowMeta: {
    fontSize: 8.5,
    color: MUTED,
  },
  metaLine: {
    fontSize: 8.5,
    color: MUTED,
    marginBottom: 3,
  },
  bullet: {
    flexDirection: "row",
    marginTop: 2,
  },
  bulletMark: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  link: {
    fontSize: 8.5,
    color: MUTED,
    textDecoration: "none",
  },
  description: {
    marginTop: 2,
  },
});
