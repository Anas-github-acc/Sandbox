import { Database } from "@db/sqlite"
import { toKebabCase } from "@std/text"



const db = new Database('denosqlite.db');

Deno.serve( async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;
  const id = path.split("/")[2];

  if(path.startsWith('/setSqlite') && id == 'XANAS955'){
    db.exec(`
      DROP TABLE IF EXISTS users;
      CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT,
        avatar TEXT
      );`
    );
    return new Response("SQLITE SETUPED", {status : 200})
  }

  if(path.startsWith('/setSqlite') && id != 'XANAS955'){
    return new Response("NO ACCESS ASK ADMIN FOR SECRET KEY", {status: 403});
  }


  if(!path.startsWith('/user')) {
    return new Response("NOT FOUND", {status: 404});
  }

  if(req.method == 'GET' && !id) {
    const users = db.prepare("SELECT * FROM users").all();
    return new Response(JSON.stringify(users) , {
      headers: {  "Content-Type" : "application/json"},
      status: users.length ? 200 : 404,
    }); 
  }

  if(req.method == 'GET' && id) {
    const user = db.prepare(`SELECT * FROM users WHERE id=${id};`).all();
    return new Response(JSON.stringify(user) , {
      headers: {  "Content-Type" : "application/json"},
      status: user.length ? 200 : 404,
    }); 
  }

  if(req.method == 'POST') {
    console.log("some request: ", req);
    try {
      const { name, email, password } = await req.json();
      const avatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${toKebabCase(name)}`;

      const user = db.prepare(`INSERT INTO users (name, email, password, avatar) VALUES (? , ?, ?, ?) RETURNING *`).get([name, email, password, avatar]);

      return new Response(JSON.stringify(user), {
        headers: { "content-Type": "application/json"},
      })
    } catch(e) {
      console.log("Error: ", e);
    }
  }

  return new Response("", {status: 500})
})