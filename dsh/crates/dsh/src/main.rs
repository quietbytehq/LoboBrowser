//! DSH: the local agent service for Lobster Browser.
//!
//! Started by the browser through native messaging. Reads requests on stdin,
//! writes responses on stdout. Logs go to stderr and must never contain keys.

use dsh_protocol::{read_message, write_message, Request, Response};
use std::io;

fn main() -> io::Result<()> {
    let stdin = io::stdin();
    let stdout = io::stdout();
    let mut input = stdin.lock();
    let mut output = stdout.lock();

    while let Some(request) = read_message::<_, Request>(&mut input)? {
        let response = match request {
            Request::Ping => Response::Pong {
                version: env!("CARGO_PKG_VERSION").to_string(),
            },
            Request::Ask { .. } => Response::Error {
                message: "model routing arrives in Phase 2".to_string(),
            },
        };
        write_message(&mut output, &response)?;
    }
    Ok(())
}
