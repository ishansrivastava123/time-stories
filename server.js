const http = require('http');
const cheerio = require('cheerio');
const axios = require('axios');
const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/getTimeStories') {
        axios.get('https://time.com/')
            .then((response) => {
                const html = response.data;
                const $ = cheerio.load(html);
                const list = [];

                $('.latest-stories li').each(function () {
                    const title = $(this).find('.latest-stories__item a h3').text().trim();
                    const url = $(this).find('.latest-stories__item a').attr('href');
                    list.push({ title, url: `https://time.com${url}` });
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(list));
            })
            .catch((error) => {
                console.error('Error fetching data:', error.message);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});