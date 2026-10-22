# Dani Moscatelli Design System: working rules

* The site is bilingual (English default, Português BR). Every user-visible string must exist in both languages: use `const { t, bi } = useI18n()` from `src/app/i18n.tsx` (`t("English", "Português")`). Sidebar labels live in the `ptLabels` map in `src/app/App.tsx`.
* Every addition, change or removal in the design system (new page, component, token, menu change) must be logged as a new entry at the TOP of `src/app/components/showcase/shared/changelog.ts` with both `en` and `pt` text. It renders in the "What's New" section on Home.
* Keep the Home "Explore" grid and the sidebar groups in `src/app/App.tsx` in sync when pages are added or removed.
