import { createServer } from 'http';
import url from 'url';
import axios from 'axios';
import chalk from 'chalk';
import config from './config.cjs';



const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods':'GET'
};


// ?search=php&location=gauteng  Converting to JSON
const decodeParams = searchParams => Array
.from(searchParams.keys())
.reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key)}), {});

// setting up server
const server = createServer((req, res) =>{
    const requestURL = url.parse(req.url);
    // { search" 'php', location: 'gauteng'}
    const decodedParams = decodeParams(new URLSearchParams(requestURL.search))
    const { search, location, country = 'za' } = decodedParams;



    // Constructing the target URL to send to Adzuna
    const targetURL = `${config.BASE_URL}/${country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${config.APP_ID}&app_key=${config.API_KEY}&what=${search}&where=${location}`;


    // to see if we are getting something
    if (req.method === 'GET') {
        console.log(chalk.green(`Proxy GET request to : ${targetURL}`));
        axios.get(targetURL)
        .then(response => {
            res.writeHead(200, headers);
            res.end(JSON.stringify(response.data));
        })
        .catch(error => {
            console.log(chalk.red(error));
            res.writeHead(500, headers);
            res.end(JSON.stringify(error));
        });
    }

});

server.listen(3000, () => {
    console.log(chalk.green('Server listening'));
})