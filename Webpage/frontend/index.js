const express = require("express");
const app = express();
const serveStatic=require('serve-static');


app.get("/", (req, res) => {
    res.sendFile("/templates/index.html", { root: __dirname });
});
app.get("/login/", (req, res) => {
    res.sendFile("/templates/login.html", { root: __dirname });
});
app.get("/teacher/", (req, res) => {
    res.sendFile("/templates/admin.html", { root: __dirname });
});
app.get("/student", (req, res) => {
    res.sendFile("/templates/student.html", { root: __dirname });
});
app.get("/result", (req, res) => {
    res.sendFile("/templates/result.html", { root: __dirname });
});
app.get("/details/:id", (req, res) => {
    res.sendFile("/templates/details.html", { root: __dirname });
});
app.get("/actor/:id", (req, res) => {
    res.sendFile("/templates/actor.html", { root: __dirname });
});
app.get("/admin/addcustomer/", (req, res) => {
    res.sendFile("/templates/addcustomer.html", { root: __dirname });
});
app.get("/admin/addactor/", (req, res) => {
    res.sendFile("/templates/addactor.html", { root: __dirname });
});
app.get("/customer/main/", (req, res) => {
    res.sendFile("/templates/customer.html", { root: __dirname });
});
app.get("/carts", (req, res) => {
    res.sendFile("/templates/cart.html", { root: __dirname });
});
app.get("/payment", (req, res) => {
    res.sendFile("/templates/payment.html", { root: __dirname });
});
app.get("/face", (req, res) => {
    res.sendFile("/templates/add.html", { root: __dirname });
});
app.get("/predict", (req, res) => {
    res.sendFile("/templates/index(1).html", { root: __dirname });
});

app.use(serveStatic(__dirname+"/templates"));
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Client server has started listening on port ${PORT}`);
});
