What I Did
Non-destructive system diagnosis: Ran full environment checks before modifying any configuration—verified the Linux distribution, systemd status, installed CLI tooling, and current git config state.

Email privacy in version control: Looked into GitHub's noreply address mechanism and understood how commit metadata permanently bakes the author's email into Git history.

Base Git configuration: Set up global identity (user.name, user.email) and ensured init.defaultBranch points to main.

External repository package management: Installed software using modern APT standards—retrieved and verified GPG key fingerprints, used [signed-by=...] sources, piped definitions cleanly via sudo tee, and audited candidates with apt-cache policy.

Authentication workflows: Analyzed Personal Access Tokens (PATs) versus OAuth flows for repository operations.

Core Git lifecycle: Practiced the standard workflow (init, add, commit, push, status, log) while applying Conventional Commits formatting.

End-of-day wrap-up: Maintained the engineering log, committed all final changes, pushed to remote, and verified the remote state.

Key Takeaways
Remote access setup: Successfully established an SSH session into the Windows host and launched WSL to bootstrap this workspace.

Attention to detail: Always read and parse command output or documentation carefully before executing—never blindly copy-paste commands without knowing what they touch.

Action Items & Next Steps
[ ] Review token security models: clarify prefix conventions (ghp_ vs gho_), minimal privilege scopes, and strict filesystem permissions (chmod 600).

[ ] Practice publishing local repositories directly from the command line using gh repo create.

[ ] Dig into pager flags: break down how less -FRX behaves and why it’s useful for terminal output.
