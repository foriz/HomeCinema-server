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
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|--(subtitle_file.srt)<br/>

## User Interface

## Trello: 
https://trello.com/b/3qHdTXFV/homecinema