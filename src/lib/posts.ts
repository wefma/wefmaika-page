export type Post = { slug: string; title: string; description: string; date: Date; image: string; minRead?: number; Content: any };
const postModules = import.meta.glob("../../content/blog/*.md");

export async function getPosts(): Promise<Post[]> {
  const posts = await Promise.all(Object.entries(postModules).map(async ([path, load]) => {
    const module = await load() as any;
    const frontmatter = module.frontmatter;
    return { slug: path.split("/").pop()!.replace(/\.md$/, ""), title: frontmatter.title, description: frontmatter.description, date: new Date(frontmatter.date), image: frontmatter.image, minRead: frontmatter.minRead, Content: module.default };
  }));
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const formatDate = (date: Date) => new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(date);
