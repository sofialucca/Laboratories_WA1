'use strict';
const { Console } = require('console');
const dayjs = require('dayjs');
const sqlite = require('sqlite3');

function Film(id, title, favorite = false, ...optional){
  this.id = id;
  this.title = title;
  this.favorite = favorite;
  if(typeof(optional[0]) === 'string'){
      this.date = dayjs(optional[0]);
  }else if(typeof(optional[0]) === 'number'){
      this.rating = optional[0];
  }
  if(typeof(optional[1]) === 'number'){
      this.rating = optional[1];
  }
  this.toString = () => `ID: ${this.id} TITLE: ${this.title} FAVORITE: ${this.favorite? 'YES':'NO'} WATCHING DATE: ${this.date !== undefined? this.date.format('DD-MM-YYYY'): 'Not watched yet'} RATING: ${(this.rating !== undefined)? this.rating : 'No rating available'}\n`;
};

function FilmLibrary(){
    this.list =[];
    const db = new sqlite.Database('films.db', (err) => {if(err) throw err;});

    this.addNewFilm = (film) => {
        this.list.push(film);
    }

    //non completo
    this.sortByDate = () => {
        return [...this.list].sort((a,b) =>{
        
            if(!a.date.isValid()){
                return 1;
            }
            if(!b.date.isValid()){
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
            if(film.date.isValid()){
                film.date = dayjs('');
            }
        })
    }

    this.getRated = () => {
        return [...this.list].filter((film) => film.rating !== 0).sort((a,b) => b.rating - a.rating);      
    }

    this.getAll = () => {
    
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM  films';
    
          db.all(sql, [], (err,rows) => {
            if(err)
              reject(err);
            else{
              const films = rows.map(row => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating));
              resolve(films);
            }
              
          })
        });
    }

    this.getFavorites = () => {
    
        return new Promise((resolve, reject) => {
          const sql = "SELECT * FROM films WHERE favorite = true";
    
          db.all(sql, [], (err,rows) => {
            if(err)
              reject(err);
            else{
                if(rows.length > 0){
                    const films = rows.map(row => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating));
                    resolve(films);                    
                }else{
                    resolve('No favorite film');
                }
            }
              
          })
        });
    }

    this.getWatchedToday = () => {
    
        return new Promise((resolve, reject) => {
          const sql = "SELECT * FROM films WHERE watchdate = ?";
          db.all(sql,[dayjs().format('YYYY-MM-DD')] , (err,rows) => {
            if(err)
              reject(err);
            else{
                if(rows.length > 0){
                    const films = rows.map(row => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating));
                    resolve(films);                    
                }else{
                    resolve('No film watched today');
                }
            }
              
          })
        });
    }

    this.getWatchedBefore = (date) => {
    
        return new Promise((resolve, reject) => {
          const sql = "SELECT * FROM films WHERE watchdate < ?";
          db.all(sql,[date.format('YYYY-MM-DD')] , (err,rows) => {
            if(err)
              reject(err);
            else{
                if(rows.length > 0){
                    const films = rows.map(row => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating));
                    resolve(films);                    
                }else{
                    resolve('No film watched before '+ date.format('YYYY-MM-DD'));
                }
            }
              
          })
        });
    }

    this.getHigherRating = (rating) => {
    
        return new Promise((resolve, reject) => {
          const sql = "SELECT * FROM films WHERE rating >= ?";
          db.all(sql,[rating] , (err,rows) => {
            if(err)
              reject(err);
            else{
                if(rows.length > 0){
                    const films = rows.map(row => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating));
                    resolve(films);                    
                }else{
                    resolve('No film with rating higher than '+ rating);
                }
            }
              
          })
        });
    }
    
    this.getFromTitle = (title) => {
    
        return new Promise((resolve, reject) => {
          const sql = "SELECT * FROM films WHERE title = ?";
          db.all(sql,[title] , (err,rows) => {
            if(err)
              reject(err);
            else{
                if(rows.length > 0){
                    const films = rows.map(row => new Film(row.id,row.title,row.favorite,row.watchdate,row.rating));
                    resolve(films);                    
                }else{
                    resolve('No film with title '+ title);
                }
            }
              
          })
        });
    }

    //non funziona
    this.addToDb = (film) => {
    
      return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO films(id,title,favorite,watchdate,rating) VALUES(?,?,?,DATE(?),?)';
        db.run(sql, [film.id,film.title, film.favorite, film.date !== undefined? film.date.format('DD-MM-YYYY'): '', film.rating], function (err){
          if(err) reject(err);
          else resolve(`Successfully added ${film.title} with id ${this.lastID}`);
          //
        })
      });
  
    };

    this.deleteFromDb = (id) => {
    
      return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM films WHERE id = ?';

        db.run(sql, [id], function (err){
          if(err) reject("Can't delete film with id " + id);
          else resolve("Successfully deleted film with id " + id);
        })
      });
  
    };

    this.deleteWatchDateDb = () => {
    
      return new Promise((resolve, reject) => {
        const sql = 'UPDATE films SET watchdate = NULL';

        db.run(sql, [], function (err){
          if(err) reject("Can't delete films' watchdate");
          else resolve("Successfully deleted films' watchdate" );
        })
      });
  
    };
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

//LAB2
async function main(){

    console.log("All films in the DB:");
    const allFilms = await  films.getAll();
    console.log(allFilms.toString());

    console.log("\nFavorite films in the DB:");
    const favoriteFilms = await  films.getFavorites();
    console.log(favoriteFilms.toString());

    console.log("\nFilms watched today:");
    const todayFilms = await  films.getWatchedToday();
    console.log(todayFilms.toString());

    const dateRef = dayjs('2022-03-21');
    console.log(`\nFilms watched before ${dateRef}:`);
    const beforeFilms = await  films.getWatchedBefore(dateRef);
    console.log(beforeFilms.toString());

    const score = 4;
    console.log(`\nFilms with score higher than ${score}:`);
    const higherScoreFilms = await  films.getHigherRating(score);
    console.log(higherScoreFilms.toString());

    const title = 'Hi'
    console.log(`\nFilms with tittle ${title}:`);
    const titleFilms = await  films.getFromTitle(title);
    console.log(titleFilms.toString());

    const titanic = new Film(7,'Titanic',false,'2012-03-22',4);

    const newFilm = await films.addToDb(titanic);
    console.log(newFilm);

    const mexDelete = await films.deleteFromDb(2);
    console.log(mexDelete);

    /*const mexUpdate = await films.deleteWatchDateDb();
    console.log(mexUpdate);*/
}
 main();


/*
LAB1
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
films.list.forEach((film) => {console.log(film)});
console.log();
*/
