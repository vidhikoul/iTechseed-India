import express from "express"
import mysql from "mysql"
const app=express()
const port=8800;
const db=mysql.createConnection({
    host:"iTechSeed-DanaOCR",
    // host:"10.0.0.2",
    user:"root",
    password:"root",
    database:"danadb",
    port:3306,
});
app.get("/",(req,res)=>
{
    res.json("hii connected to db")
})
app.get("/challans",(req,res)=>
{
    const q="SELECT * FROM Challans"
    db.query(q,(err,data)=>{
        if(err) return res.json(err)
        return res.json(data);
    })

})
app.listen(8800,()=>
{
    console.log("connected to backend!");

})