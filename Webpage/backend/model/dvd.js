//Name: Goh Rui ZHuo
//Admission Number:2222329
//Class: DAAA/FT/1B/05
var db = require('./databaseConfig');
var config = require('../config')
const jwt = require('jsonwebtoken')
var dvd = {
    getCat: (callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected')
                // Select the infomation base with limit and offset
                var query = 'SELECT * FROM category  '
                //query 
                conn.query(query, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getSpecificFilm: (filmid, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected');
                var query = 'SELECT *  FROM film f,film_actor fa, actor a,category c, film_category x WHERE f.film_id = x.film_id AND x.category_id = c.category_id AND f.film_id = ? AND f.film_id = fa.film_id AND fa.actor_id = a.actor_id'
                conn.query(query, filmid, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        if (result.length === 0) {
                            return callback(null, null)
                        }
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getFilmsByFilter: (search, category, min, max, page, callback) => {
        var conn = db.getConnection();
        console.log(search)
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected');
                let arr = []
                let query = ``
                if (category != undefined && category.length > 0) {
                    query = `SELECT  
                    f.film_id, f.title, f.description,f.release_year, f.rental_rate, c.category_id
                FROM
                    film f, category c, film_category x 
                WHERE
                     ("{?}" is null) OR (c.category_id in (?)
                    
                    AND f.film_id = x.film_id 
                    
                    AND 
    
                    x.category_id = c.category_id)
                        AND
    
                     (? is null OR title LIKE '%${search}%') AND (? is null OR f.rental_rate < ?) AND (? is null OR f.rental_rate > ?)
    
`
                    arr = [category, category, search, (max), (max), (min), (min)]
                }
                else {
                    query = `SELECT  
                    f.film_id, f.title, f.description,f.release_year,f.rental_rate
                FROM
                    film f
                WHERE
                     (title LIKE '%${search}%') AND (? is null OR f.rental_rate < ?) AND (? is null OR f.rental_rate > ?)
    `
                    arr = [max, max, min, min]


                }

                conn.query(query, arr, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        if (result.length === 0) {
                            return callback(null, null)
                        }
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getSpecificActor: (actid, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected');
                var query = 'SELECT DISTINCT * FROM actor a,film_actor x, film f WHERE a.actor_id = ? AND a.actor_id = x.actor_id AND x.film_id = f.film_id'
                conn.query(query, actid, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        if (result.length === 0) {
                            return callback(null, null)
                        }
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getAllActor: (callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected');
                var query = `SELECT * FROM actor`
                conn.query(query, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        if (result.length === 0) {
                            return callback(null, null)
                        }
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getStore: (callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected');
                var query = 'SELECT * FROM store s, address a WHERE s.address_id = a.address_id  '
                conn.query(query, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        if (result.length === 0) {
                            return callback(null, null)
                        }
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getCity: (callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected');
                var query = 'SELECT * FROM city  '
                conn.query(query, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        if (result.length === 0) {
                            return callback(null, null)
                        }
                        return callback(null, result)
                    }
                })
            }
        })
    },
    addActors: (first_name, last_name, callback) => {
        var conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)

            }

            else if (typeof (first_name) == 'undefined' || typeof (last_name) == 'undefined') {
                return callback(err, null)
            }
            else {
                console.log('Connected')
                console.log(first_name, last_name)
                var query = 'INSERT INTO actor (first_name,last_name) VALUES (?,?)'
                conn.query(query, [first_name, last_name], (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    addCustomer: (store_id, first_name, last_name, email, address, password, callback) => {
        const conn = db.getConnection();
        console.log('here')
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected')
                //insert into customer table with defualt address_id being null
                const query = 'INSERT INTO customer (store_id,first_name,last_name,email,address_id,password) values (?,?,?,?,1,?)'
                conn.query(query, [store_id, first_name, last_name, email, password], (err, result) => {
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        // Inserting the address infomation
                        const query2 = 'INSERT INTO address (address, address2,district,city_id,postal_code,phone) values (?,?,?,?,?,?)  '
                        conn.query(query2, [address.address_line1, address.address_line2, address.district, address.city_id, address.postal_code, address.phone], (err, result2) => {
                            console.log(result2)
                            if (err) {
                                console.log(err)
                                return callback(err, null)
                            }
                            //Update the address id in customer table
                            const query3 = 'UPDATE customer SET address_id = ? WHERE customer_id = ?'
                            conn.query(query3, [result2.insertId, result.insertId], (err) => {
                                conn.end()
                                console.log(err)
                                if (err) {
                                    return callback(err, null)
                                }
                                //return the result
                                return callback(null, result.insertId)
                            })
                        })
                    }
                })


            }
        })
    },
    getFilmsByID: (categoryID, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected')
                //Query to get films by id given
                var query = 'SELECT CAST(f.film_id as CHAR(50)) as film_id,f.title,c.name as category,f.rating,CAST(f.release_year as CHAR(50)) as release_year,CAST(f.length as CHAR(50)) as duration FROM film f,category c, film_category x WHERE c.category_id = ? AND f.film_id = x.film_id AND x.category_id = c.category_id '
                conn.query(query, categoryID, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getLatestFilms: (callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected')
                //Query to get films by id given
                var query = 'SELECT * FROM film ORDER BY release_year DESC LIMIT 3'
                conn.query(query, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getMostPopular: (callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected')
                var query = 'SELECT   f.release_year, f.rental_rate,f.film_id,f.title,   COUNT(f.film_id) AS `value_occurrence`   FROM   rental r, inventory i, film f WHERE r.inventory_id = i.inventory_id AND f.film_id = i.film_id GROUP BY    f.film_id  ORDER BY    `value_occurrence` DESC   LIMIT 10'

                ''


                conn.query(query, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getMaxPrice: (callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected')
                var query = 'SELECT rental_rate FROM film ORDER BY rental_rate DESC LIMIT 1'
                conn.query(query, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    updateActorInfo: (first_name, last_name, actorid, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected')
                var params = []
                //Check what info is provided
                if ((first_name) == '' & (last_name) != '') {
                    var query = ' UPDATE actor SET last_name = ? WHERE actor_id = ?';
                    params = [last_name.toUpperCase(), parseInt(actorid)]
                }
                else if ((first_name) != '' & (last_name) == '') {
                    var query = ' UPDATE actor SET first_name = ? WHERE actor_id = ?';
                    params = [first_name.toUpperCase(), parseInt(actorid)]

                }
                else {
                    var query = ' UPDATE actor SET first_name = ?, last_name = ? WHERE actor_id = ?';
                    params = [first_name.toUpperCase(), last_name.toUpperCase(), parseInt(actorid)]
                }
                //Execute the update info query
                conn.query(query, params, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })

            }
        })
    },
    review: (customer, film, text, rating, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                let query = 'INSERT INTO review (film_id,customer_id,reviews,rating) values (?,?,?,?) '
                conn.query(query, [film, customer, text, rating], (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    addToCart: (customer, film, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                let query1 = `SELECT DISTINCT * FROM rental, inventory WHERE inventory.film_id = ? AND rental.return_date IS NULL AND  inventory.inventory_id = rental.inventory_id;`
                conn.query(query1, [film], (err, result) => {
                    console.log('here', result)
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    if (result.length != 0) {
                        let inventory_id = result[0]['inventory_id']
                        let query3 = `SELECT COUNT(*) FROM inventory WHERE film_id = ? AND inventory_id != ?;
                            SELECT * FROM film WHERE film_id = ?`
                        conn.query(query3, [film, inventory_id, film], (err, result) => {
                            console.log(result)
                            if (err) {
                                console.log(err)
                                return callback(err, null)
                            }
                            else {
                                let count = result[0]['COUNT(*)']
                                if (count <= 0) {
                                    conn.end()
                                    return callback(null, null)
                                }
                                else {
                                    let amount = result[1][0]['rental_rate']
                                    console.log(amount)
                                    let query2 = 'INSERT INTO cart (customer_id,film_id,amount) values (?,?,?) '
                                    conn.query(query2, [customer, film, amount], (err, result) => {
                                        conn.end()
                                        if (err) {
                                            console.log(err)
                                            return callback(err, null)
                                        }
                                        else {
                                            console.log(result)
                                            return callback(null, result)
                                        }
                                    })
                                }
                            }
                        })
                    }
                    else {
                        let query3 = `SELECT COUNT(*) FROM inventory WHERE film_id = ? ;
                        SELECT * FROM film WHERE film_id = ?`
                        conn.query(query3, [film, film], (err, result) => {
                            console.log(result)
                            if (err) {
                                console.log(err)
                                return callback(err, null)
                            }
                            else {
                                let count = result[0]['COUNT(*)']
                                if (count <= 0) {
                                    conn.end()
                                    return callback(null, null)
                                }
                                else {
                                    let amount = result[1][0]['rental_rate']
                                    console.log(amount)
                                    let query2 = 'INSERT INTO cart (customer_id,film_id,amount) values (?,?,?) '
                                    conn.query(query2, [customer, film, amount], (err, result) => {
                                        conn.end()
                                        if (err) {
                                            console.log(err)
                                            return callback(err, null)
                                        }
                                        else {
                                            console.log(result)
                                            return callback(null, result)
                                        }
                                    })
                                }
                            }
                        })
                    }
                })
            }
        })
    },
    getReview: (film, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                let query = 'SELECT * FROM review r, customer c WHERE r.customer_id = c.customer_id AND film_id = ?'
                conn.query(query, film, (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getCart: (id, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {

                let query = 'SELECT * FROM cart,film  WHERE customer_id = ? AND film.film_id = cart.film_id'
                conn.query(query, [id], (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log(result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    getQuantity: (film, id, callback) => {
        var conn = db.getConnection()
        console.log('film', film)
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                let query1 = `SELECT DISTINCT * FROM rental, inventory WHERE inventory.film_id = ? AND rental.return_date IS NULL AND  inventory.inventory_id = rental.inventory_id AND inventory.store_id = ?;`
                conn.query(query1, [film, id], (err, result) => {
                    console.log('here', result)
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    if (result.length != 0) {
                        let inventory_id = result[0]['inventory_id']

                        let query3 = `SELECT COUNT(*) FROM inventory WHERE film_id = ? AND inventory_id != ? AND store_id = ?;`
                        conn.query(query3, [film, inventory_id, id], (err, result) => {
                            conn.end()
                            console.log(result)
                            if (err) {
                                console.log(err)
                                return callback(err, null)
                            }
                            else {
                                return callback(null, result)
                            }

                        })
                    }
                    else {
                        console.log(film, id)
                        let query3 = `SELECT COUNT(*) FROM inventory WHERE film_id = ? AND store_id = ?;`
                        conn.query(query3, [film, id], (err, result) => {
                            conn.end()
                            console.log(result)
                            if (err) {
                                console.log(err)
                                return callback(err, null)
                            }
                            else {
                                return callback(null, result)
                            }

                        })
                    }

                })
            }
        })
    },
    getPaymentDetailByCustomer: (customer_id, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected Successfully')
                //query to get the infomation 
                var query = `SELECT f.title,f.film_id FROM film f, inventory i, rental r, payment p WHERE  p.rental_id = r.rental_id AND r.inventory_id = i.inventory_id AND i.film_id = f.film_id AND p.customer_id = ? AND r.return_date IS NOT NULL ORDER BY p.payment_id  `
                conn.query(query, [customer_id], (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        return callback(null, result)
                    }
                })
            }
        })
    },
    deleteCart: (film_id, customer_id, callback) => {
        var conn = db.getConnection()
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(err, null)
            }
            else {
                console.log('Connected Successfully')
                //query to get the infomation 
                var query = `DELETE FROM cart WHERE customer_id = ? AND film_id = ?;SELECT * FROM cart,film  WHERE customer_id = ? AND film.film_id = cart.film_id`
                conn.query(query, [customer_id, film_id, customer_id], (err, result) => {
                    conn.end()
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        console.log('result delete', result)
                        return callback(null, result)
                    }
                })
            }
        })
    },
    addPayment: (customer_id, staff_id, film_id, date, callback) => {
        const conn = db.getConnection();
        conn.connect((err) => {
            if (err) {
                console.log(err)
                return callback(['Internet server error', 500], null)
            }
            else {
                let query = 'SELECT * FROM film WHERE film_id = ?'
                conn.query(query, [film_id], (err, result) => {
                    if (err) {
                        console.log(err)
                        return callback(err, null)
                    }
                    else {
                        let amount = result[0]['rental_rate']
                        console.log(amount)
                        let query2 = `SELECT  * FROM rental, inventory WHERE  rental.return_date IS NOT NULL AND  inventory.inventory_id = rental.inventory_id AND inventory.store_id = ? AND inventory.film_id = ? ORDER BY RAND() LIMIT 1`
                        conn.query(query2, [ staff_id,film_id], (err, result1) => {
                            if (err) {
                                console.log(err)
                                return callback(err, null)
                            }
                            else {
                                console.log(result1)
                                let inventory_id = result1[0]['inventory_id']
                                //Insert the new infomation to payment table
                                const query2 = 'INSERT into payment (customer_id, staff_id, rental_id,amount,payment_date) values (?,?,NULL,?,?)'
                                conn.query(query2, [customer_id, staff_id, amount, date], (err, result) => {
                                    //If payment is successful, then proceed to add into rental table
                                    const query3 = 'INSERT INTO rental (rental_date, inventory_id,customer_id,return_date,staff_id) values (?,?,?,NULL,?) '
                                    conn.query(query3, [date, inventory_id, customer_id, staff_id], (err, rental) => {
                                        if (err) {
                                            console.log(err)
                                            return callback(['Internet server error', 500], null)

                                        }
                                        else {
                                            //As rental id is added update the original rental table
                                            const query4 = 'UPDATE payment set rental_id = ? WHERE payment_id = ?'
                                            const rental_id = rental.insertId
                                            conn.query(query4, [rental_id, result.insertId], (err) => {
                                                conn.end()
                                                if (err) {
                                                    console.log(err)
                                                    return callback(['Internet server error', 500], null)

                                                }
                                                console.log(result)
                                                //Return the inserted payment id
                                                return callback(null, result.insertId)
                                            })
                                        }
                                        return
                                    })

                                })
                            }
                        })
                    }
                })

            }
        })

    },
}
module.exports = dvd