const express = require('express');
require('./db/mongoose'); // al ser requerido, hace que mongoose conecte con localhost:27017
const userRoutes= require('./routers/user');
const taskRoutes = require('./routers/task');

const app = express();
const port = process.env.PORT;

app.use(express.json());//Postman -> Post -> Body -> Raw -> Json
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});