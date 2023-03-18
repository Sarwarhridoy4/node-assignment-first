const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 3000 || process.env.PORT;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

//all api here

//get random user

app.get('/user/random', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
      if (err) throw err;
      const users = JSON.parse(data);
      const randomIndex = Math.floor(Math.random() * users.length);
      res.send(users[randomIndex]);
    });
});
  
//api for getting all user

app.get('/user/all', (req, res) => {
    fs.readFile('./users.json', 'utf8', (err, data) => {
      if (err) throw err;
      let users = JSON.parse(data);
      if (req.query.limit && !isNaN(parseInt(req.query.limit))) {
        users = users.slice(0, parseInt(req.query.limit));
      }
      res.send(users);
    });
  });


  //save new user in database

  app.post('/user/save', (req, res) => {
    const user = req.body;
    if (!user.id || !user.gender || !user.name || !user.contact || !user.address || !user.photoUrl) {
      res.status(400).send('All fields are required');
      return;
    }
    fs.readFile('./users.json', 'utf8', (err, data) => {
      if (err) throw err;
      let users = JSON.parse(data);
      users.push(user);
      fs.writeFile('./users.json', JSON.stringify(users), (err) => {
        if (err) throw err;
        res.send(`User with id ${user.id} saved successfully`);
      });
    });
  });


  // updade specefic user with id


  app.patch('/user/update/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      res.status(400).send('Invalid user id');
      return;
    }
    const userUpdates = req.body;
    fs.readFile('./users.json', 'utf8', (err, data) => {
      if (err) throw err;
      let users = JSON.parse(data);
      let userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex === -1) {
        res.status(404).send(`User with id ${userId} not found`);
        return;
      }
      users[userIndex] = { ...users[userIndex], ...userUpdates };
      fs.writeFile('./users.json', JSON.stringify(users), (err) => {
        if (err) throw err;
        res.send(`User with id ${userId} updated successfully`);
      });
    });
  });



  // update user in bulk

  app.patch('/user/bulk-update', (req, res) => {
    const userIds = req.body;
    if (!Array.isArray(userIds) || userIds.some((id) => isNaN(parseInt(id)))) {
      res.status(400).send('Invalid user ids');
      return;
    }
    fs.readFile('./users.json', 'utf8', (err, data) => {
      if (err) throw err;
      let users = JSON.parse(data);
      users = users.map((user) => {
        if (userIds.includes(user.id.toString())) {
          return { ...user, ...req.body };
        }
        return user;
      });
      fs.writeFile('./users.json', JSON.stringify(users), (err) => {
        if (err) throw err;
        res.send('Users updated successfully');
      });
    });
  });


  // api for deteting a specific user

  app.delete('/user/delete/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
    res.status(400).send('Invalid user id');
    return;
    }
    fs.readFile('./users.json', 'utf8', (err, data) => {
    if (err) throw err;
    let users = JSON.parse(data);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
    res.status(404).send(`User with id ${userId} not found`);
    return;
    }
    users.splice(userIndex, 1);
    fs.writeFile('./users.json', JSON.stringify(users), (err) => {
    if (err) throw err;
    res.send(`User with id ${userId} deleted successfully`);
    });
    });
    });


    
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
