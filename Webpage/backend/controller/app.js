//Name: Goh Rui ZHuo
//Admission Number:2222329
//Class: DAAA/FT/1B/05
//required modules
const express = require('express');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const app = express();
const dvd = require('../model/dvd');
const login = require('../model/login')
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
app.use(bodyParser.json())
app.use(urlencodedParser)
var verifyToken = require('../auth/verifyLogin');
const cors = require("cors");
app.use(cors());

//Login for admins
app.post("/admin/login/", (req, res) => {
    console.log(req.body)
    login.verifyAct(
        req.body.email,
        req.body.password,
        (error, data) => {
            console.log(data)
            if (error) {
                res.status(500).send();
                return;
            }
            if (data === null) {
                res.status(401).send();
                return;
            }
            const payload = { staff_id: data.staff_id, store_id: data.store_id };
            console.log(payload)
            jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
                if (error) {
                    console.log(error);
                    res.status(401).send();
                    return;
                }
                console.log('here', token)
                res.status(200).send({
                    token: token,
                    staff_id: payload.staff_id,
                    store_id: payload.store_id

                });
                return
            })
        });
});
app.post("/customer/login/", (req, res) => {
    console.log(req.body)
    login.verifyCust(
        req.body.email,
        req.body.password,
        (error, data) => {
            console.log(data)
            if (error) {
                res.status(500).send();
                return;
            }
            if (data === null) {
                res.status(401).send();
                return;
            }
            const payload = { customer_id: data.customer_id,name:data.first_name };
            console.log(payload)
            jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
                if (error) {
                    console.log(error);
                    res.status(401).send();
                    return;
                }
                console.log('here', token)
                res.status(200).send({
                    token: token,
                    customer_id: payload.customer_id,
                    name:payload.name
                });
                return
            })
        });
});
app.get('/categories', (req, res) => {
    dvd.getCat((err, result) => {
        //info get successfully
        if (!err) {
            res.status(200).send(result)
            return
        }
        //error occuring
        else {
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })
})
app.get('/films/:film_id', (req, res) => {
    //getting the required actor id from the parameters
    const { film_id } = req.params;
    //check for input datas
    if (parseInt(film_id) != film_id) {
        res.status(500).json({ "error_msg": "Incorrect data type" })
        return
    }
    //executing 
    dvd.getSpecificFilm(film_id, (err, result) => {
        //make sure that result is null and no err
        if (result === null && !err) {
            res.status(204).send()
            return
        }
        //if no err and result no null
        else if (!err) {
            res.status(200).json(result)
            return
        }
        //error occuring
        else {
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })
})

app.get('/film_categories/:category_id/films', (req, res) => {
    const { category_id } = req.params;
    if (parseInt(category_id) != category_id) {
        res.status(500).json({ "error_msg": "Incorrect data type" })
        return
    }
    // get films by id given
    dvd.getFilmsByID(category_id, (err, result) => {
        if (!err) {
            //successfully gotten the info
            res.status(200).send(result)
            return
        }
        else {
            //error occuring
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })
})

//auto complete search
app.get('/search', (req, res) => {
    let { search, max, min } = req.query
    console.log(req.query)
    search = undefined ? null : search
    max = undefined ? null : max
    min = undefined ? null : min
    let category_id = (req.query['category_id'])
    console.log(category_id)
    if (typeof(category_id) == 'number'){
        category_id= [category_id]
    }
    else if (category_id != undefined){
        category_id.forEach(element =>
            element = parseInt(element)
        )
    }
    dvd.getFilmsByFilter(search, category_id, min, max,12, (err, result) => {
        if (!err) {
            //successfully gotten the info
            res.status(200).send(result)
            return
        }
        else {
            //error occuring
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })

});
//auto complete search
app.get('/search/sort', (req, res) => {
    let { search, max, min } = req.query
    search = undefined ? null : search
    max = undefined ? null : max
    min = undefined ? null : min
    let category_id = (req.query['category_id '])
    console.log(category_id)
    if (typeof(category_id) == 'number'){
        category_id= [category_id]
    }
    else{
        category_id.forEach(element =>
            element = parseInt(element)
        )
    }
    console.log(search,max,min)

    dvd.getFilmsByFilter(search, category_id, min, max,12, (err, result) => {
        if (!err) {
            //successfully gotten the info
            res.status(200).send(result)
            return
        }
        else {
            //error occuring
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })

});
app.post('/actors', verifyToken, (req, res) => {
    const { first_name, last_name } = req.body
    // check undefined
    if ((first_name) === undefined || (last_name) === undefined) {
        res.status(400).json({ "error_msg": "missing data" })
        return
    }
    //Make sure that names are all stored in caps
    dvd.addActors(first_name.toUpperCase(), last_name.toUpperCase(), (err, result) => {
        //If update succesfully
        if (!err) {
            res.status(201).json({ "actor_id": result.insertId })
            return
        }
        //error occuring
        else {
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })
})
app.post('/customer', verifyToken, (req, res) => {
    console.log('here', req.body)
    let { store_id, first_name, last_name, email, address,password } = req.body
    //upper case for email before @
    let position = email.indexOf('@')
    email = email.slice(0, position).toUpperCase() + email.slice(position)
    //add customers

    dvd.addCustomer(store_id, first_name.toUpperCase(), last_name.toUpperCase(), email, address, password,(err, result) => {
        if (!err) { 
            res.status(201).json({ "customer_id": result })
            return
        }
        //if duplicate email
        else if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ "error_msg": "email already exist" })
            return
        }
        else {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
    })
})

app.get('/latestFilms', (req, res) => {
    dvd.getLatestFilms((err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            res.status(200).send(result)
            return
        }
    })
})

app.get('/trendFilms', (req, res) => {
    dvd.getMostPopular((err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            res.status(200).send(result)
            return
        }
    })
})

app.get('/maxPrice', (req, res) => {
    dvd.getMaxPrice((err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            res.status(200).send(result)
            return
        }
    })
})



app.get('/actors/:actor_id', (req, res) => {
    //getting the required actor id from the parameters
    const { actor_id } = req.params;
    //check for input datas
    if (parseInt(actor_id) != actor_id) {
        res.status(500).json({ "error_msg": "Incorrect data type" })
        return
    }
    //executing 
    dvd.getSpecificActor(actor_id, (err, result) => {
        //make sure that result is null and no err
        if (result === null && !err) {
            res.status(204).send()
            return
        }
        //if no err and result no null
        else if (!err) {
            res.status(200).json(result)
            return
        }
        //error occuring
        else {
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })
})

app.get('/getStore', (req, res) => {
    dvd.getStore((err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            res.status(200).send(result)
            return
        }
    })
})

app.get('/getCity', (req, res) => {
    dvd.getCity((err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            res.status(200).send(result)
            return
        }
    })
})

