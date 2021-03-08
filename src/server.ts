import net from 'net';

import { Canvas } from './canvas';
import { handleCommand } from './utils';

const server = net.createServer();

server.on('connection', (socket) => {
    console.log('Client connected');

    socket.setEncoding('utf8');
    socket.write('hello\r\n');

    const canvas = new Canvas();

    socket.on('data', (data: string) => {
        console.log('Data received: >>', data);

        if (!socket.writable) {
            return;
        }
        const commands = data.split(/\r\n\s{0,2}/g).filter(Boolean);
        for (const command of commands) {
            try {
                if (command === 'quit') {
                    socket.end();
                    return;
                }

                const output = handleCommand(command, canvas);
                if (output) {
                    socket.write(output)
                    console.log(output)
                };

            } catch (err) {
                console.error(err);
                
            }
        }
    });

    socket.on('drain', () => {
        console.log('drain occured');
        socket.resume();
    });

    socket.on('error', (error) => {
        console.log('Error: >>' + error);
    });

    socket.on('timeout', () => {
        console.log('Socket timed out.');
        socket.end('timeout');
    });

    socket.on('end', () => {
        console.log('Socket ended from client');
    });

    socket.on('close', (error) => {
        if (error) {
            console.log(`Socket closed ${error ? 'with error' : ''}`);
            return;
        }
        console.log('Socket closed');
    }); 

});

server.on('listening',function(){
  console.log('Server is listening');
});

server.on('error',function(error){
  console.log('Error: >>' + error);
});

server.on('close',function(){
    console.log('Server closed');
});

server.maxConnections = 10;

server.listen(8124);