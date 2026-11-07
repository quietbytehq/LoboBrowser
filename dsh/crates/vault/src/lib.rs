//! API key vault for DSH.
//!
//! Keys live in the OS keychain (libsecret/KWallet on Linux, Credential
//! Manager on Windows) and are only ever released for their provider's domain.
//!
//! TODO (Phase 2): keychain storage through the `keyring` crate, test and
//! revoke, masked display.

/// Returns true if a key registered for `provider_host` may be sent to `target_host`.
///
/// Only the exact host or its subdomains match, so a key for `api.deepseek.com`
/// can never be sent to `api.deepseek.com.evil.example`.
pub fn host_allowed(provider_host: &str, target_host: &str) -> bool {
    let p = provider_host.trim_end_matches('.').to_ascii_lowercase();
    let t = target_host.trim_end_matches('.').to_ascii_lowercase();
    !p.is_empty() && (t == p || t.ends_with(&format!(".{p}")))
}

/// Mask a key for display: `sk-…a9F2`.
pub fn mask(key: &str) -> String {
    let chars: Vec<char> = key.chars().collect();
    if chars.len() <= 8 {
        return "…".to_string();
    }
    let head: String = chars[..3].iter().collect();
    let tail: String = chars[chars.len() - 4..].iter().collect();
    format!("{head}…{tail}")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn domain_lock() {
        assert!(host_allowed("api.deepseek.com", "api.deepseek.com"));
        assert!(host_allowed("openrouter.ai", "api.openrouter.ai"));
        assert!(!host_allowed(
            "api.deepseek.com",
            "api.deepseek.com.evil.example"
        ));
        assert!(!host_allowed(
            "api.deepseek.com",
            "evilapi.deepseek.com.example"
        ));
        assert!(!host_allowed("", "anything.example"));
    }

    #[test]
    fn masking() {
        assert_eq!(mask("sk-1234567890a9F2"), "sk-…a9F2");
        assert_eq!(mask("short"), "…");
    }
}
