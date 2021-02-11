# HomeCinema-server

A Node.js server for streaming videos in LAN across devices.

HomeCinema-server is part of HomeCinema project, which will also have some clients.
The main idea is streaming movies & series across different devices in LAN, using
different protocols. Server will recognize subfolders containing movies from a list
of folders.

For now, structure for movies will be implemented. As movie will be considered a video file
inside a folder. The server will search in depth=1 for all subfolders in given directories.

File System Schema for Movies Support:

(root_movies_folder)
|
|--(Movie #1)
|  |--movie_file.mp4
|  |--subtitle_file.srt
|
|--(Movie #2)
|  |--movie_file.mp4
|  |--(Subs)
|     |--(subtitle_file.srt)

## User Interface

## TODO:
### Server UI
- [ ] HomeCinema logo.
- [ ] Modal Windows for Tools in Header.
- [ ] Disable click outside modal window, when it is shown.
- [ ] Enable Series button in Header.
- [ ] Add References for icons.

## To Be Implemented
- [ ] Implementation of simple UI for adding/deleting/selecting folders, where server will search for movies.
- [ ] File reader module (Movies).
- [ ] File reader module (Series).
- [ ] Integrate of RTP protocol for streaming video.
- [ ] API for communication with clients (discovery, info & sub sharing).
- [ ] Support for .mp4 and .mkv video files.

## Future Ideas:
- [ ] Linux development & testing.
- [ ] Protocol support for Windows, Linux & Raspberry (RTP ?)
- [ ] Protocol support for browsers (WebRTC ?)
- [ ] Protocol support for Android applications & Smart TVs (?)
- [ ] Protocol support for iOS application (Apple HLS? )
- [ ] Mark as watched
- [ ] Rating
- [ ] Recommendation system