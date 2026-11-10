import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const contentRoot = fileURLToPath(new URL("../../content/", import.meta.url));

export type Button = { label: string; to?: string; target?: string };
export type PageData = { title: string; description: string; seo?: { title?: string; description?: string }; links?: Button[]; [key: string]: any };

export function getYaml<T>(path: string): T {
  return parse(readFileSync(`${contentRoot}${path}`, "utf8")) as T;
}

export function getYamlDirectory<T>(directory: string): T[] {
  return readdirSync(`${contentRoot}${directory}`)
    .filter((file) => /\.ya?ml$/.test(file))
    .sort()
    .map((file) => getYaml<T>(`${directory}/${file}`));
}

export const getHome = () => getYaml<PageData>("index.yml");
export const getAbout = () => getYaml<PageData>("about.yml");
export const getGamesPage = () => getYaml<PageData>("games.yml");
export const getProjectsPage = () => getYaml<PageData>("projects.yml");
export const getBlogPage = () => getYaml<PageData>("blog.yml");
export const getGames = () => getYamlDirectory<PageData>("games");
export const getProjects = () => getYamlDirectory<PageData>("projects");

export function withBase(path: string) {
  const base = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\//, "")}`;
}

export const navLinks = [["Home", "/"], ["Games", "/games"], ["Projects", "/projects"], ["Blog", "/blog"], ["About", "/about"]] as const;
export const footerLinks = [["X", "https://x.com/iyuzzuko", "Twitter"], ["YouTube", "https://www.youtube.com/@%E3%82%91%E3%81%B5%E3%81%BE%E3%81%84%E3%81%8B", "YouTube"], ["GitHub", "https://github.com/wefma", "GitHub"]] as const;
