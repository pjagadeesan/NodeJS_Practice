const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write(`
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>My node js form</title>
            </head>
            <body>
                <form action='/message' method='POST'>
                    <input type ='text' name='message'></input>
                    <button type='submit' >Send</button>
                </form>
            </body>
        </html>`);
    return res.end();
  }else if(url === '/message' && method === 'POST'){
    const body = [];
    let message;
      req.on('data', chunk => {
          body.push(chunk);
      });
      req.on('end', ()=>{
          const parsedBody = Buffer.concat(body).toString();
          message = parsedBody.split('=')[1];
          fs.writeFileSync('message.txt', message);
      }); 
    res.statusCode =302;
    res.setHeader('Location', '/');  
    return res.end();
  }
  res.write(`
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>My node js course</title>
            </head>
            <body>
                <h1>Hello fron node.js course</h1>
            </body>
        </html>`);
  res.end();
});

server.listen(3000);
