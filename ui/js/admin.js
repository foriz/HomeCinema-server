const { ipcRenderer } = require("electron");
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
        closeMethods: ['button'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        onClose: function() {
            console.log('modal closed');
        },
        beforeClose: function() {
            return true;
            return false;
        }
    });
    
    // Footer Buttons
    modal.addFooterBtn('Save', 'tingle-btn tingle-btn--primary', function() {
        // Save content and close modal
        modal.close();
    });
    modal.addFooterBtn('Close', 'tingle-btn tingle-btn--danger', function() {
        // Close modal without saving
        modal.close();
    });

    // Main Content
    modal.setContent('');
    modal.setContent(''
        + '<label for="fname">First name:</label>'
        + '<input type="text" id="fname" name="fname">'
    +'');

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