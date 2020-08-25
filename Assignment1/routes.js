const fs = require("fs");

const handleRoutes = (req, res) => {
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
                <form action='/createUser' method='POST'>
                    UserName: <input type ='text' name='username'></input>
                    <button type='submit' >Submit</button>
                </form>
            </body>
        </html>`);
    return res.end();
  } else if (url === "/users") {
    res.write(`<html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>My node js form</title>
            </head>
            <body>
                <ul>
                <li> Priya</li>
                <li> Shalini</li>
                <li> Mithun</li>
                </ul>
            </body>
        </html>`);
    return res.end();
  } else if (url === "/createUser" && method === "POST") {
    const body = [];
    let username;
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parseBody = Buffer.concat(body).toString();
      username = parseBody.split("=")[1];
      console.log(username);
    });
    res.statusCode = 302;
    res.setHeader('Location','/');
    return res.end();
  }
};

module.exports = handleRoutes;
