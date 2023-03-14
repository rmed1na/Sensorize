const API_BASE_URL = 'https://localhost:7168/api';

async function getDevices() {
    const response = await fetch(`${API_BASE_URL}/device`)
    
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throwError(response);
    }
}

async function createDevice(device, successCallback = null, errorCallback = null) {
    const response = await fetch(`${API_BASE_URL}/device`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: device.name,
            topic: device.topic,
            measureTypeCode: device.measureTypeCode,
            measureProperties: device.measureProperties,
            channel: device.channel
        })
    });

    if (response.ok) {
        const data = await response.json();

        if (successCallback != null) {
            successCallback();
        }
        
        return data;
    } else {
        let message = await response.text();
        if (errorCallback != null) {
            errorCallback(message);
        }

        throwError(response);
    }
}

async function updateDevice(device, callBack = null) {
    const response = await fetch(`${API_BASE_URL}/device/${device.deviceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: device.name,
            topic: device.topic,
            channel: device.channel,
            measureTypeCode: device.measureTypeCode,
            measureProperties: device.measureProperties
        })
    });

    if (response.ok) {
        const data = await response.json();

        if (callBack != null) {
            callBack();
        }

        return data;
    } else {
        throwError(response);
    }
}

function throwError(response) {
    throw new Error('Api call failed with status: ' + response.status);
}

export default {
    getDevices,
    createDevice,
    updateDevice
}