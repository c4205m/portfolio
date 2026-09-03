import { Fragment } from "react";
import { Text } from "@react-pdf/renderer";

const TOKEN = /<(\/?)(strong|b|em|i)>/gi;

export function richText(value: string) {
  const nodes: JSX.Element[] = [];
  let bold = 0;
  let italic = 0;
  let cursor = 0;
  let key = 0;

  const push = (text: string) => {
    if (!text) return;
    nodes.push(
      <Text
        key={key++}
        style={{
          fontWeight: bold > 0 ? 700 : 400,
          fontStyle: italic > 0 ? "italic" : "normal",
        }}
      >
        {text}
      </Text>,
    );
  };

  for (const match of value.matchAll(TOKEN)) {
    push(decode(value.slice(cursor, match.index)));
    const closing = match[1] === "/";
    const tag = match[2].toLowerCase();
    const delta = closing ? -1 : 1;
    if (tag === "strong" || tag === "b") bold = Math.max(0, bold + delta);
    else italic = Math.max(0, italic + delta);
    cursor = match.index + match[0].length;
  }
  push(decode(value.slice(cursor)));

  return <Fragment>{nodes}</Fragment>;
}

function decode(text: string) {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}
