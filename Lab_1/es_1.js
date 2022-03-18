'use strict';
const dayjs = require('dayjs');


function Film(id, title, favorite = false, ...optional){
    this.id = id;
    this.title = title;
    this.favorite = favorite;
    if(dayjs.isDayjs(optional[0])){
        this.date = optional[0];
    }else if(typeof(optional[0]) === 'number'){
        this.rating = optional[0];
    }
    if(typeof(optional[1]) === 'number'){
        this.rating = optional[1];
    }

};

function FilmLibrary(){
    this.list = [];

    this.addNewFilm = (film) => {
        this.list.push(film);
    }

    //non completo
    this.sortByDate = () => {
        return [...this.list].sort((a,b) =>{
        
            if(a.date === undefined){
                return 1;
            }
            if(b.date === undefined){
                return -1;
            }
            if(a.date.isAfter(b.date)){
                return 1;
            }else{
                return -1;
            }
        });
    }

    this.deleteFilm = (id) => {
        this.list = [...this.list].filter((film) => film.id !== id);
    }

    this.resetWatchedFilms = () => {
        return [...this.list].map((film) => {
            if(film.date !== undefined){
                film.date = undefined;
            }
        })
    }

    this.getRated = () => {
        return [...this.list].filter((film) => film.rating !== undefined).sort((a,b) => b.rating - a.rating);      
    }
};

const pulpFiction = new Film(1, 'Pulp Fiction', true, dayjs('2022-03-10'), 5);
const twentyoneGrams = new Film(2,'21 Grams', true, dayjs('2022-03-17'), 4);
const starWars = new Film(3, 'Star Wars', false);
const matrix = new Film(4, 'Matrix', false);
const shrek = new Film(5, 'Shrek', false, dayjs('2022-03-21'), 3); 

const films = new FilmLibrary();
films.addNewFilm(pulpFiction);
films.addNewFilm(twentyoneGrams);
films.addNewFilm(starWars);
films.addNewFilm(matrix);
films.addNewFilm(shrek);

console.log(films);
console.log('\nSorting by date:');
console.log(films.sortByDate());

console.log("\nSorting by score:");
console.log(films.getRated());

console.log("\nRemove Pulp Fiction");
films.deleteFilm(1);
console.log(films);

console.log("\nReset watched");
films.resetWatchedFilms();
console.log(films);

