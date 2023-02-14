const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const localizify = require('localizify');
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const invoiceGenerator = require('./components/invoiceGenerator');
//-------------------------------> END OF IMPORTS <-------------------------------

dotenv.config();
const PORT = process.env.APP_PORT || 3000;
const app = express();
const swaggerJSDocs = YAML.load('./api.yaml');

// get exac ip in production server (becaus we use reverse proxy)
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Streaming logs to file
const logStream = fs.createWriteStream(
    path.join(path.join(__dirname, 'logs'), 'requests.log'),
    { flags: 'a' }
);

app.use(
    morgan('dev', {
      stream: logStream,
    })
);

// Middleware
app.use(cors({
  origin: '*'
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', express.static('public'));

// Setup Localization
app.use((request, response, next) => {
    const lang =
      localizify.default.detectLocale(request.headers['accept-language']) || 'fa';
    localizify.default.setLocale(lang);
    response.t = localizify.t;
    next();
});

// Routes
app.use('/', require('./routers/index'));
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {},
    });
});

const server = http.createServer(app);


const timer = 10 * 60 * 1000;
  // const myInterval = setInterval(invoiceGenerator, timer);
  

server.listen(PORT, () => {
  console.log('Server started listening on : ', server.address());
  if (!process.env.SERVER_ADDR)
    process.env.SERVER_ADDR = server.address().address;
    if (!process.env.APP_PORT)
    process.env.APP_PORT = server.address().port.toString();
  });