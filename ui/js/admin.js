const { ipcRenderer } = require("electron")

var movies_btn = null;
var series_btn = null;

var dir_selector = null;

var tools_buttons = ["settings_btn", "connections_btn", "monitor_btn", "notifications_btn"];

var isModalShown = false;

var locations_table = null;
var dirs = null;

var SERVER_URL = "";

document.onreadystatechange = function(e) {
    if (document.readyState === 'complete') {
        config = ipcRenderer.sendSync("synchronous-message", "config");
        SERVER_URL = "http://" + config["server"]["host"] + ":" + config["server"]["port"]; 
    }
};

window.onload = function() {
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

function setToolActive(elem) {
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

        // Change pic to selected
        elem.src = elem.src.replace(".svg", "_selected.svg");

        // Open modal(pop-up) window
        if(isModalShown) {
            changeModalContent();
        }
        else {
            openModal();
        }
    }
}

function setToolInactive(elem) {
    if(hasClass(elem, "active_tool")) {
        elem.classList.remove("active_tool");
        elem.src = elem.src.replace("_selected.svg", ".svg");
    }
}

function openModal() {
    /* TODO: uncomment it
    var modal = document.getElementById("modal");
    modal.style.display = "block";

    // TODO: implement different function for each tool that can open modal

    isModalShown = true;
    */
}

function closeModal() {
    var modal = document.getElementById("modal");
    modal.style.display = "none";

    setToolInactive(document.getElementsByClassName("active_tool")[0]);

    isModalShown = false;
}

function changeModalContent() {
    // TODO: change modal content based on tool clicked
}

function moviesBtnClick() {
    movies_btn.classList.add("active");
    series_btn.classList.remove("active");

    // TODO: change
    dirs = requestApi("GET", "/ping", "");
    //dirs = requestApi("GET", "/dirs", "Cannot fetch saved locations for movies & series.");

    cleanTable();
    initializeTable("Movies");
    if(dirs != null) {
        fillTable(dirs['movies']);
    }
}

function seriesBtnClick() {
    series_btn.classList.add("active");
    movies_btn.classList.remove("active");

    cleanTable();
    initializeTable("Series");
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
    var dirs_to_change = null;
    var update_route_dst = null;
    var update_route_op = null;    

    if(hasClass(movies_btn, "active")) {
        dirs_to_change = dirs["movies"];
        update_route_dst = "/movies";
    }
    else if(hasClass(series_btn, "active")) {
        dirs_to_change = dirs["series"];
        update_route_dst = "/series"
    }

    if(operation == "add") {
        update_route_op = "_add"
        //dir_selector.click();

        const {dialog} = require('electron').remote;
        var selected_path = dialog.showOpenDialogSync({
            properties: ['openDirectory']
        });

        dirs_to_change.push(selected_path);
    }
    else if(operation == "remove") {
        if(document.getElementsByClassName("active_row").length == 0) {
            alert("No path selected. Nothing will be deleted");
            return
        }

        update_route_op = "_remove"

        // Get selected row
        var active_elem = document.getElementsByClassName("active_row")[0];    

        // Find index of selected element
        var index_to_delete = dirs_to_change.indexOf(active_elem.innerHTML)

        // Delete selected element
        if (index_to_delete > -1) {
            dirs_to_change.splice(index_to_delete, 1);
        }
    }
    else {
        console.error("Invalid operation")
    }

    cleanTable();

    if(hasClass(movies_btn, "active")) {
        dirs["movies"] = dirs_to_change;

        initializeTable("Movies");
        fillTable(dirs["movies"]);
    }
    else if(hasClass(series_btn, "active")) {
        dirs["series"] = dirs_to_change;

        initializeTable("Series");
        fillTable(dirs["series"]);
    }

    update_route = "dirs" + update_route_op + update_route_dst

    // Async make request to server to update db
    if(update_route != null) {
        requestApiAsync("PATCH", update_route, "Cannot update directories")
    }
}

function requestApi(type, route, error_msg) {
    let request = new XMLHttpRequest();
    request.open(type, SERVER_URL + route, false);
    request.send();
    if(request.status == 200) {
        // TODO: change
        //return JSON.parse(request.response);
        return JSON.parse('{"movies": ["K:/Movies", "F:/Movies"]}');
    }
    else {
        alert("[ERROR " + request.status + "][" + request.statusText + "]: " + error_msg);
        return null;
    }
}

function requestApiAsync(type, route, error_msg) {
    let request = new XMLHttpRequest();
    request.open(type, SERVER_URL + route, false);
    request.send();
    request.onload = function() {
        if(request.status == 200) {
            console.log("Async requested completed successfully");
        }
        else {
            console.log("[ERROR " + request.status + "][" + request.statusText + "]: " + error_msg);
        }
    }
}