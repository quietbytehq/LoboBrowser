//! Privacy gateway and spending limits for DSH.
//!
//! TODO (Phase 3): Lite mode (patterns), Standard mode (small detection model
//! via ONNX Runtime), optional Full mode (Presidio add-on).

/// How much personal-data scrubbing to do before a prompt leaves the machine.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum PrivacyLevel {
    Off,
    Lite,
    #[default]
    Standard,
    Full,
}

/// A daily token cap for one key.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct DailyCap {
    pub limit_tokens: u64,
    pub used_tokens: u64,
}

impl DailyCap {
    /// Whether a request of `tokens` fits under the cap. A hard stop: no overdraft.
    pub fn allows(&self, tokens: u64) -> bool {
        self.used_tokens.saturating_add(tokens) <= self.limit_tokens
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cap_is_a_hard_stop() {
        let cap = DailyCap {
            limit_tokens: 1000,
            used_tokens: 900,
        };
        assert!(cap.allows(100));
        assert!(!cap.allows(101));
    }
}
