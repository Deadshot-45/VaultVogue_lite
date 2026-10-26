# Repository Agent Rules

1. Use the Ponytail planning skills listed in `.agents/skills/ponytail.json` and its subdirectories.
2. Always inspect `git diff` before summarizing changes.
3. Preserve existing logic and behavior; optimize performance only when doing so does not change them.
4. At the end of every task, run lint and build. If either command fails, fix errors caused by the task, rerun the failed check, and then suggest the next step.
5. Do not add or remove code unless it is required by the task.
6. Do not modify or delete the .gitignore file. Do not add or remove code unless it is required by the task.
7. Remember the project theme with green ('#0891b2') for dark and rose gold('#B76E79') for light. This website is a one-page design that will provide an immersive and immersive customer experience.
8. Use GSAP and motion for animations. Prefer GSAP for timeline-based, complex animations and micro-interactions. Ensure all animations respect the prefers-reduced-motion media query by using GSAP's isReducedMotion() utility function or equivalent. Use the design tokens listed in DESIGN_TOKENS.md.