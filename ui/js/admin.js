const { ipcRenderer, protocol } = require("electron");
const { model } = require("mongoose");

var movies_btn = null;
var series_btn = null;

var dir_selector = null;

var tools_buttons = ["settings_btn", "connections_btn", "monitor_btn", "notifications_btn"];

var isModalShown = false;

var locations_table = null;
var dirs = null;

var SERVER_URL = "";

var modalTemplate

window.onload = function() {
    if (document.readyState === 'complete') {
        config = ipcRenderer.sendSync("synchronous-message", "config");
        SERVER_URL = "http://" + config["server"]["host"] + ":" + config["server"]["port"]; 
    }

    if(SERVER_URL == "") {
        SERVER_URL = "http://localhost:3000"; 
    }

    movies_btn = document.getElementById("movies_btn");
    series_btn = document.getElementById("series_btn");

    // Initialize main table, where locations are shown
    locations_table = document.getElementById("locations_table");
    locations_table.setAttribute("style","height:"+(window.innerHeight * 0.75)+"px");
    locations_table.style.visibility = "visible";

    moviesBtnClick();
}

function cleanTable() {
    locations_table.innerHTML = "";
}

function initializeTable(type) {
    var header_th = document.createElement("th");
    header_th.innerHTML = "Locations - " + type;
    
    var header_tr = document.createElement("tr");
    header_tr.appendChild(header_th);
    
    var table_body = document.createElement('tbody');
    table_body.id = "locations_table_body";
    table_body.appendChild(header_tr);

    locations_table.appendChild(table_body);
}

function fillTable(dirs) {
    body = document.getElementById("locations_table_body");

    for(var i=0;i<dirs.length;i++) {
        var div = document.createElement("div");
        div.innerHTML = dirs[i];

        var td = document.createElement("td");
        td.appendChild(div);
        
        var tr = document.createElement("tr");
        tr.addEventListener("click", changeActiveRow);
        tr.appendChild(td);

        body.appendChild(tr);
    }
}

function hasClass(elem, class_name) {
    if(elem.classList.contains(class_name)) {
        return true;
    }
    else {
        return false;
    }
}

function setToolActive(elem, op) {
    // Check if it is already selected
    if(!hasClass(elem, "active_tool")) {
        // Set to active class
        elem.classList.add("active_tool");

        // Make all other icons un-active
        for(var i=0;i<tools_buttons.length;i++) {
            if(elem.id != tools_buttons[i]) {
                setToolInactive(document.getElementById(tools_buttons[i]));
            }
        }

        openModal(elem, op);
    }
}

function setToolInactive(elem) {
    if(hasClass(elem, "active_tool")) {
        elem.classList.remove("active_tool");
        elem.src = elem.src.replace("_selected.svg", ".svg");
    }
}

