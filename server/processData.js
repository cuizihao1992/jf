const fs = require('fs');
const path = require('path');
const { clients, statusList } = require('./global.js');

const pendingRequests = new Map();

function processData(socket, data, wsCallback) {
  const hexData = data.toString('hex');
  const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
  const localPort = socket.localPort;
  console.log(`${localPort}: Data received from ${clientInfo}:`, hexData);
  if (hexData.length >= 4) {
    const idHex = hexData.substring(2, 4); // 第二个字节的十六进制值
    const addrID = parseInt(idHex, 16); // 转换为十进制整数
    console.log(`Extracted ID: ${addrID}`);

    wsCallback({
      deviceId: addrID,
      angle: 45,
      gps: '30.6586, 104.0648',
      power: 12.5,
      isOnline: true,
      imageUrl: '/images/66_image.jpg',
      timestamp: new Date().toLocaleString(),
    });
    if (hexData == '68420f16') {
      console.log('心跳from', addrID);
    }
    processBuffer(data, addrID).then((res) => {
      console.log(res);
    });
    statusList[addrID] = {
      addrID,
      clientInfo,
      socket,
      data: hexData,
      lastUpdated: new Date(),
    };

    const clientRequests = pendingRequests.get(addrID) || {};
    const request = clientRequests[addrID];

    if (request) {
      const { command, resolve } = request;
      // await saveCommandResponse(clientInfo, command, data);
      resolve(hexData);
      delete clientRequests[addrID];
      pendingRequests.set(addrID, clientRequests);
    }
  } else {
    console.warn(`${localPort}: Received data is too short to extract ID`);
  }
}

async function sendTCPCommand(addrID, command) {
  return new Promise((resolve, reject) => {
    let socket;
    const clientStatus = statusList[addrID];
    if (clientStatus && clientStatus.socket) {
      socket = clientStatus.socket;
    } else {
      try {
        socket = clients.entries().next().value[1];
      } catch (e) {
        return reject(new Error('Client not connected'));
      }
    }
    const clientRequests = pendingRequests.get(addrID) || {};
    clientRequests[addrID.toString()] = {
      command: command,
      resolve,
    };
    pendingRequests.set(addrID, clientRequests);

    socket.write(command, (err) => {
      if (err) {
        delete clientRequests[addrID.toString()];
        pendingRequests.set(addrID, clientRequests);
        return reject(err);
      }
      console.log(`Command sent to ${addrID}:`, command.toString('hex'));
      // logCommand(addrID, fullCommand, null).catch(console.error);
    });
  });
}

// Global variables to mimic the Java class variables
let bufferMessage = '';
let imageBuffer = Buffer.alloc(100000); // Buffer for image data
let imgNum = 0; // Image byte index
let imgReady = false;
let taskReply = false;
let imgFalse = false;
let deviceReply = false;

// Lock for synchronized behavior (using Promises in Node.js)
const lock = { isLocked: false };

function processBuffer(data, address) {
  return new Promise((resolve) => {
    lock.isLocked = true;
    let result = '';
    let isImageData = data[2] === 0x05; // Check if it's image data
    if (isImageData) {
      bufferMessage = 'Image data received... Click the image to change.';
      imgReady = true;

      // Handle image data logic here
      handleImageData(data, address);
    } else {
      let frameLen = (data[3] << 8) | data[4]; // Frame length from bytes 3 and 4
      console.log(`Frame length: ${frameLen}`);
      console.log(`Command info (data[2]): ${data[2]}`);

      if (data[frameLen + 5] === 0x16) {
        switch (data[2]) {
          case 0x00: // Reflector angle data
            result = handleAngleData(data, address);
            break;
          case 0x01: // GPS data
            result = handleGPSData(data, address);
            break;
          case 0x02: // Power module data
            result = handlePowerData(data, address);
            break;
          case 0x03: // Historical data
            result = handleHistoricalData(data, address);
            break;
          case 0x04: // Log data
            result = handleLogData(data, address, frameLen);
            break;
          case 0x06: // Task execution status or abnormal info
            result = handleTaskStatus(data, address);
            break;
          case 0x7f: // Instruction execution error
            result = handleErrorResponse(data, address);
            break;
          case 0x8f: // Time synchronization success
            bufferMessage = `${address} Device time synchronized successfully.`;
            console.log(bufferMessage);
            result = bufferMessage;
            break;
          default:
            console.log('Unknown command received:', data[2]);
        }
      }
    }

    console.log('Processing complete --->', bufferMessage);
    lock.isLocked = false;
    resolve(result);
  });
}

