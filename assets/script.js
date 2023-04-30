const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')
//const cslyrics = document.getElementById("cslyrics")

var track ="";
var access_token = "KqzWE0vkiT2Uzo1upbHHPWUBF-OI3n2FFcvwRgeC17gpj0Ba_mMstaT_8UdY1rbP";
var historyStorage = [];
/// api URL ///
const apiURL = 'https://api.lyrics.ovh';


/// adding event listener in form
// comment

form.addEventListener('submit', e=> {
    e.preventDefault();
    searchValue = search.value.trim()
console.log(searchValue);
    if(!searchValue){
        openModal(modal)
    }
    else{ 
        searchSong(searchValue)
    }
})

//search song 
async function searchSong(searchValue){
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`)
    console.log(searchResult);
    const data = await searchResult.json();
    console.log(data);

    // console.log(finaldata)
    showData(data)
}

//display final result in DO
function showData(data){

result.innerHTML = `
    <ul class="uk-flex uk-flex-column song-list">
      ${data.data
        .map(song=> `<li onclick = selected_track(this.id) id ="${song.title} ${song.artist.name}">
                    <div class = "cs-button">
                        <img src="${song.artist.picture}" alt="Artist image">
                        <strong>${song.artist.name}</strong> - ${song.title} 
                    </div>
                    <span data-artist="${song.artist.name}" data-songtitle="${song.title}"></span>
                </li>`
                
        )
        .join('')}
    </ul>
    
  `
  images.innerHTML = `
        <ul class="mood-images">
          ${data.data
            .map(song=> `<div id ="${song.title} by ${song.artist.name}">
                        <div>
                            <img src="https://source.unsplash.com/random/1600x900/?+${song.title}">

                        </div>
                    </div>`
            )
            .join('')}
        </ul>   
      `

}

function selected_track(id){
    track = encodeURI(id);
    console.log(track);
    get_lyrics(track);
    createBtn(id);
}
result.addEventListener('click', e=>{
    const clickedElement = e.target;

    //checking clicked elemet is button or not
    if (clickedElement.tagName === 'SPAN'){
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');
        
        getLyrics(artist, songTitle)
    }
})

function get_lyrics(track){
    var queryURL = "https://api.genius.com/search?q="+track+"&access_token="+access_token;
    console.log(queryURL);
    fetch(queryURL)
        .then(function(response){
            console.log(response);
            return response.json();
        })
        .then(function(data){
            console.log(data);
            var id = data.response.hits[0].result.id;
            console.log(id);
            get_lyrics_by_id(id);
        })
 }

//  function get_lyrics_by_id(id){
//     var queryURL = "https://api.genius.com/songs/"+id+"?access_token=SEwsuu6UmlRS_iXwgWpm-j6ZTmAB5uuTreJxdMijRiWz41sZfWjaQ-oUR6uZbBJm";
//     fetch(queryURL)
//         .then(function(response){
//             console.log(response);
//             return response.json();
//         })
//         .then(function(data){
//             console.log(data);
//             var test = data.response.song.embed_content;
//             console.log(test);

//         })
// }

async function get_lyrics_by_id(id){
    var queryURL = "https://api.genius.com/songs/"+id+"?access_token="+access_token;

    const searchResult = await fetch(queryURL)
    console.log(searchResult);
    const data = await searchResult.json();
    console.log(data);
    display_lyrics(data);
}

function display_lyrics(data){
    console.log(data.response.song.embed_content);
    var test;
    test = data.response.song.url;
    test4(test);
}

function test4(test){
    // console.log(test);
    // var newWin = window.open("./index_test.html");
    // newWin.onload = function(){
    //     var ident = newWin.document.getElementById("cslyrics");
    //     ident.innerHTML = `${test}`
    //   };
    //   test5(newWin);

    // document.location.href = test;
    window.open(test);
}
function test5(newWin){
    newWin;
}


const openModalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const overlay = document.getElementById('overlay')

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.querySelector(button.dataset.modalTarget)
    openModal()
  })
})

overlay.addEventListener('click', () => {
  const modals = document.querySelectorAll('.modal.active')
  modals.forEach(modal => {
    closeModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    closeModal(modal)
  })
})

function openModal() {
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  if (modal == null) return
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

function createBtn(track){
  historyStorage.push(track);
  localStorage.setItem("historyStorage",JSON.stringify(historyStorage));
  console.log(historyStorage);
  createBtn2part(track);
}

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

function createHitoryBtn(track){

}

function init() {
  var stored_historyStorage = JSON.parse(localStorage.getItem("historyStorage"));
  if (stored_historyStorage !== null) {
    historyStorage = stored_historyStorage;

    console.log("test");
    for (i = 0; i < historyStorage.length; i++){
      console.log(historyStorage[i]);
      createBtn2part(historyStorage[i]);
    }
}}

init();