function openModal(elem, op) {
    var modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        onClose: function() {
            // Close modal without saving
            setToolInactive(elem);
        },
        beforeClose: function() {
            return true;
        }
    });
    
    // Footer Buttons
    modal.addFooterBtn('Save', 'tingle-btn tingle-btn--primary', function() {
        // Save content and close modal
        if(op == "settings") {
            var serverPort = document.getElementById("server_port").value;
            var serverProtocol = "HTTP";

            var protocols = document.getElementsByName("streaming_protocol");
            for (var i = 0; i < protocols.length; i++) {
                if (protocols[i].checked) {
                    serverProtocol = protocols[i].value;
                    break;
                }
            }

            var serverResponse = requestApi("PATCH", "/settings/update?port="+serverPort+"&protocol="+serverProtocol, "Cannot fetch saved settings.", false);    
            if("success" in serverResponse["result"]) {
                alert('Settings updated!');
            }
            else {
                alert('An error occured. Cannot update settings.');
            }
        }
        setToolInactive(elem);
        modal.close();
    });
    modal.addFooterBtn('Close', 'tingle-btn tingle-btn--danger', function() {
        modal.close();
    });

    // Main Content
    if(op == "settings") {
        var curSettings = requestApi("GET", "/settings/get", "Cannot fetch saved settings.", false);

        var protocolSwitchStr = ''
            + '<label class="checkbox-inline">'
            + '<input type="radio" value="HTTP" name="streaming_protocol">HTTP'
            + '</label>'
            + '<label class="checkbox-inline">'
            + '<input type="radio" value="RTP" name="streaming_protocol">RTP/RTSP'
            + '</label>'
            + '<label class="checkbox-inline">'
            + '<input type="radio" value="DASH" name="streaming_protocol">DASH'
            + '</label>'
            + '<label class="checkbox-inline">'
            + '<input type="radio" value="HLS" name="streaming_protocol">HLS'
            + '</label>'
            + '<label class="checkbox-inline">'
            + '<input type="radio" value="WRTC" name="streaming_protocol">WebRTC'
            + '</label>'
        switch(curSettings.protocol) {
            case 'HTTP':
                protocolSwitchStr = protocolSwitchStr.replace(
                    '<input type="radio" value="HTTP" name="streaming_protocol">HTTP', 
                    '<input type="radio" value="HTTP" name="streaming_protocol" checked>HTTP'
                )
                break;
            case 'RTP':
                protocolSwitchStr = protocolSwitchStr.replace(
                    '<input type="radio" value="RTP" name="streaming_protocol">RTP/RTSP', 
                    '<input type="radio" value="RTP" name="streaming_protocol" checked>RTP/RTSP'
                )
                break;
            case 'DASH':
                protocolSwitchStr = protocolSwitchStr.replace(
                    '<input type="radio" value="DASH" name="streaming_protocol">DASH', 
                    '<input type="radio" value="DASH" name="streaming_protocol" checked>DASH'
                )
                break;
            case 'HLS':
                protocolSwitchStr = protocolSwitchStr.replace(
                    '<input type="radio" value="HLS" name="streaming_protocol">HLS', 
                    '<input type="radio" value="HLS" name="streaming_protocol" checked>HLS'
                )
                break;
            case 'WRTC':
                protocolSwitchStr = protocolSwitchStr.replace(
                    '<input type="radio" value="WRTC" name="streaming_protocol">WebRTC', 
                    '<input type="radio" value="WRTC" name="streaming_protocol" checked>WebRTC'
                )
                break;
        }

        modal.setContent(''
            + '<form id="test">'
            + '<label for="server_port">Server Port:</label>'
            + '<input type="number" id="server_port" name="server_port" value=' + curSettings.port + '>'
            + '<br>'
            + '<br>'
            + protocolSwitchStr
            + '<br>'
            + '<h5 style="color: red;">WARNING: For now, only HTTP protocol is supported.</h5>'
            + '</form>'
        +'');
    }
    else if(op == "connections") {
        var connections = requestApi("GET", "/monitor/connections", "Cannot fetch saved connections.", false);
        
        var sessionsStr = '';
        for(var i=0;i<connections["sessions"].length;i++) {
            sessionsStr = sessionsStr + '<tr><td>'+connections["sessions"][i].session_id+'</td></tr>';
        }

        modal.setContent(''
            + '<table style="width:75%"'
            + '<tr>'
            + '<th>Session Id</th>'
            + '</tr>'
            + '<tr>'
            + sessionsStr
            + '</tr>'
            + '</table>'
        +'');
    }
    else if(op == "monitor") {
        var resources = requestApi("GET", "/monitor/resources?n_logs=1", "Cannot fetch saved monitor logs.", false);
        console.log(resources);

        var statsStr = ''
            + '<div id="banner-1" style="width:100%; height:50px; margin:auto;">'
            + '     <div id="banner-11" style="width:48%; height:inherit; float:left; margin:auto;">'
            + '             <div class=".inner" style="width:100%; height:50%; margin:auto;">'
            + '                     OS: '+resources[0]["os"]
            + '             </div>'
            + '     </div>'
            + '     <div id="banner-12" style="width:48%; height:inherit; float:right; margin:auto;">'
            + '             <div class=".inner" style="width:100%; height:50%; margin:auto;">'
            + '                     Up(h): '+parseFloat(parseInt(resources[0]["sys_uptime"])/3600).toFixed(2)
            + '             </div>'
            + '     </div>'
            + '</div>'
            + '<div id="banner-2" style="width:100%; height:50px; margin:auto;">'
            + '     <div id="banner-21" style="width:48%; height:inherit; float:left; margin:auto;">'
            + '             <div class=".inner" style="width:100%; height:50%; margin:auto;">'
            + '                     CPU: '+parseFloat(resources[0]["cpu_usage"]).toFixed(2)+'%'
            + '             </div>'
            + '     </div>'
            + '     <div id="banner-22" style="width:48%; height:inherit; float:right; margin:auto;">'
            + '             <div class=".inner" style="width:100%; height:50%; margin:auto;">'
            + '                     RAM: '+parseFloat(resources[0]["mem_usage"]).toFixed(2)+'%'
            + '             </div>'
            + '     </div>'
            + '</div>'
            + '<div id="banner-3" style="width:100%; height:50px; margin:auto;">'
            + '     <div id="banner-31" style="width:30%; height:inherit; float:left; margin:auto; margin-right:5%;">'
            + '             <div class=".inner" style="width:100%; height:50%; margin:auto;">'
            + '                     Avg Load(1m): '+parseFloat(resources[0]["avg_load_1_min"]).toFixed(2)
            + '             </div>'
            + '     </div>'
            + '     <div id="banner-32" style="width:30%; height:inherit; float:left; margin:auto;">'
            + '             <div class=".inner" style="width:100%; height:50%; margin:auto;">'
            + '                     Avg Load(5m): '+parseFloat(resources[0]["avg_load_5_min"]).toFixed(2)
            + '             </div>'
            + '     </div>'
            + '     <div id="banner-33" style="width:30%; height:inherit; float:right; margin:auto;">'
            + '             <div class=".inner" style="width:100%; height:50%; margin:auto;">'
            + '                     Avg Load(15m): '+parseFloat(resources[0]["avg_load_15_min"]).toFixed(2)
            + '             </div>'
            + '     </div>'
            + '</div>';
            
        modal.setContent( ''
        + statsStr
        +'');
    }
    else if(op == "notifications") {
        var logs = requestApi("GET", "/monitor/logs?n_logs=10", "Cannot fetch saved logs.", false);

        var logsStr = ''
        for(var i=0;i<logs.length;i++) {
            var logId = "log-" + i
            logsStr = logsStr
                + '<label for="'+logId+'">['+convertTimestampToDatetime(logs[0].timestamp)+']['+logs[0].prefix+'/'+logs[0].route+']</label><br>'
                + '<textarea id="'+logId+'" readonly style="width:100%; height:150px">'+logs[0].msg+'</textarea><br>'
        }
        
        modal.setContent( ''
            + logsStr
            +'');
    }

    modal.open();
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";

    setToolInactive(document.getElementsByClassName("active_tool")[0]);

    isModalShown = false;
}

