const express = require('express')
const app = express()
const port = 3000
import Fetcher from 'a-fetch'

console.log(Fetcher)

app.listen(port, () => console.log(`Example app listening on port http://localhost${port}!`))
