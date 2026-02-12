<script setup lang="ts">
const { data: page } = await useAsyncData("games-page", () => {
  return queryCollection("pages").path("/games").first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

const { data: games } = await useAsyncData("games", () => {
  return queryCollection("games").all();
});

const { global } = useAppConfig();

useSeoMeta({
  title: page.value?.seo?.title || page.value?.title,
  ogTitle: page.value?.seo?.title || page.value?.title,
  description: page.value?.seo?.description || page.value?.description,
  ogDescription: page.value?.seo?.description || page.value?.description,
});
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start',
      }"
    >
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0',
      }"
    >
      <UHeader class="mb-6" title="代表的なやつ" />
      <Motion
        v-for="(game, index) in games"
        :key="game.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="game.title"
          :description="game.description"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last',
          }"
        >
          <img
            :src="game.image"
            :alt="game.title"
            class="object-cover w-full h-48 rounded-lg"
          />
        </UPageCard>
      </Motion>

      <UHeader class="mb-6" title="その他雑多" />
      <Motion
        v-for="(cat, cIndex) in (page as any)?.meta?.table?.categories ?? []"
        :key="cat.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * (cIndex as number) }"
        :in-view-options="{ once: true, margin: '-10% 0px -10% 0px' }"
        class="mt-10"
      >
        <h2 class="text-xl font-semibold mb-3">{{ cat.title }}</h2>

        <div class="overflow-x-auto">
          <table class="min-w-full border border-(--ui-border) rounded-lg">
            <thead class="bg-(--ui-bg-elevated)">
              <tr>
                <th
                  class="text-left text-sm font-semibold px-3 py-2 border-b border-(--ui-border)"
                >
                  Game
                </th>
                <th
                  class="text-left text-sm font-semibold px-3 py-2 border-b border-(--ui-border)"
                >
                  Achievement
                </th>
                <th
                  class="text-left text-sm font-semibold px-3 py-2 border-b border-(--ui-border) w-14"
                >
                  Movie
                </th>
              </tr>
            </thead>

            <tbody>
              <template v-for="g in cat.games" :key="g.game">
                <template
                  v-for="(a, i) in g.achievesments ?? []"
                  :key="`${g.game}-${i}-${a.title}`"
                >
                  <tr class="hover:bg-(--ui-bg-elevated)/40">
                    <!-- game セルは最初の achievement 行だけ出す（rowspanで縦結合） -->
                    <td
                      v-if="i === 0"
                      :rowspan="Math.max(1, g.achievesments?.length ?? 0)"
                      class="align-top px-3 py-2 border-b border-(--ui-border) font-medium whitespace-nowrap"
                    >
                      {{ g.game }}
                    </td>

                    <td class="px-3 py-2 border-b border-(--ui-border)">
                      {{ a.title }}
                    </td>

                    <td
                      class="px-3 py-2 border-b border-(--ui-border) text-center"
                    >
                      <ULink
                        v-if="a.movie"
                        :to="a.movie"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center justify-center"
                        aria-label="Watch movie"
                      >
                        <!-- simple-icons: youtube -->
                        <UIcon name="i-simple-icons-youtube" class="size-5" />
                      </ULink>
                    </td>
                  </tr>
                </template>

                <!-- achievesments が空のゲームも一応表示したい場合 -->
                <tr
                  v-if="!g.achievesments?.length"
                  class="hover:bg-(--ui-bg-elevated)/40"
                >
                  <td
                    class="align-top px-3 py-2 border-b border-(--ui-border) font-medium whitespace-nowrap"
                  >
                    {{ g.game }}
                  </td>
                  <td
                    class="px-3 py-2 border-b border-(--ui-border) text-muted"
                  >
                    -
                  </td>
                  <td class="px-3 py-2 border-b border-(--ui-border)" />
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </Motion>
    </UPageSection>
  </UPage>
</template>
