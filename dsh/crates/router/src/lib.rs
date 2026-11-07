//! Model provider routing for DSH.
//!
//! TODO (Phase 2): DeepSeek and OpenRouter clients, Ollama for local models.
//! TODO (Phase 3): Qwen, OpenAI, Claude, Grok.

/// Where a provider runs.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Location {
    Cloud,
    Local,
}

/// A model provider DSH can route to.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Provider {
    pub id: &'static str,
    pub host: &'static str,
    pub location: Location,
}

/// Providers planned for Phase 2.
pub const PHASE_2_PROVIDERS: &[Provider] = &[
    Provider {
        id: "deepseek",
        host: "api.deepseek.com",
        location: Location::Cloud,
    },
    Provider {
        id: "openrouter",
        host: "openrouter.ai",
        location: Location::Cloud,
    },
    Provider {
        id: "ollama",
        host: "localhost",
        location: Location::Local,
    },
];
