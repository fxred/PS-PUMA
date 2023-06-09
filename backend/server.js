const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3000;
const { Sequelize, DataTypes } = require('sequelize');

app.use(express.json());
app.use(cors());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
  });
  
  sequelize
    .authenticate()
    .then(() => {
      console.log('Database connection established successfully.');
    })
    .catch((error) => {
      console.error('Unable to connect to the database:', error);
    });

const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  
User.sync();
  
app.use(express.json());

app.post('/users', async (req, res) => {
    const { username } = req.body;
    
  
    try {
      const response = await axios.get(`https://api.github.com/users/${username}`);
      const user = response.data;
  
      await User.create({
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
      });
  
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(404).json({ error: 'User not found' });
    }
});

app.delete('/users/:username', async (req, res) => {
  const username = req.params.username;

  User.destroy({
    where: {
      login: username,
    },
  })
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(500);
    });
  });

app.get('/users', async (req, res) => {
    try {
      const users = await User.findAll();
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});