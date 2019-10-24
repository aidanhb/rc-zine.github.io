var volumeIndex = 1;
var pageIndex = 1;
var showDevice = showDesktop;

function setOnClick() {
  var onPhone = window.matchMedia("(max-width: 400px)");
  var volumes = document.getElementsByClassName("volume");
  if (onPhone) {
    for (i=0; i<volumes.length; i++) {
      volumes[i].onclick = function() {}
    }
  } else {
    for (i=0; i<volumes.length; i++) {
      volumes[i].onclick = function() {currentPage(i, 1); openModal();}
    }
  }
}

function closeModal() {
    document.getElementById("modal-viewer").style.display = "none";
    volumeIndex = 1;
    pageIndex = 1;
}

function openModal() {
    document.getElementById("modal-viewer").style.display = "block";
}

// Next/previous controls
function plusPages(n) {
  showPages(volumeIndex, pageIndex += n);
}

// Thumbnail image controls
function currentPage(v, n) {
  showPages(volumeIndex = v, pageIndex = n);
}

function showDesktop(pages) {

  for (i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
    each_page = pages[i].getElementsByClassName("page");
    for (j=0; j<each_page.length; j++) {
      each_page[j].style.display = "inline-block";
      each_page[j].style.width = "40%";
    }
  }
  pages[pageIndex-1].style.display = "block";
}

function showPhone(pages) {
  /* This changes modal display for the phone*/

  for (i = 0; i < pages.length; i++) {
    pages[i].style.display = "block";
    each_page = pages[i].getElementsByClassName("page");
    for (j=0; j<each_page.length; j++) {
      each_page[j].style.display = "block";
      each_page[j].style.width = "90%";
    }
  }
}

function showPages(v, n) {
  var i;
  var volumes = document.getElementsByClassName("volume-contents");
  if (v > volumes.length) {volumeIndex = 1}
  if (v < 1) {volumeIndex = volumes.length}
  var pages = volumes[volumeIndex-1].getElementsByClassName("pages");
  if (n > pages.length) {pageIndex = pages.length}
  if (n < 1) {pageIndex = 1}
  showDevice(pages);
}

function setShowDevice() {
  if (window.matchMedia("(max-width:500px)").matches) {
    document.getElementById("body").style.fontSize = "14px";
    document.getElementById("prev").style.display = "none";
    document.getElementById("next").style.display = "none";
    showDevice = showPhone;
  } else {
    document.getElementById("body").style.fontSize = "16px";
    document.getElementById("prev").style.display = "block";
    document.getElementById("next").style.display = "block";
    showDevice = showDesktop;
  }
}

window.onload = function(e) {
  setShowDevice();
  showPages(pageIndex);
}

window.onresize = function(e) {
  setShowDevice();
  showPages(pageIndex);
}