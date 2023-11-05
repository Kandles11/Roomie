const net = require('net');

// const config = require('../config.json');

const PacketType =
{
    NOTHING: 0,
    PING: 1,
    PING_RESPONSE: 2,
    CLIENT_HELLO: 3,
    RESTART: 4,
    MOTION_DETECTED: 5,
    SCREEN_SET: 6,
    BATTERY_LEVEL: 7
};

class PacketParser {
    #buf;
    #handler;

    constructor(handler) {
        this.#handler = handler;
    }

    handlePacket(str) {
        const type = parseInt(str.substring(0, 2), 16);
        const contents = str.substring(3);

        this.#handler(type, contents);
    }

    handleQueue() {
        if (this.#buf === undefined || this.#buf.length < 3) {
            this.#buf = undefined;
            console.log('p2');

            return;
        }

        let str = this.#buf.toString();
        const terminator = str.indexOf(';');

        console.log('p2 ', str, terminator);

        if (terminator == -1) {
            if (str.length > 200) {
                // Invalid state, reset buf
                this.#buf = undefined;
            } else {
                // Continue waiting for rest of packet
            }

            return;
        }

        if (str.at(0) !== ':') {
            this.#buf = undefined;
            return;
        }

        str = str.substring(1, terminator);

        if (this.#buf.length > terminator) {
            this.#buf = this.#buf.slice(terminator + 1);
        } else {
            this.#buf = undefined;
        }

        this.handlePacket(str);

        if (this.#buf.indexOf(';') != -1) {
            this.handleQueue();
        }
    }

    handleData(buf /* Buffer */) {
        if (this.#buf !== undefined) {
            console.log('p1');
            this.#buf.concat(buf);
        } else {
            this.#buf = buf;
        }

        this.handleQueue();
    }
}

class SensorConnection {
    #conn; // Socket
    #parser;

    #onBindMac;

    id; 
    address; // MAC address of microcontroller

    connected;

    constructor(conn) {
        this.#conn = conn;
        this.#parser = new PacketParser(this.handlePacket.bind(this));
    }

    onConnData(data) {
        console.log('connection data from %s: %j',
            this.#conn.remoteAddress, data.toString());
        this.#parser.handleData(data);
    }
    onConnClose() {
        console.log('Lost connection to %s', this.#conn.remoteAddress);

        this.connected = false;
    }
    onConnError(err) {
        console.log('Connection error on %s: %s',
            this.#conn.remoteAddress, err);

        this.connected = false;
    }

    handlePacket(type, contents) {
        switch (type) {
        case PacketType.NOTHING: {break;}
        case PacketType.CLIENT_HELLO: {
            this.#onBindMac(contents);
            this.connected = true;
        }
        case PacketType.MOTION_DETECTED: {

        }
        }
    }

    setOnBindMac(func /* string macaddress => void */) {
        this.#onBindMac = func;
    }

    identity() {
        if (this.id !== undefined) {
            return this.id;
        } else if (this.address !== undefined) {
            return this.address;
        } else if (this.#conn !== undefined) {
            return this.#conn.remoteAddress;
        } else {
            return 'Unnamed Sensor';
        }
    }

    isActive() {
        return (this.#conn != undefined) && (this.#conn.readyState === 'open');
    }

    send(contents) {
        if (this.isActive()) {
            this.#conn.write(contents);
        } else {
            console.log('Connection to', this.identity(),
                'is inactive, failed to write', contents);
        }
    }
}

class SensorServer {
    connections = {};
    #socket;

    // Reference back to whole server
    #server;

    #sensorData = [];

    constructor(server) {
        this.#server = server;

        this.#socket = net.createServer();
        this.#socket.on('connection', this.handleConnection.bind(this));
        this.#socket.listen(3001, () => {
            console.log('TCP sensor server listening to %j',
                this.#socket.address());
        });
    }

    handleConnection(conn) {
        const remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
        console.log('new client connection from %s', remoteAddress);

        const sensorConn = new SensorConnection(conn);
        const connectionsTable = this.connections;

        sensorConn.setOnBindMac((mac) => {
            console.log('Adding sensor at', mac, 'to arr');
            connectionsTable[config['sensor'][mac]] = sensorConn;
        });

        conn.on('data', sensorConn.onConnData.bind(sensorConn));
        conn.once('close', sensorConn.onConnClose.bind(sensorConn));
        conn.on('error', sensorConn.onConnError.bind(sensorConn));
    }

    getSensor(id) {
        return this.connections[id.toString()];
    }

    getSensorData() {
        return this.#sensorData;
    }

    addSensorData(room) {
        if (this.#sensorData[0].room == room)
        {
            this.#sensorData[0].time = Date.now;
        } else {
            this.#sensorData.push({room: room, type: 3, time: Date.now})
        }
    }

    clearSensorData() {
        if (Date.now.diff(this.#sensorData[0].time) > 630000){
            this.#sensorData.splice(0, 1);
        }
    }
}

module.exports = SensorServer;
