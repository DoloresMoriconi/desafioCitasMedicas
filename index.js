const express = require('express')
const axios = require('axios')
const { v4: uuid } = require('uuid')
const moment = require('moment')
const _ = require('lodash')
const chalk = require('chalk')

const app = express()

const users = []

app.listen(3000, () => console.log("El servidor está inicializado en el puerto 3000"))

app.get("/crear", (req, res) => {
   console.log("Ruta crear")
   axios.get('https://randomuser.me/api/?results=11')
   .then(({data}) => {
      const usersAPI = data.results;

      // Procesar los usuarios de la API
      usersAPI.forEach(userAPI => {
         const { gender, name } = userAPI;
         users.push({
            gender: gender,
            first: name.first,
            last: name.last,
            id: uuid().slice(0, 6),
            timestamp: moment().format('MMMM Do YYYY, h:mm:ss a')
         });
      });

      // Filtrar a 7 mujeres y 4 hombres
      const filteredUsers = _.filter(users, user => user.gender === 'female' || user.gender === 'male');
      const limitedUsers = _.take(filteredUsers, 11);

      // Ordenar y agrupar los usuarios por género
      const sortedUsers = _.sortBy(limitedUsers, ['gender', 'first']);
      const groupedUsers = _.groupBy(sortedUsers, 'gender');

      // Construir la respuesta en el formato deseado
      let response = '';

      // Agregar usuarios femeninos
      response += '<h2>Mujeres:</h2><ol>';
      groupedUsers['female'].forEach((user, index) => {
         response += `<li>Nombre: ${user.first} - Apellido: ${user.last} - ID: ${user.id} - Timestamp: ${user.timestamp}</li>`;
      });
      response += '</ol>';

      // Agregar espacio entre Mujeres y Hombres
      response += '<br>';

      // Agregar usuarios masculinos
      response += '<h2>Hombres:</h2><ol>';
      groupedUsers['male'].forEach((user, index) => {
         response += `<li>Nombre: ${user.first} - Apellido: ${user.last} - ID: ${user.id} - Timestamp: ${user.timestamp}</li>`;
      });
      response += '</ol>';

      // Enviar la respuesta al cliente
      res.send(response);

      // Imprimir la lista de mujeres y hombres por la consola del servidor
      console.log(chalk.bgWhite.blue('Mujeres:'));
      groupedUsers['female'].forEach(user => {
         console.log(chalk.bgWhite.blue(`Nombre: ${user.first} - Apellido: ${user.last} - ID: ${user.id} - Timestamp: ${user.timestamp}`));
      });

      console.log(chalk.bgWhite.blue('\nHombres:'));
      groupedUsers['male'].forEach(user => {
         console.log(chalk.bgWhite.blue(`Nombre: ${user.first} - Apellido: ${user.last} - ID: ${user.id} - Timestamp: ${user.timestamp}`));
      });
   })
});
