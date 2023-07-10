const api = import.meta.env.VITE_API_BASE_URL;
const resources = {
    sensor: {
        getAll: async function () {
            const response = await fetch(`${api}/sensor`)

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throwError(response);
            }
        },
        create: async function (sensor, successCallback = null, errorCallback = null) {
            const response = await fetch(`${api}/sensor`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: sensor.name,
                    topic: sensor.topic,
                    measureTypeCode: sensor.measureTypeCode,
                    measureProperties: sensor.measureProperties,
                    channel: sensor.channel,
                    hasAlert: sensor.hasAlert,
                    alertMinLevel: sensor.alertMinLevel,
                    alertMaxLevel: sensor.alertMaxLevel,
                    alertOn: sensor.alertOn,
                    notificationGroupId: sensor.notificationGroupId,
                    stateNotificationFrequency: sensor.stateNotificationFrequency
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
        },
        update: async function (sensor, callBack = null) {
            const response = await fetch(`${api}/sensor/${sensor.sensorId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: sensor.name,
                    topic: sensor.topic,
                    channel: sensor.channel,
                    measureTypeCode: sensor.measureTypeCode,
                    measureProperties: sensor.measureProperties,
                    hasAlert: sensor.hasAlert,
                    alertMinLevel: sensor.alertMinLevel,
                    alertMaxLevel: sensor.alertMaxLevel,
                    alertOn: sensor.alertOn,
                    notificationGroupId: sensor.notificationGroupId,
                    stateNotificationFrequency: sensor.stateNotificationFrequency
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

// Sensors
async function getSensors() {
    const response = await fetch(`${api}/sensor`)

    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throwError(response);
    }
}

function getStatusEventSource() {
    return new EventSource(`${api}/sensor/states`);
}

function throwError(response) {
    throw new Error('Api call failed with status: ' + response.status);
}

export default {
    getSensors,
    getStatusEventSource,
    resources
}