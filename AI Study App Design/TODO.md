# Frontend Fix/Improvement Plan - AI Study App
Current Working Dir: c:/Users/Raymark/AI-Study-App-Design/AI Study App Design

## Steps (Mark [x] when done)

- [ ] 1. Update package.json: Pin react-router to stable v6.26.2, remove unused deps (e.g. @mui/material, @mui/icons-material, react-dnd*, recharts if unused). Run `pnpm install`.
- [ ] 2. Update routes.tsx: Add auth loader/guard for protected routes (/dashboard → / if no user).
- [ ] 3. Run type check: `npx tsc --noEmit` and fix errors.
- [ ] 4. Add ESLint config if missing, run `npx eslint . --fix`, resolve warnings.
- [ ] 5. Test dev server: `pnpm dev`, check console/browser for errors, test full flow (login→dashboard→quiz setup→play→results).
- [ ] 6. Minor polish: Error boundaries, optimize imports (e.g. dynamic if needed).
- [ ] 7. Complete: Run `pnpm build`, verify.

**Next Step: #1 package.json**

