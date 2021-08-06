const port = 3000
import express from 'express'
import Fetcher, {Request} from 'a-fetch'

const app = express()

Fetcher.doSomething()
Request.doSomething()

app.listen(port, () => console.log(`Example app listening on port http://localhost${port}!`))
