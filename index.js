const express = require("express");
const fs = require("fs");
const app = express();
const users = require("./MOCK_DATA.json");

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running: ${PORT}`);
});


// MIDDLE WARES
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("Hello from middleWare1");
  req.myUserName = "Aqsa Imran Software Developer";
  next();
});
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `${Date.now()}:${req.ip} ${req.method}: ${req.path}\n`,
    (err, data) => {
      next();
    }
  );
});
// app.use((req,res,next)=>{
//   console.log(`Hello from middleWare 2 ${req.myUserName}`);
//   // return res.json({status:"Pending"});
//   next();
// })


app
  .route("/api/users")
  .get((req, res) => {
    console.log(`I'm in get route ${req.myUserName}`);
    return res.json(users);
  })
  //   POST DATA INTO AN API BY POST REQUEST
  .post((req, res) => {
    const body = req.body;
    console.log(body);
    users.push({ ...body, id: users.length + 1 });
    // WRITE DATA ONTO FILE BY CONVERTING OBJ INTO STRING
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({ status: "success", id: users.length });
    });
  });

// GET BY ID 
//  ROUTE FOR MULTI TASKING LIKE GET,POST,PATCH(EDIT),DELETE
app
  .route("/api/users/:id")
  .get((req, res) => {
    console.log(`I'm in get route ${req.myUserName}`);
    const id = Number(req.params.id);
    const userData = users.find((user) => user.id === id);
    return res.json(userData);
  })
  .patch((req, res) => {
    const id=Number(req.params.id);
    let userData=users.find((user)=> user.id===id);
    
if(userData)
   {
    userData={...userData,city:"Lahore",district:"Punjab"};
    userData.email="aqsaimran341@gmail.com";
    return res.send({status:"success"});
   }
   else return res.status(404).send({status:"failed",id:userData.id})
    // console.log(userData)
  
  })
  .delete((req, res) => {
    const id=Number(req.params.id);
    let initialLength=users.length;
    let userData=users.filter((user)=>user.id!=id);

    for(let i=1;i<userData.length;i++)
      userData.at(i-1).id=i;
  
    if(userData.length<initialLength){
   
      fs.writeFile("./MOCK_DATA.json",JSON.stringify(userData),(err,data)=>{
        return res.send({status:"succecss"})
      })
    }
    
    else return res.status(404).send({status:"failed"})
   

  });


app.get("/users", (req, res) => {
  const html = `
      <ul>
      ${users
        .map((user) => {
          return `<li>${user.first_name}</li>`;
        })
        .join("")}
      </ul>
      `;
  return res.send(html);
});

app.patch((req, res) => {
  const id=Number(req.params.id);
  let userData=users.find((user)=>{user.id===id});
if(userData)
 {
  userData.email="aqsaimran341@gmail.com";
  return res.send({status:"success"});
 }
 else return res.status(404).send({status:"failed",id:userData.id})


})
