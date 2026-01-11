# CHANGELOGS

## v5.2 - 2026/01/11 [#180](https://github.com/BB-69/stella-nova-archive/pull/180)

- Fixed archive scroll related bug
  - Added custom `no-scroll` css class to remove scrollbar while still making it scrollable
  - [backend] Removed `tailwind-utils` since it's better anyway to cram all tailwind classes inside each component
  - `TranslationBar` content scrolling space are now bounded properly using `overflow-hidden` instead of excessive paddings & margins
- Increase `TranslationBar` unfold width

## v5.1 - 2026/01/09 [#169](https://github.com/BB-69/stella-nova-archive/pull/169)

- Proper overlay cleanup using uid
  - [backend] `overlayMetas` & `overlayTransforms` key uses `uid` instead of `id` to avoid unsync on `id` change

## v5.0 - 2026/01/03 [#160](https://github.com/BB-69/stella-nova-archive/pull/160)

- [backend] Backend cleanup.
  - Split big components into multiple different smaller components and logics (`common`, `context`, `hook`) for easier reuse and expansion.
  - Reduced *some* React rerenders.
  - Added custom css classes.

## v4.6 - 2026/01/03 [#158](https://github.com/BB-69/stella-nova-archive/pull/158)

- [backend] Added custom css classes
  - most reused related: `flex`, `width`, `height`

## v4.5 - 2026/01/03 [#154](https://github.com/BB-69/stella-nova-archive/pull/154)

- [backend] Added middle hook
  - useSearchQuery, useFilterQuery, useSortQuery, useArchive, useOverlay

## v4.4 - 2026/01/02 [#149](https://github.com/BB-69/stella-nova-archive/pull/149)

- [backend] Turn props into context
  - Added ArchiveContext
  - Moved some existing contexts to respective folders

## v4.3 - 2026/01/01 [#146](https://github.com/BB-69/stella-nova-archive/pull/146)

- [backend] Reduce React rerenders
  - memo some static children components
  - useRef + rAF for some occasionally constantly animating component
  - MotionValue applied specially to Overlays related component _(still paired with useState for force update)_

## v4.2 - 2025/12/31 [#138](https://github.com/BB-69/stella-nova-archive/pull/138)

- [backend] Collapse big component into multiple small components
- [backend] Added reusable component `ButtonInput`

## v4.1 - 2025/12/29 [#124](https://github.com/BB-69/stella-nova-archive/pull/124)

- Added version changelog & workflow

## v4.0 - 2025/12/28 [#114](https://github.com/BB-69/stella-nova-archive/pull/114)

- Built-in editor for archive page.

## v3.0 - 2025/12/19 [#80](https://github.com/BB-69/stella-nova-archive/pull/80)

- UI & UX cleanup.

## v2.0 - 2025/12/18 [#75](https://github.com/BB-69/stella-nova-archive/pull/75)

- Basic translation archive viewing tab.

## v1.0 - 2025/12/07 [#55](https://github.com/BB-69/stella-nova-archive/pull/55)

- Basic functional browsing page.
