# HomeCinema-server

A Node.js server for streaming videos in LAN across devices.

HomeCinema-server is part of HomeCinema project, which will also have some clients.
The main idea is streaming movies & series across different devices in LAN, using
different protocols. Server will recognize subfolders containing movies from a list
of folders.

For now, structure for movies will be implemented. As movie will be considered a video file
inside a folder. The server will search in depth=1 for all subfolders in given directories.

File System Schema for Movies Support:

(root_movies_folder)<br/>
|<br/>
|--(Movie #1)<br/>
|&nbsp;&nbsp;|--movie_file.mp4<br/>
|&nbsp;&nbsp;|--subtitle_file.srt<br/>
|<br/>
|--(Movie #2)<br/>
|&nbsp;&nbsp;|--movie_file.mp4<br/>
|&nbsp;&nbsp;|--(Subs)<br/>
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|--subtitle_file.srt<br/>

## User Interface
![alt text](https://github.com/foriz/HomeCinema-server/blob/main/screenshots/server-ui.png?raw=true)

## Movie Streaming
For now, movies can be streamed using VLC player, or any other player that can play a stream of binary data,
using links in the following format as source:

```http://<HOME_CINAME_SERVER_IP>:<HOME_CINAME_SERVER_PORT>/movies/stream?mov_id=<MONGO_DB_MOVIE_ID>```

Also, the same link can be opened through browser if HTML 5 is supported in your browser.

For now, forward, backwards and time indexing operations are not supported, unless you stream through VLC player in localhost.

## Trello: 
https://trello.com/b/3qHdTXFV/homecinema