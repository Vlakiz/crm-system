const app = require('./app')
const keys = require('./config/keys')
const port = process.env.PORT || keys.port

app.listen(5000, () => console.log(`Server has been started on ${port}`))