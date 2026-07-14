export * from "./i18n/config";

import tr from "./i18n/dictionaries/tr";
import en from "./i18n/dictionaries/en";
import ar from "./i18n/dictionaries/ar";

export const translations = { tr, en, ar } as const;
