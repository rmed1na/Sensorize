// React
import { useState, useEffect, useRef } from 'react';

// Chakra
import { 
    Box, 
    Flex } from '@chakra-ui/react';

// CC
import SideBar from '../../components/sidebar/SideBar';
import Dashboard from '../../components/dashboard/Dashboard';
import Navbar from '../../components/Navbar'

export default function Home() {
    //const baseApiUrl = 'https://localhost:7168/api';
    const [devices, setDevices] = useState([]);
    //const [deviceTypes, setDeviceTypes] = useState([]);
    //const [statuses, setStatuses] = useState([]);
    //const statusesRef = useRef([]);
    //const [lastUpdateDate, setLastUpdateDate] = useState('');
    const [filterStatus, setFilterStatus] = useState(0);
    const [filterType, setFilterType] = useState(0);
    //const [appSection, setAppSection] = useState();

    // const deviceTypeEnum = {
    //     1: 'Puerta',
    //     2: 'A/C'
    // };

    // const alertsNumber = function () {
    //     return statuses
    //         .filter(status => status.isOnAlert === true)
    //         .length;
    // }

    // useEffect(() => {
    //     const loadDevices = async function () {
    //         await fetch(`${baseApiUrl}/device/all`)
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 setDevices(data.map(device => {
    //                     return { ...device, isVisible: true }
    //                 }));
    //             })
    //             .catch((error) => console.error(error));
    //     }

    //     loadDevices();
    //     if (1==1)
    //         return;

    //     const eventSource = new EventSource(`${baseApiUrl}/device/stream/statuses`);
    //     eventSource.onmessage = (e) => {
    //         let newStatus = JSON.parse(e.data);
    //         let now = new Date();
    //         let index = statusesRef.current.findIndex(x => x.deviceId == newStatus.deviceId);

    //         newStatus.lastUpdate = now.toLocaleTimeString();

    //         if (index !== -1) {
    //             statusesRef.current[index] = newStatus;
    //         } else {
    //             statusesRef.current.push(newStatus);
    //         }

    //         setStatuses(statusesRef.current);
    //         setLastUpdateDate(`${now.toLocaleString()}`);
    //     };

    //     return () => {
    //         eventSource.close();
    //     }
    // }, []);

    // useEffect(() => {
    //     let deviceTypeCodes = [...new Set(devices.map(device => device.type))];
    //     let deviceTypes = deviceTypeCodes.map(dt => {
    //         let amount = devices.filter(d => d.type === dt).length;
    //         let isPlural = amount > 1;
    //         return {
    //             code: dt,
    //             name: `${deviceTypeEnum[dt]}${isPlural ? 's' : null}`,
    //             amount: amount
    //         }
    //     });

    //     setDeviceTypes(deviceTypes);
    // }, [devices]);

    const handleStatusChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const handleTypeChange = (e) => {
        setFilterType(e.target.value);

        let _devices;
        if (e.target.value !== 0) {
            _devices = devices.map(device => {
                if (device.type == e.target.value) {
                    device.isVisible = true;
                } else {
                    device.isVisible = false;
                }
                return device;
            });
        } else {
            _devices = devices.map(device => {
                device.isVisible = true;
                return device;
            });
        }

        setDevices(_devices);
    };

    return (
        <Box>
            <Flex h="100vh">
                <SideBar />
                <Flex flexGrow="1" direction="column">
                    <Navbar />
                    <Dashboard title="Dashboard" />
                </Flex>
            </Flex>
        </Box>
    );
}