function showLoader() {
    var loader = document.getElementById("loader_wrapper");
    loader.style.display = "block";
}

function hideLoader() {
    var loader = document.getElementById("loader_wrapper");
    loader.style.display = "none";
}

function changeModalContent() {
    // TODO: change modal content based on tool clicked
}

function moviesBtnClick() {
    movies_btn.classList.add("active");
    series_btn.classList.remove("active");

    dirs = requestApi("GET", "/dirs/movies", "Cannot fetch saved locations for movies & series.", false);
    
    cleanTable();
    initializeTable("Movies");
    if(dirs != null) {
        fillTable(dirs);
    }
}

function seriesBtnClick() {
    series_btn.classList.add("active");
    movies_btn.classList.remove("active");

    dirs = requestApi("GET", "/dirs/series", "Cannot fetch saved locations for movies & series.", false);
    
    cleanTable();
    initializeTable("Series");
    if(dirs != null) {
        fillTable(dirs);
    }
}

function changeActiveRow(evt) {
    // Un-select already selected element
    if(document.getElementsByClassName("active_row").length > 0) {
        var active_elem = document.getElementsByClassName("active_row")[0];
        if(hasClass(active_elem, "active_row")) {
            active_elem.classList.remove("active_row");
        }
    }
    
    // Mark clicked row as selected
    evt.srcElement.classList.add("active_row");
}

function updatePaths(operation) {
    // Check if movies or series are shown
    var update_route_dst = null;
    var update_route_op = null;    

    if(hasClass(movies_btn, "active")) {
        update_route_dst = "/movies";
    }
    else if(hasClass(series_btn, "active")) {
        update_route_dst = "/series"
    }

    if(operation == "add") {
        update_route_op = "/add"

        const {dialog} = require('electron').remote;
        var selected_path = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        });
    }
    else if(operation == "delete") {
        if(document.getElementsByClassName("active_row").length == 0) {
            alert("No path selected. Nothing will be deleted");
            return;
        }

        update_route_op = "/delete"

        // Get selected row
        var active_elem = document.getElementsByClassName("active_row")[0];    
        var selected_path = active_elem.innerHTML;
    }
    else {
        console.error("Invalid operation")
        return;
    }

    update_route = "/dirs" + update_route_dst + update_route_op + "?path=" + selected_path;
    update_response = requestApi("PATCH", update_route, "Cannot update dirs locations.", false);

    if(update_response.hasOwnProperty("success")) {
        if(hasClass(movies_btn, "active")) {
            moviesBtnClick();
        }
        else if(hasClass(series_btn, "active")) {
            seriesBtnClick();
        }
    }
    else {
        alert("Cannot update dirs locations");
    }
}

function requestApi(type, route, error_msg, async) {
    let request = new XMLHttpRequest();
    try {
        request.open(type, SERVER_URL + route, async);
        request.send();
        if(request.status == 200) {
            return JSON.parse(request.response);
        }
        else {
            alert("[ERROR " + request.status + "][" + request.statusText + "]: " + error_msg);
            return null;
        }
    }
    catch(e) {
        alert("[ERROR " + request.status + "][" + request.statusText + "]: " + error_msg);
        return null;
    }
}

function convertTimestampToDatetime(unix_timestamp) {
    var date = new Date(unix_timestamp);

    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}