/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

const express = require('express')
const path = require('path')
const { get } = require('request')
var http = require('http');

const app = express()
var server = http.createServer(app);

// Local web server port http://localhost:9081
var port = 8080;


server.listen(port);
console.log('::: Node.js server - Listening on port ' + port + ' :::');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const viewsDir = path.join(__dirname)
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.static(path.join(__dirname, '/weights')))
app.use(express.static(path.join(__dirname, '/dist')))

app.get('/', (req, res) => res.redirect('/code_image'))
app.get('/code_image', (req, res) => res.sendFile(path.join(viewsDir, '/public/page1.html')))

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}
