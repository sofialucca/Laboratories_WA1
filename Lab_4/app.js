'use strict';

function Film(id, title, favorite = false, date = "", rating = 0){
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    this.date = dayjs(date);
    this.rating = rating;
};

function FilmLibrary(){
    this.list = [];

    this.init = () => {
        this.list.push(
            new Film(1, 'Pulp Fiction', true,'2022-03-10', 5),
            new Film(2,'21 Grams', true, '2022-03-17', 4),
            new Film(3, 'Star Wars', false),
            new Film(4, 'Matrix', false, '2022-03-21'),
            new Film(5, 'Shrek', false, '2022-03-21', 3)

        )
    }

    this.getAll = () =>{
        return this.list;
    }

    this.getFavorite = () =>{
        return [...this.list].filter((film) => film.favorite);
    }

    this.getBestRated = () => {
        return [...this.list].filter((film) => film.rating === 5);
    }

    this.getLastMonth = () => {
        return [...this.list].filter((film) => (film.date.isAfter(dayjs().subtract(30, 'day') && film.date.isBefore(dayjs()))));
    }

    this.getLastSeen = () => {

        let lastSeen = [];
        lastSeen.push(this.list[0]);
        const arrayList = [...this.list];
        arrayList.shift();
        arrayList.forEach((film) => {
            if(film.date.isSame(lastSeen[0].date)){
                lastSeen.push(film);
            }else if(film.date.isAfter(lastSeen[0].date)){
                lastSeen = [];
                lastSeen.push(film);
            }
        })

        return lastSeen;
    }
}

function createFilmRow(film){

    let starRow = "";
    for(let i = 1; i<=5;i++  ){
        starRow += `<i class = 'bi-star${(i <= film.rating)?'-fill':''}' d-inline-block align-text" role="img"></i>`; 
    }
    return `<tr id = 'row-${film.id}'>
        <td ${film.favorite? "class = 'text-danger'":'' }>${film.title}</td>
        <td>
            <input type="checkbox" id="favorite" name="favorite" ${film.favorite? "checked":'' }>
            <label for="favorite">Favorite</label>      
        </td>
        <td>${(film.date.isValid())?film.date.format("MMMM DD, YYYY"):""}</td>
        <td>
            ${starRow}
        </td>

    </tr>
    `

}

function fillFilmTable(films){
    const filmTable = document.getElementById('film-table');

    for(const film of films){
       const filmEl = createFilmRow(film);
       filmTable.insertAdjacentHTML("beforeend",filmEl);

       const filmRow = document.getElementById(('row-'+film.id));
       const tdActions = document.createElement('td');
       tdActions.innerHTML = `<button id = 'film-${film.id}' class='btn btn-danger'>
                <i class = "bi bi-trash3 " role="img"></i></button>`;
       filmRow.appendChild(tdActions);
      
       tdActions.addEventListener('click', e => {
            filmRow.remove();
           console.log(e.target.id);
       })

    }
}

function setSideBar(btnSelected){
    const sideBar = document.getElementsByClassName("sidebar")[0];
    for(const child of sideBar.getElementsByClassName("btn")){

        if(child.getAttribute("class") !== btnSelected.getAttribute("class")){
            child.setAttribute("class","btn  btn-side-bar");

        }
    }
    console.log(sideBar);
    btnSelected.setAttribute("class","btn btn-outline-light btn-side-bar selected");

}

function setButtonHandler(library){
    const title = document.getElementById('title');
    const filmTable = document.getElementById('film-table');
    
    const btnAll = document.getElementById("btn-all");    
    btnAll.addEventListener('click', e =>{
        title.innerText = "All";
        filmTable.innerText = "";
        fillFilmTable(library.getAll());
        setSideBar(btnAll);
    });

    const btnFav = document.getElementById("btn-favorite");    
    btnFav.addEventListener('click', e =>{
        title.innerText = "Favorite";
        filmTable.innerText = "";
        fillFilmTable(library.getFavorite());
        setSideBar(btnFav);
    });

    const btnBestRated = document.getElementById("btn-bestrated");    
    btnBestRated.addEventListener('click', e =>{
        title.innerText = "Best Rated";
        filmTable.innerText = "";
        fillFilmTable(library.getBestRated());
        setSideBar(btnBestRated);
    });

    const btnseenLastMonth = document.getElementById("btn-seenlastmonth");    
    btnseenLastMonth.addEventListener('click', e =>{
        title.innerText = "Seen Last Month";
        filmTable.innerText = "";
        fillFilmTable(library.getLastMonth());
        setSideBar(btnseenLastMonth);
    });

    const btnLastSeen = document.getElementById("btn-lastseen");
    btnLastSeen.addEventListener('click', e =>{
        title.innerText = "Last Seen";
        filmTable.innerText = "";
        fillFilmTable(library.getLastSeen());
        setSideBar(btnLastSeen);
    });    

}

const filmLibrary = new FilmLibrary();
filmLibrary.init();
const films = filmLibrary.getAll();
fillFilmTable(films);
setButtonHandler(filmLibrary);
