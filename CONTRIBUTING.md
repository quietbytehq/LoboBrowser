# Contributing

Thanks for your interest in Lobster Browser.

- **Issues:** bug reports and ideas are welcome. Search existing issues first.
- **Pull requests:** keep them small and focused, one change per PR. Describe what changed and how you tested it.
- **Browser changes** go in `browser/patches/` as plain patch files, one topic per patch.
- **DSH changes** must pass `cargo fmt --check`, `cargo clippy -- -D warnings` and `cargo test` in `dsh/`.
- **Security-sensitive code** (vault, gateway, agent actions) needs a clear explanation in the PR and will be reviewed carefully. Read [SECURITY.md](SECURITY.md) first.
- **Licence:** contributions are accepted under the [MPL 2.0](LICENSE).
