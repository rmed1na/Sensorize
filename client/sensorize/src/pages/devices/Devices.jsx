// Chakra
import { 
    Box, 
    Divider, 
    Flex, 
    Heading
} from "@chakra-ui/react";
// React
import { useEffect, useState } from "react";
// CC
import DeviceDetails from "../../components/device/DeviceDetails";
import DeviceListItem from "../../components/device/DeviceListItem";
import Navbar from "../../components/Navbar";
import SideBar from "../../components/sidebar/SideBar";
import api from "../../api/api";

export default function Devices() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState();

    async function getDevices() {
        const devices = await api.getDevices();
        setDevices(devices);
    }

    useEffect(() => {
        getDevices();
    }, []);

    const onDeviceDataChange = () => getDevices();
    const onDeviceItemClick = (device) => {
        setSelectedDevice(device);
    };

    return (
        <Box>
            <Flex h="100vh">
                <SideBar />
                <Flex flexGrow={1} direction="column">
                    <Navbar title="Dispositivos"/>
                    <Flex direction="row" mx={10} mt={5} gap={4}>
                        <Box w="40%">
                            <Heading as="h3" color="brand.500" p={1}>{devices.length} dispositivos</Heading>
                            <Divider mb={3} />

                            <Box maxH={750} sx={{ overflowY: 'auto', cursor: 'pointer' }}>
                                <DeviceListItem isNewPlaceholder={true} onClick={onDeviceItemClick} />
                                {devices && devices.map(d => {
                                    return <DeviceListItem key={d.deviceId} device={d} onClick={onDeviceItemClick} />
                                })}
                            </Box>
                        </Box>
                        <Box w="60%">
                            <Heading as="h3" color="brand.500" p={1}>Detalles { selectedDevice ? `del dispositivo ${selectedDevice.name}` : '' }</Heading>
                            <Divider />

                            <Box m={5}>
                                <DeviceDetails 
                                    onDataSave={onDeviceDataChange}
                                    device={selectedDevice}
                                    setDevice={setSelectedDevice} />
                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}