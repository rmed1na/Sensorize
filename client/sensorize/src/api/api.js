const api = import.meta.env.VITE_API_BASE_URL;
const resources = {
    device: {
        getAll: async function () {
            const response = await fetch(`${api}/device`)

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throwError(response);
            }
        },
        update: async function (device, callBack = null) {
            const response = await fetch(`${api}/device/${device.deviceId}`, {
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
                    alertMaxLevel: device.alertMaxLevel,
                    notificationGroupId: device.notificationGroupId
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
    },
    notification: {
        group: {
            create: async function (group, successCallback = null, errorCallback = null) {
                const response = await fetch(`${api}/notification/group`, {
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
                const response = await fetch(`${api}/notification/group/${group.id}`, {
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
                const response = await fetch(`${api}/notification/group`);

                if (response.ok) {
                    const data = await response.json();
                    return data;
                } else {
                    throwError(response);
                }
            },
            delete: async function (group, successCallback = null, errorCallback = null) {
                const response = await fetch(`${api}/notification/group/${group.id}`, {
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
        },
        recipient: {
            create: async function (recipient, successCallback = null, errorCallback = null) {
                const response = await fetch(`${api}/notification/recipient`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName: recipient.firstName,
                        lastName: recipient.lastName,
                        email: recipient.email,
                        groupId: recipient.groupId
                    })
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
                const response = await fetch(`${api}/notification/recipient`);

                if (response.ok) {
                    const data = await response.json();
                    return data;
                } else {
                    throwError(response);
                }
            },
            update: async function (recipient, successCallback = null, errorCallback = null) {
                const response = await fetch(`${api}/notification/recipient/${recipient.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        firstName: recipient.firstName,
                        lastName: recipient.lastName,
                        email: recipient.email,
                        groupId: recipient.groupId
                    })
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
            delete: async function (recipient, successCallback = null, errorCallback = null) {
                const response = await fetch(`${api}/notification/recipient/${recipient.id}`, {
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
                    const message = await response.text();

                    if (errorCallback != null)
                        errorCallback(message);
                }
            }
        }
    }
}

// DEVICES
async function getDevices() {
    const response = await fetch(`${api}/device`)

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throwError(response);
    }
}

async function createDevice(device, successCallback = null, errorCallback = null) {
    const response = await fetch(`${api}/device`, {
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

function getStatusEventSource() {
    return new EventSource(`${api}/device/states`);
}

function throwError(response) {
    throw new Error('Api call failed with status: ' + response.status);
}

export default {
    getDevices,
    getStatusEventSource,
    createDevice,
    resources
}