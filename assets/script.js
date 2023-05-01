const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')

const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')
const apiURL = 'https://api.lyrics.ovh';
var track ="";
var access_token = "KqzWE0vkiT2Uzo1upbHHPWUBF-OI3n2FFcvwRgeC17gpj0Ba_mMstaT_8UdY1rbP";
var historyStorage = [];

/// Adds event listener to the form
form.addEventListener('submit', e=> {
  e.preventDefault();
  searchValue = search.value.trim()
  if(!searchValue){
    openModal(modal)
  }
  else{ 
    searchSong(searchValue)
  }
})

/// Adds event listener to displayed alert in order to close it
overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

/// Retrieves the past items stored in local storage and displays them in the "search history" container 
function init() {
  var stored_historyStorage = JSON.parse(localStorage.getItem("historyStorage"));
    if (stored_historyStorage !== null) {
      historyStorage = stored_historyStorage;
      for (i = 0; i < historyStorage.length; i++){
      createBtn2part(historyStorage[i]);
    }
  }}

/// Searches for a song (when pressing the search button) using the "API Lyrics OVH" server-side API
async function searchSong(searchValue){
  const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`)
  const data = await searchResult.json();
  showData(data)
}

/// Creates a list of results that are displayed when a search is made using the SEARCH button
function showData(data){
  result.innerHTML = `
    <ul class="uk-flex uk-flex-column song-list">
      ${data.data
        .map(song=> 
            `<li onclick = selected_track(this.id) id ="${song.title} ${song.artist.name}">
              <div class = "cs-button">
                <img src="${song.artist.picture}" alt="Artist image">
                <strong>${song.artist.name}</strong> - ${song.title} 
              </div>
              <span data-artist="${song.artist.name}" data-songtitle="${song.title}"></span>
            </li>`)
        .join('')}
    </ul>`

  images.innerHTML = 
    `<ul class="mood-images">
      ${data.data
        .map(song=> 
          `<div id ="${song.title} by ${song.artist.name}">
            <div><img src="https://source.unsplash.com/random/1600x900/?+${song.title}"></div>
          </div>`)
        .join('')}
    </ul>`
}

/// Uses the encodeURI() method to convert the selected song (specifically the song's title and artist) to a UTF-8 text, ready to be used in the following functions 
/// Also converts the results from search input into buttons that link to that song's lyrics
function selected_track(id){
    track = encodeURI(id);
    get_lyrics(track);
    createBtn(id);
}

/// Searches for a song (in the "Genius.com" website) that meets the selected song's values, and returns an id from Genius
function get_lyrics(track){
  var queryURL = "https://api.genius.com/search?q="+track+"&access_token="+access_token;
  fetch(queryURL)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    var id = data.response.hits[0].result.id;
    get_lyrics_by_id(id);
  })
 }

/// Uses the 1st element's id to provide its properties to the display_lyrics function, for it to obtain a unique URL 
async function get_lyrics_by_id(id){
  var queryURL = "https://api.genius.com/songs/"+id+"?access_token="+access_token;
  const searchResult = await fetch(queryURL)
  const data = await searchResult.json();
  display_lyrics(data);
}

/// Uses the selected id's URL property to display its lyrics, using the "Genius.com" server-side API
function display_lyrics(data){
  console.log(data.response.song.embed_content);
  var URL;
  URL = data.response.song.url;
  openLyricsPage(URL);
}

/// Uses the open() method to open a separate browser tab that displays the song's lyrics
function openLyricsPage(URL){
  window.open(URL);
}

/// Stores selected songs as elements in the local storage, so they can be later displayed in the search history column
function createBtn(track){
  historyStorage.push(track);
  localStorage.setItem("historyStorage",JSON.stringify(historyStorage));
  createBtn2part(track);
}

/// Creates button elements to be stored in the local storage
function createBtn2part(track){
  var trackBtn = document.createElement("button");
  trackBtn.classList.add("btn","uk-button", "uk-button-danger","cs-btn-srch");
  trackBtn.setAttribute("id",track);
  trackBtn.setAttribute("onClick","get_lyrics(this.id)");
  trackBtn.innerText = track;
  var img = document.createElement("img");
  img.classList.add("cs-btn-img");
  img.setAttribute("src","https://source.unsplash.com/random/100x100/?"+track);
  document.getElementById("SearchHistory").appendChild(trackBtn);
  document.getElementById("SearchHistory").appendChild(img);
}



/// The following are functions intended to display a pop up alert (Modal) in case nothing is entered into the search input
openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    openModal()
  })
})
/// Modal function
closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    closeModal(modal)
  })
})
/// Modal function
function openModal() {
  modal.classList.add('active')
  overlay.classList.add('active')
}
/// Modal function
function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}


/// Retrieves the elements stored in local storage
init();