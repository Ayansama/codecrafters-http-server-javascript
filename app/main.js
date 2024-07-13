const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
 const server = net.createServer((socket) => {
  socket.on("data",(data)=>{
    const path=data.toString();
    console.log(path);
    if(path.startsWith('GET /')){
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    }
    else{
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
    socket.end();
   })
  
   
 });
 

 server.listen(4221, "localhost",()=>{
  ProcessingInstruction.stdout.write("Listening on localhost:4221");
 });