app.get('/actors', (req, res) => {
    dvd.getAllActor((err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            res.status(200).send(result)
            return
        }
    })
})
app.put('/actors/:actor_id', (req, res) => {
    const { first_name, last_name } = req.body
    const { actor_id } = req.params
    //Undefined and other checks
    if (first_name === '' && last_name === '') {
        res.status(400).send({ "error_msg": "missing data" })
        return
    }
    if (parseInt(actor_id) != actor_id) {
        res.status(500).json({ "error_msg": "Incorrect data type" })
        return
    }
    //Update actors info
    dvd.updateActorInfo(first_name, last_name, actor_id, (err, result) => {
        if (!err) {
            //If actor id not found
            if (result.affectedRows == 0) {
                res.status(204).send()
                return
            }
            //If info updated
            res.status(200).json({ "success_msg": "record updated" })
            return
        }
        else {
            //error occuring
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })
})


//Endpoint 5
app.delete('/actors/:actor_id', (req, res) => {
    const { actor_id } = req.params;
    if (parseInt(actor_id) != actor_id) {
        res.status(500).json({ "error_msg": "Incorrect data type" })
        return
    }
    dvd.deleteActor(parseInt(actor_id), parseInt(actor_id), (err, result) => {
        if (!err) {
            //If actor id not found
            if (result[1].affectedRows == 0) {
                res.status(204).send()
                return
            }
            //Deleted successfully
            res.status(200).json({ "success_msg": "actor deleted" })
            return
        }
        else {
            //error occuring
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })
})

app.post('/reviews', (req, res) => {
    const { customer_id , film_id,rating} = req.query;
    let {text} = req.body
    console.log(text)
    console.log(customer_id,film_id)
    dvd.review(customer_id,film_id,text,rating, (err, result) => {
        if (!err) {
            res.status(200).json({ "success_msg": "reviews added" })
            return
        }
        else {
            //error occuring
            console.log(err)
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })
})


app.get('/customer/:customer_id/payment', (req, res) => {
    const { customer_id } = req.params;
    dvd.getPaymentDetailByCustomer(customer_id, (err, result) => {
        if (!err) {
            res.json(result)
        }
        else {
            //error occuring
            res.status(500).json({ "error_msg": "Internal server error" })
            return
        }
    })
})


app.get('/review/:film_id', (req, res) => {
    const {film_id} = req.params
    console.log(film_id)
    dvd.getReview(film_id,(err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            console.log(result)
            res.status(200).send(result)
            return
        }
    })
})
app.delete('/cart', (req, res) => {
    const {film_id,customer_id} = req.query
    console.log(film_id,customer_id)
    dvd.deleteCart(film_id,customer_id,(err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            res.status(200).send(result)
            return
        }
    })
})
app.get('/carts', (req, res) => {
    const {customer_id} = req.query
    console.log(customer_id)
    dvd.getCart(customer_id,(err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            res.status(200).send(result)
            return
        }
    })
})

app.get('/cartsQuant', (req, res) => {
    const {film_id} = req.query
    const {store_id} = req.query
    console.log('here',store_id)
    dvd.getQuantity(film_id,store_id,(err, result) => {
        if (err) {
            res.status(500).json({ "error_nsg": "Internal server error" })
            return
        }
        else {
            res.status(200).send(result)
            return
        }
    })
})

//Additional endpoint 1
app.post('/payment', (req, res) => {
    const { customer_id,staff_id,film_id } = req.query
    const start_date = new Date()
    //check for undefined and incorrect data type
    dvd.addPayment(parseInt(customer_id), parseInt(staff_id), film_id,start_date, (err, result) => {
        if (!err) {
            //successfully added
            res.status(201).json({ "payment_id": result })
            return
        }
        else if (err) {
            //error occuring
            res.status(err[1]).json({ "error_msg": err[0] })
            return
        }
    })
})

module.exports = app
