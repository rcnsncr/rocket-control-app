var net = require('net');

var rL = [];
var launchedList = [];

var setRL = (data) => {
    rL = data;
}

var getRL = () => {
    return rL;
}

var setData = async (data) => {
    console.log("-->setTeleData");
    for (var n=0; n<rL.length; n+=1) {
        if (rL[n].id === data.id) {
            rL[n].altitude = data.altitude
            rL[n].speed = data.speed;
            rL[n].acceleration = data.acceleration;
            rL[n].thrust = data.thrust;
            rL[n].temperature = data.temperature;
            break;
        }
    }
}

var startListenSocket = async (rocketList) => {
    console.log("-->startListenSocket");
    setRL(rocketList);
    for (var n=0; n<rocketList.length; n+=1) {
        if (rocketList[n].status === 'launched') {
            if (!launchedList.includes(rocketList[n].id)) {
                launchedList.push(rocketList[n].id);
            }
        } else {
            if (launchedList.includes(rocketList[n].id)) {
                var index = launchedList.indexOf(rocketList[n].id);
                launchedList.splice(index, 1);
            }
        }
        if (launchedList.includes(rocketList[n].id)) {
            await listenSocket(rocketList[n].id, rocketList[n].telemetry.host, rocketList[n].telemetry.port);
        }
    }
    return getRL();
}

var listenSocket = (id, host, port) => {
    
    var client = new net.Socket();
    client.connect(port, host , function() {
        console.log('Connected id: '+id);
        //client.write('Hello, server! Love, Client.');
    });

    client.on('data', function(data) {
        const bufferArray = new Uint8Array(data);
        setData(solveData(bufferArray));
        client.destroy(); // kill client after server's response
    });

    /*
    client.on('close', function() {
        console.log('Connection closed');
    });
    */

}

var solveData = (bufferArray) => {
    var id = '';
    var altitude = '';
    var speed = '';
    var acceleration = '';
    var thrust = '';
    var temperature = '';
    for (let i = 0; i < bufferArray.length; ++i) {
        var hex = bufferArray[i].toString(16);
        var value = hex_to_ascii(hex);
        var number = parseInt(hex,16);
        var numberStr = number+'';
        //id 0x01-0x0A
        if (i >= parseInt("0x01", 16) && i <= parseInt("0x0A", 16)) {
            id += value;
        }
        //Altitude 0x0D-0x10
        if (i >= parseInt("0x0D", 16) && i <= parseInt("0x10", 16)) {
            //altitude += number;
            altitude += numberStr;
        }
        //Speed 0x11-0x14
        if (i >= parseInt("0x11", 16) && i <= parseInt("0x14", 16)) {
            //speed += number;
            speed += numberStr;
        }
        //Acceleration 0x15-0x18
        if (i >= parseInt("0x15", 16) && i <= parseInt("0x18", 16)) {
            //acceleration += number;
            acceleration += numberStr;
        }
        //Thrust 0x19-0x1C
        if (i >= parseInt("0x19", 16) && i <= parseInt("0x1C", 16)) {
            //thrust += number;
            thrust += numberStr;
        }
        //Temperature 0x1D-0x20
        if (i >= parseInt("0x1D", 16) && i <= parseInt("0x20", 16)) {
            //temperature += number;
            temperature += numberStr;
        }
    }
    console.log("id:"+id+" altitude:"+altitude+" speed:"+speed+" acceleration:"+acceleration+" thrust:"+thrust+" temperature:"+temperature);
    var data = {
        "id": id,
        "altitude": altitude,
        "speed": speed,
        "acceleration": acceleration,
        "thrust": thrust,
        "temperature": temperature
    };
    return data;
}

var hex_to_ascii = (hex) => {
	var value = '';
	for (var n = 0; n < hex.length; n += 2) {
		value += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return value;
 }

 module.exports = {
    startListenSocket
};
