# isee-website monorepo

Glossary for the workspace that will hold independent static-site Apps under one pnpm workspace.

## Language

**Workspace root**:
The monorepo shell package named `isee-website`. It owns the single lockfile and workspace config; it is not itself a site.
_Avoid_: monorepo app, root app, isee-china (when referring to the shell)

**App**:
An independently buildable site package under `apps/`, with its own `package.json`, source, assets, and deploy files. The Apps are `isee-china` and `isee-international`.
_Avoid_: package (alone), project, site (as the unit name)

**Independence**:
Apps do not share libraries or config packages; the root only provides workspace membership and explicitly named filter scripts.
_Avoid_: shared UI, packages/, tooling package
