import { defineConfig } from "astro/config";

const base = "/";

function prefixRootUrls() {
  return (tree) => {
    const walk = (node) => {
      if ((node.type === "image" || node.type === "link") && node.url?.startsWith("/")) {
        node.url = `${base.replace(/\/$/, "")}${node.url}`;
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  output: "static",
  base,
  markdown: { remarkPlugins: [prefixRootUrls] },
});
