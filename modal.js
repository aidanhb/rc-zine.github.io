function closeModal() {
    document.getElementById("modal-viewer").style.display = "none";
    document.getElementById("content").style.opacity = 1.0;
}

function openModal() {
    document.getElementById("modal-viewer").style.display = "block";
    document.getElementById("content").style.opacity = 0.3;
}

var volumeIndex = 1;
var pageIndex = 1;

// Next/previous controls
function plusPages(n) {
  showPages(volumeIndex, pageIndex += n);
}

// Thumbnail image controls
function currentPage(v, n) {
  showPages(volumeIndex = v, pageIndex = n);
}

function showPages(v, n) {
  var i;
  var volumes = document.getElementsByClassName("volume-contents");
  if (v > volumes.length) {volumeIndex = 1}
  if (v < 1) {volumeIndex = volumes.length}
  var pages = volumes[volumeIndex-1].getElementsByClassName("pages");
  if (n > pages.length) {pageIndex = 1}
  if (n < 1) {pageIndex = pages.length}
  for (i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
  pages[pageIndex-1].style.display = "block";
}

window.onload = function(e) {
    showPages(pageIndex);
}