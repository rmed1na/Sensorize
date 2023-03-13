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

async function createDevice(device, callBack = null) {
    const response = await fetch(`${API_BASE_URL}/device`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: device.name,
            measureTypeCode: device.measureTypeCode,
            channel: device.channel
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

async function updateDevice(device, callBack = null) {
    const response = await fetch(`${API_BASE_URL}/device/${device.deviceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: device.name,
            channel: device.channel,
            measureTypeCode: device.measureTypeCode
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