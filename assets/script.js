const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')


/// api URL ///
const apiURL = 'https://api.lyrics.ovh';


/// adding event listener in form
// comment

form.addEventListener('submit', e=> {
    e.preventDefault();
    searchValue = search.value.trim()
console.log(searchValue);
    if(!searchValue){
        alert("There is nothing to search")
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
    <ul class="song-list">
      ${data.data
        .map(song=> `<li>
                    <div>
                        <img src="${song.artist.picture}" alt="Artist image">
                        <strong>${song.artist.name}</strong> - ${song.title} 
                    </div>
                    <span data-artist="${song.artist.name}" data-songtitle="${song.title}"> get lyrics</span>
                </li>`
        )
        .join('')}
    </ul>
  `;
}

function showImages(){

}




//event listener in get lyrics button
result.addEventListener('click', e=>{
    const clickedElement = e.target;

    //checking clicked elemet is button or not
    if (clickedElement.tagName === 'SPAN'){
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');
        
        getLyrics(artist, songTitle)
    }
})
