require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false })) // Middle ware for POST request

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

let urls = [], lastID = 0;
const isValidURL = (url) => {
  return /http:+/.test(url)
}
app.post('/api/shorturl', (req, res) => {
  // console.log(req.body)
  let postedURL = req.body.url;
  console.log('\n\nThe URL:', postedURL);
  if (!isValidURL(postedURL)) {
    console.log('It is inValid');
    res.json({ error: 'invalid url' })
  }
  else {
    console.log("it is valid")
    let data;
    // Checking if URL already visited.
    if (urls.find(ele => ele.original_url == postedURL)) {
      data = urls.find(ele => ele.original_url == postedURL);
    }
    else {
      data = {
        original_url: postedURL,
        short_url: lastID,
      }
      urls.push(data)
      lastID++;
    }

    res.json(data)
  }
})
app.get('/api/shorturl/:id', (req, res) => {
  let urlObj = urls.find(ele => ele.short_url == req.params.id);
  if (urlObj) {
    res.redirect(urlObj.original_url);
  }
  else {
    res.json({ 'error': `URL corresponding to ID: ${req.params.id} dosen't Exist` })
  }
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
  console.log(`http://localhost:${port}`);
});
