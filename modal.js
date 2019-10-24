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
  pages[0].style.marginTop = "0px";
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
  pages[0].style.marginTop = "40px";
  for (i = 0; i < pages.length; i++) {
    pages[i].style.display = "block";
    each_page = pages[i].getElementsByClassName("page");
  
    for (j=0; j<each_page.length; j++) {
      each_page[j].style.display = "block";
      each_page[j].style.width = "95%";
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
  if (window.matchMedia("only screen and (min-device-width : 375px) and (max-device-width : 812px)").matches) {
    document.getElementById("title").style.textAlign = "left";
    document.getElementById("title").style.width = "80vw";
    document.getElementById("body").style.fontSize = "36px";
    document.getElementById("prev").style.display = "none";
    document.getElementById("next").style.display = "none";
    document.getElementById("close").style.fontSize = "180px";
    document.getElementById("close").style.lineHeight = "1";
    document.getElementById("modal-viewer").style.backgroundColor = "black";
    showDevice = showPhone;
  } else {
    document.getElementById("title").style.textAlign = "center";
    document.getElementById("title").style.width = "50vw";
    document.getElementById("body").style.fontSize = "16px";
    document.getElementById("prev").style.display = "block";
    document.getElementById("next").style.display = "block";
    document.getElementById("close").style.fontSize = "35px";
    document.getElementById("close").style.lineHeight = "auto";
    document.getElementById("modal-viewer").style.backgroundColor = "rgba(0, 0, 0, 0.5)";
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