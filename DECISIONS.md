# Design decisions

## Answers to the design questions

**1. Upload over HTTP or WebSocket?**
HTTP (`multipart`). Validation and error codes are simple (`413`, `415`, `400`, `403`), a retry is a normal request, and the server answers `202` at once while the worker does the slow part. The WebSocket stays light for events.

**2. A message arrives while I am recording?**
Recording wins. When it starts, `queue.pause()` stops the playing message (otherwise the mic records the speakers). New messages join the list and the queue, ordered by `seq`, and play after recording ends. A message the user paused by hand stays paused.

**3. Autoplay is blocked on first load?**
An "Enable audio" overlay. The click is the user gesture. The queue stays paused until then, so messages wait and play in order. After a refresh the overlay returns, because the browser forgets the gesture.

**4. Same user in two tabs or devices?**
Each connection is independent (token in `sessionStorage`, one WebSocket per tab). Presence is a connection counter in Redis, so the user counts once. The sender's own messages never auto-play in any tab. `played` is recorded once per recipient and broadcast to all connections.

**5. Ordering, including after a reconnect?**
- The database gives every message a per-channel `seq` (`UPDATE ... RETURNING` locks the channel row, plus `UNIQUE (channel_id, seq)`).
- The client orders by `seq`, never by arrival. The message cache merges by `id`, so duplicates disappear.
- On every WebSocket open, the client requests `after_seq=<last seq>` and merges the result. Older history uses `before_seq`.
- Catch-up messages appear but do not auto-play.

## Trade-offs

- **HTTP upload plus WebSocket events:** two channels to keep in sync. The upload response adds the message as `processing`, and `message.new` replaces it.
- **`seq` assigned when processing ends:** order is completion order, not upload order. Every client sees the same order.
- **Catch-up does not auto-play:** the user chooses, instead of hearing many old messages at once.
- **Frontend focus, AI-generated backend:** confirmed by the hiring team's email. Backend tests are not written.
- **`sessionStorage` token and token in the WebSocket URL:** simple, but exposed to XSS and server logs. An httpOnly cookie would be safer.
- **Presence counter in Redis without TTL:** can be stale after an API crash.
- **A message can stay `processing`** if Redis loses the job or the worker dies.
- **`pause()` during audio download** has no effect.
- **Latest Chrome only.**

## With twice the time

1. Backend tests (auth, upload validation, worker success and failure).
2. JSON logging, and a job that fails stale `processing` messages.
3. Presence heartbeat, httpOnly cookie, rate limiting.
4. S3 or MinIO behind `StorageService`.
5. Component and end-to-end tests (Playwright).