// Handlers for specific commands
function handleImageData(data, address) {
  let frameLen = (data[3] << 8) | data[4];
  let frameNum = data[7] & 0x7f; // Frame number

  console.log(`Received image frame ${frameNum} of length ${frameLen}`);
  imageBuffer.set(data.slice(8, 8 + frameLen), imgNum);
  imgNum += frameLen;

  if (data[7] & 0x80) {
    // Last frame of the image
    let targetPath = path.join(__dirname, `images/${address}_image.jpg`);
    fs.writeFileSync(targetPath, imageBuffer.slice(0, imgNum));
    console.log(`Image saved at: ${targetPath}`);
    imgNum = 0;
    imgReady = true;
    imageBuffer.fill(0); // Reset buffer
  }
  return imageBuffer;
}

function handleAngleData(data, address) {
  let spj = data.readUInt16BE(5); // Horizontal angle
  let yj = data.readUInt16BE(7); // Vertical angle

  bufferMessage = `${address} Reflector angles: Horizontal: ${spj}, Vertical: ${yj}`;
  console.log(bufferMessage);
  return bufferMessage;
}

function handleGPSData(data, address) {
  let timeBytes = data.slice(5, 13);
  let lonBytes = data.slice(13, 17);
  let latBytes = data.slice(17, 21);

  let time = bytesToTimeString(timeBytes);
  let lon = bytesToFloat(lonBytes);
  let lat = bytesToFloat(latBytes);

  bufferMessage = `GPS Time: ${time}, Longitude: ${lon}, Latitude: ${lat}`;
  console.log(bufferMessage);
  return bufferMessage;
}

function handlePowerData(data, address) {
  let powerVol = data[5] / 10.0;
  let provideVol = data[6] / 10.0;
  let current = data[7] / 10.0;
  let power = data[8] / 10.0;
  let percentage = ((data[9] << 8) | data[10]) / 100.0;

  bufferMessage = `Power Data: Battery Voltage: ${powerVol}V, Supply Voltage: ${provideVol}V, Current: ${current}A, Power: ${power}W, Battery Remaining: ${percentage}%`;
  console.log(bufferMessage);
  return bufferMessage;
}

function handleHistoricalData(data, address) {
  console.log('Received historical data');
  // Handle the parsing and logging logic for historical data
}

function handleLogData(data, address, frameLen) {
  let logs = data.slice(5, 5 + frameLen).toString('utf8');
  bufferMessage = `Log Data: ${logs}`;
  console.log(bufferMessage);
  return bufferMessage;
}

function handleTaskStatus(data, address) {
  console.log('Task execution status or abnormal info received.');
  // Handle task status updates based on `data[6]`
}

function handleErrorResponse(data, address) {
  console.log('Error response received for command:', data[5]);
  // Handle error response logic based on `data[5]`
}

// Utility functions
function bytesToTimeString(bytes) {
  let year = bytes[0] + 2000;
  let month = bytes[1];
  let day = bytes[2];
  let hour = bytes[3];
  let minute = bytes[4];
  let second = bytes[5];

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

function bytesToFloat(bytes) {
  let buffer = Buffer.from(bytes);
  return buffer.readFloatBE(0);
}

// Exporting for testing
module.exports = {
  processData,
  processBuffer,
  handleImageData,
  handleGPSData,
  handlePowerData,
  handleLogData,
  sendTCPCommand,
};
