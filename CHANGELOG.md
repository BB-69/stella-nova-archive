# CHANGELOGS

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
