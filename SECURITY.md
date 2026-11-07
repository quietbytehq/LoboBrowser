# Security policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems.
Use GitHub's private vulnerability reporting on this repository (Security tab → "Report a vulnerability").
You should get a reply within 7 days.

## Design rules we hold ourselves to

These are the promises the code must keep. A change that breaks one is a security bug.

1. **The browser never holds an API key.** Only the DSH service reads keys, from the OS keychain.
2. **Keys are never written to disk in plain text** and never appear in logs, crash reports or the UI (masked as `sk-…a9F2`).
3. **Each key is locked to its provider's domain.** DSH refuses to send a key to any other host.
4. **Every key can have a spending cap**, enforced by DSH with a hard stop.
5. **Page content is data, never instructions.** The agent never acts on text found in a web page without the user's approval.
6. **Machine access is off by default.** When enabled, commands run in a sandbox and every action is logged.
7. **Personal data is scrubbed before prompts leave the machine** when the privacy gateway is on.

## Supported versions

Only the latest release receives security fixes until v1.0.
