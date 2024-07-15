const net = require("net");
const fs = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
 const server = net.createServer((socket) => {
  socket.on("data",(data)=>{
    let arr=data.toString().split('\r\n');
    console.log(`arr:${arr}`)
    const url=arr[0].split(' ')[1];
    console.log(`url:${url}`)
  

    if(url == '/'){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    else if(url.includes('/echo/')){
      const content=url.split('/echo/')[1];
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${content.length}\r\n\r\n${content}`);
    }
    else if(url=="/user-agent"){
      const userAgent=arr[2].split('User-Agent: ')[1];
      console.log(`userAgent:${userAgent}`)
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
    }
    else if(url.startsWith('/files')){
      const fileName=url.split('/files')[1];
      const directory=process.argv[3];
      if (fs.existsSync(`${directory}/${fileName}`)){
        const content=fs.readFileSync(`${directory}/${fileName}`).toString();
        console.log(`content:${content}`);
        const res = `HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${content.length}\r\n\r\n${content}\r\n`;
        socket.write(res);
      }
      else{socket.write("HTTP/1.1 404 Not Found\r\n\r\n")};
    }
    else if(arr.startsWith('POST')){
      const content=arr[6].toString();
      const directory=process.argv[3];
      const filename=url;
      fs.writeFileSync(`${directory}/${filename}`,`${content}`,'utf8');
      socket.write(`HTTP/1.1 201 Created\r\n\r\n`);

    }
    else{
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
   })
  
   socket.on("close", () => {
     socket.end();
   });
   
 });
 

 server.listen(4221, "localhost");
