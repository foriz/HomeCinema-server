# HomeCinema-server

A Node.js server for streaming videos in LAN across devices.

HomeCinema-server is part of HomeCinema project, which will also have some clients.
The main idea is streaming movies & series across different devices in LAN, using
different protocols. Server will recognize subfolders containing movies from a list
of folders.

For now, structure for movies will be implemented. The server will search in depth=1 for
all subfolders in given directories.

## User Interface

## TODO
- [ ] Implementation of simple UI for adding/deleting/selecting folders, where server will search for movies.
- [ ] File reader module.
- [ ] Integrate of RTP protocol for streaming video.
- [ ] API for communication with clients.

## Future Ideas:
- [ ] Linux development & testing.
- [ ] Protocol support for Windows, Linux & Raspberry (RTP ?)
- [ ] Protocol support for browsers (WebRTC ?)
- [ ] Protocol support for Android applications & Smart TVs (?)
- [ ] Protocol support for iOS application (Apple HLS? )