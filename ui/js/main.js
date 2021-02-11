const fs = require('fs');
const path = require('path');

movies_json = null;
series_json = null;

var movies_btn = null;
var series_btn = null;

var tools_buttons = ["settings_btn", "connections_btn", "monitor_btn", "notifications_btn"];

var isModalShown = false;

var locations_table = null;

window.onload = function() {
    movies_btn = document.getElementById("movies_btn");
    series_btn = document.getElementById("series_btn");

    movies_json = JSON.parse(fs.readFileSync(path.resolve("../config", "movies.json")));
    series_json = JSON.parse(fs.readFileSync(path.resolve("../config", "series.json")));

    console.log(movies_json)

    alert(movies_json);
    alert(series_json);

    // Initialize main table, where locations are shown
    locations_table = document.getElementById("locations_table");
    locations_table.setAttribute("style","height:"+(window.innerHeight * 0.75)+"px");
    locations_table.style.visibility = "visible";

    moviesBtnClick();
}

function initializeTable(type) {
    var header_th = document.createElement("th");
    header_th.innerHTML = "Locations - " + type;
    
    var header_tr = document.createElement("tr");
    header_tr.appendChild(header_th);
    
    var table_body = document.createElement('tbody');
    table_body.appendChild(header_tr);

    locations_table.appendChild(table_body);


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

    initializeTable("Movies");
}

function seriesBtnClick() {
    series_btn.classList.add("active");
    movies_btn.classList.remove("active");

    initializeTable("Series");
}