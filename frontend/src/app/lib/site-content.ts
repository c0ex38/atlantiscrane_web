export * from "./i18n/config";

import emptyDictionary from "./i18n/empty-dictionary";

export const translations = { tr: emptyDictionary, en: emptyDictionary, ar: emptyDictionary } as const;
