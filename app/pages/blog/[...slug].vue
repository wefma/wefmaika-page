<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";
import { mapContentNavigation } from "@nuxt/ui/utils/content";
import { findPageBreadcrumb } from "@nuxt/content/utils";

const route = useRoute();

const normalizedPath = computed(() => {
  // 末尾スラッシュを除去（"/" だけは残す）
  const p = route.path.replace(/\/+$/, "");
  return p === "" ? "/" : p;
});

const { data: page } = await useAsyncData(
  () => `blog:${normalizedPath.value}`,
  () => queryCollection("blog").path(normalizedPath.value).first(),
);
if (!page.value)
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
const { data: surround } = await useAsyncData(
  () => `blog:${normalizedPath.value}:surround`,
  () =>
    queryCollectionItemSurroundings("blog", normalizedPath.value, {
      fields: ["description"],
    }),
);

const navigation = inject<Ref<ContentNavigationItem[]>>("navigation", ref([]));
const blogNavigation = computed(
  () => navigation.value.find((item) => item.path === "/blog")?.children || [],
);

const breadcrumb = computed(() =>
  mapContentNavigation(
    findPageBreadcrumb(blogNavigation?.value, page.value?.path),
  ).map(({ icon, ...link }) => link),
);

if (import.meta.server) {
  if (page.value.image) {
    defineOgImage({ url: page.value.image });
  } else {
    defineOgImageComponent(
      "Blog",
      { headline: breadcrumb.value.map((i) => i.label).join(" > ") },
      { fonts: ["Geist:400", "Geist:600"] },
    );
  }
}

const title = page.value?.seo?.title || page.value?.title;
const description = page.value?.seo?.description || page.value?.description;

useSeoMeta({
  title,
  description,
  ogDescription: description,
  ogTitle: title,
});

const articleLink = computed(() => `${window?.location}`);

const formatDate = (dateString: string) => {
  const s = dateString.slice(0, 10);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return dateString;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return `${y}年${mo}月${d}日`;
};
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="page">
        <ULink to="/blog" class="text-sm flex items-center gap-1">
          <UIcon name="lucide:chevron-left" />
          Blog
        </ULink>
        <div class="flex flex-col gap-3 mt-8">
          <div
            class="flex text-xs text-muted items-center justify-center gap-2"
          >
            <span v-if="page.date">
              {{ formatDate(page.date) }}
            </span>
            <span v-if="page.date && page.minRead"> - </span>
            <span v-if="page.minRead"> {{ page.minRead }} MIN READ </span>
          </div>
          <NuxtImg
            :src="page.image"
            :alt="page.title"
            class="rounded-lg w-full h-[300px] object-cover object-center"
          />
          <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
            {{ page.title }}
          </h1>
          <p class="text-muted text-center max-w-2xl mx-auto">
            {{ page.description }}
          </p>
        </div>
        <UPageBody class="max-w-3xl mx-auto">
          <ContentRenderer v-if="page.body" :value="page" />

          <div class="flex items-center justify-end gap-2 text-sm text-muted">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              label="Copy link"
              @click="
                copyToClipboard(articleLink, '記事のリンクをコピーしました！')
              "
            />
          </div>
          <UContentSurround :surround />
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
