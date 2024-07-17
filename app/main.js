const net = require("net");
const fs = require("fs");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
const args = {};
process.argv.forEach((arg, index) => {
  if (arg.startsWith("--")) {
    args[arg.replace(/^--/, "")] = process.argv[index + 1];
  }
});
1;
const FILES_DIR = args["directory"];

// Uncomment this to pass the first stage
 const server = net.createServer((socket) => {
  socket.on("data",(data)=>{
    console.log(`data: ${data}`)
    let arr=data.toString().split('\r\n');
    console.log(`arr:${arr}`)
    const url=arr[0].split(' ')[1];
    console.log(`url:${url}`)
  

    if(url == '/'){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    else if(url.includes('/echo/')){
      const content=url.substring(6);
      const contentLength=content.length;
      let encoding='';
      for (const line of arr){
        if (line.startsWith('Accept-Encoding: ')){
          encoding=line.substring(17);
          break;
        }
      }
      if (encoding.includes("gzip")){
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Encoding:gzip\r\n\r\n`);
      }
      else{socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\n`);}    
      
    }
    else if(url=="/user-agent"){
      const userAgent=arr[2].split('User-Agent: ')[1];
      console.log(`userAgent:${userAgent}`)
      socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${userAgent.length}\r\n\r\n${userAgent}`);
    }
    else if(url.includes("/files/")&&
    data.toString().split(' ')[0]==="POST"){
      let fileName=url.split('/')[2];
      console.log(`filename:${fileName}`);
      let filePath = FILES_DIR+fileName;
      const file = data.toString("utf-8").split("\r\n\r\n")[1];
      console.log(`file: ${file}`);
      fs.writeFileSync(filePath,file);
      socket.write(`HTTP/1.1 201 Created\r\n\r\n`);
  
    }
    else if(url.includes("/files/")){
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
    
    
    else{
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
   
   })
  
  
   socket.on("close", () => {
     socket.end();
   });
   
 });
 

 server.listen(4221, "localhost");
