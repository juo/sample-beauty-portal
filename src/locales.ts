import type { BlockLocaleFile } from "@juo/blocks";

const SUPPORTED_LOCALES = ["en"] as const;

function normalizeLocale(locale: string): string {
  return locale.trim().toLowerCase().split("-")[0] || "en";
}

export function blockLocales(blockType: string) {
  return {
    supported: [...SUPPORTED_LOCALES],
    load: async (locale: string): Promise<BlockLocaleFile> => {
      const normalized = normalizeLocale(locale);
      const loadFile = async (code: string) =>
        import(`../locales/${code}.json`)
          .then((module) => module.default ?? module)
          .catch(() => ({}));

      const selected = (await loadFile(normalized)) as Record<string, BlockLocaleFile | undefined>;
      if (selected[blockType] != null) {
        return selected[blockType]!;
      }

      const fallback = (await loadFile("en")) as Record<string, BlockLocaleFile | undefined>;
      return fallback[blockType] ?? {};
    },
  };
}
