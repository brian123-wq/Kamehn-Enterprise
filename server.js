const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
 host:"localhost",
 user:"root",
 password:"",
 database:"telux_db"
});

db.connect(err=>{
 if(err) throw err;
 console.log("MySQL Connected Successfully");
});

