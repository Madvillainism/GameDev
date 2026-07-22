# Asset Governance

## Immutable Assets
All files listed in `spec/CONTEXT.md` under "Asset Immutability" are locked. No developer shall:
- Rename or relocate any asset file.
- Modify, re-encode, or replace any asset file.
- Reference an asset by a different path or filename.

## Enforcement
Code review MUST reject any PR that violates asset immutability. Automated checks should verify that the listed filenames remain unchanged across commits.
