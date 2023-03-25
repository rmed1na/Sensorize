const API_BASE_URL = 'https://localhost:7168/api';

const resource = {
    notification: {
        group: {
            create: async function (group, successCallback = null, errorCallback = null) {
                const response = await fetch(`${API_BASE_URL}/notification/group`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(group.name)
                });
            
                if (response.ok) {
                    const data = await response.json();
            
                    if (successCallback != null)
                        successCallback();
            
                    return data;
                } else {
                    let message = await response.text();
                    if (errorCallback != null)
                        errorCallback(message);
                }
            },
            update: async function (group, successCallback = null, errorCallback = null) {
                const response = await fetch(`${API_BASE_URL}/notification/group/${group.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(group.name)
                });

                if (response.ok) {
                    const data = await response.json();

                    if (successCallback != null)
                        successCallback();

                    return data;
                } else {
                    let message = await response.text();
                    if (errorCallback != null)
                        errorCallback(message);
                }
            },
            getAll: async function () {
                const response = await fetch(`${API_BASE_URL}/notification/group`);

                if (response.ok) {
                    const data = await response.json();
                    return data;
                } else {
                    throwError(response);
                }
            },
            delete: async function (group, successCallback = null, errorCallback = null) {
                const response = await fetch(`${API_BASE_URL}/notification/group/${group.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (successCallback != null)
                        successCallback();

                    return data;
                } else {
                    let message = await response.text();
                    if (errorCallback != null)
                        errorCallback(message);
                }
            }
        }
    }
}

// DEVICES
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
            channel: device.channel,
            hasAlert: device.hasAlert,
            alertMinLevel: device.alertMinLevel,
            alertMaxLevel: device.alertMaxLevel
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
            measureProperties: device.measureProperties,
            hasAlert: device.hasAlert,
            alertMinLevel: device.alertMinLevel,
            alertMaxLevel: device.alertMaxLevel
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

function getStatusEventSource() {
    return new EventSource(`${API_BASE_URL}/device/states`);
}

function throwError(response) {
    throw new Error('Api call failed with status: ' + response.status);
}

export default {
    getDevices,
    getStatusEventSource,
    createDevice,
    updateDevice,
    resource
}