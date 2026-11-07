//! Messages between Lobster Browser and DSH.
//!
//! The browser talks to DSH through Firefox native messaging: each message is
//! UTF-8 JSON preceded by its length as a 32-bit unsigned integer in native
//! byte order.

use serde::{Deserialize, Serialize};
use std::io::{self, Read, Write};

/// Largest message DSH accepts from the browser (1 MiB).
pub const MAX_MESSAGE_BYTES: u32 = 1024 * 1024;

/// A request from the browser to DSH.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Request {
    /// Health check.
    Ping,
    /// Ask a model a question, optionally about the current page.
    Ask {
        provider: String,
        model: String,
        prompt: String,
        page_text: Option<String>,
    },
}

/// A reply from DSH to the browser. Never contains an API key.
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum Response {
    Pong { version: String },
    Answer { text: String },
    Error { message: String },
}

/// Read one native-messaging message. Returns `Ok(None)` at end of input.
pub fn read_message<R: Read, T: for<'de> Deserialize<'de>>(input: &mut R) -> io::Result<Option<T>> {
    let mut len = [0u8; 4];
    match input.read_exact(&mut len) {
        Ok(()) => {}
        Err(e) if e.kind() == io::ErrorKind::UnexpectedEof => return Ok(None),
        Err(e) => return Err(e),
    }
    let len = u32::from_ne_bytes(len);
    if len > MAX_MESSAGE_BYTES {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "message too large",
        ));
    }
    let mut body = vec![0u8; len as usize];
    input.read_exact(&mut body)?;
    serde_json::from_slice(&body)
        .map(Some)
        .map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))
}

/// Write one native-messaging message.
pub fn write_message<W: Write, T: Serialize>(output: &mut W, message: &T) -> io::Result<()> {
    let body =
        serde_json::to_vec(message).map_err(|e| io::Error::new(io::ErrorKind::InvalidData, e))?;
    let len = u32::try_from(body.len())
        .map_err(|_| io::Error::new(io::ErrorKind::InvalidData, "message too large"))?;
    output.write_all(&len.to_ne_bytes())?;
    output.write_all(&body)?;
    output.flush()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trip() {
        let mut buf = Vec::new();
        write_message(&mut buf, &Request::Ping).unwrap();
        let got: Option<Request> = read_message(&mut buf.as_slice()).unwrap();
        assert_eq!(got, Some(Request::Ping));
    }

    #[test]
    fn end_of_input_is_none() {
        let got: Option<Request> = read_message(&mut [].as_slice()).unwrap();
        assert_eq!(got, None);
    }

    #[test]
    fn rejects_oversized_message() {
        let mut buf = (MAX_MESSAGE_BYTES + 1).to_ne_bytes().to_vec();
        buf.extend_from_slice(b"{}");
        assert!(read_message::<_, Request>(&mut buf.as_slice()).is_err());
    }
}
