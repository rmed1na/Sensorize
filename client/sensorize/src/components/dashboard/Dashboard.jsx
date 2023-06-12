// React
import { useState, useEffect, useRef } from 'react';
// Chakra
import { 
    Box, 
    Flex,
    Icon,
    Heading,
    Text,
    Divider,
    SimpleGrid
} from "@chakra-ui/react";
// Icons
import { BiChip } from 'react-icons/bi';
import { CgDanger } from 'react-icons/cg';
import { MdOutlineSync } from 'react-icons/md';
// CC
import DeviceStateCard from '../device/DeviceStateCard';
import api from '../../api/api';
import dateUtil from '../../utils/dateUtil';

export default function Dashboard() {
    const [lastUpdateDate, setLastUpdateDate] = useState('-');
    const [devices, setDevices] = useState([]);
    const [deviceStates, setDeviceStates] = useState([]);
    const deviceStatesRef = useRef(deviceStates);

    async function loadDevices() {
        const devices = await api.getDevices();
        setDevices(devices);
    }

    useEffect(() => {
        loadDevices();

        const eventSource = api.getStatusEventSource();
        
        eventSource.onmessage = (e) => {
            let data = {
                ...JSON.parse(e.data),
                lastUpdate: new Date().toLocaleDateString()
            };
            
            let updatedDeviceStates = deviceStatesRef.current
                .filter(x => x.device.deviceId !== data.device.deviceId)
                .concat(data);

            deviceStatesRef.current = updatedDeviceStates;
            setDeviceStates(updatedDeviceStates);
        }

        return () => {
            eventSource.close();
        }
    }, []);

    useEffect(() => {
        let date = new Date();
        setLastUpdateDate(dateUtil.toReadableString(date));
    }, [deviceStates]);

    return (
        <>
            <Box mx={10} mt={5}>
                <Flex justify="space-around" color="blackAlpha.700">
                    <Flex gap={2} align="center">
                        <Icon as={BiChip} boxSize={8} />
                        <Box>
                            <Heading>{devices?.length}</Heading>
                            <Text>Dispositivos</Text>
                        </Box>
                    </Flex>
                    <Box w="1px" bg="brand.100" mx="2" />
                    <Flex gap={2} align="center">
                        <Icon as={CgDanger} boxSize={8} />
                        <Box>
                            <Heading>{deviceStates?.filter(ds => ds.isOnAlert == true).length}</Heading>
                            <Text>Alertas</Text>
                        </Box>
                    </Flex>
                    <Box w="1px" bg="brand.100" mx="2" />
                    <Flex gap={2} align="center">
                        <Icon as={MdOutlineSync} boxSize={8} />
                        <Box>
                            <Heading as="h3">{lastUpdateDate}</Heading>
                            <Text>Última actualización</Text>
                        </Box>
                    </Flex>
                </Flex>

                <Divider my={5} borderColor="brand.100" />

                <SimpleGrid columns={5} spacing={2}>
                    {devices && devices.map(d => {
                        let status = deviceStates.find(s => s.device.deviceId == d.deviceId);
                        return <DeviceStateCard 
                                    key={d.deviceId} 
                                    name={d.name}
                                    lastUpdate={status?.timeSpanDescription}
                                    isOnAlert={status?.isOnAlert}
                                    stateDescription={status?.description} />
                    })}
                </SimpleGrid>
            </Box>
        </>
    )
}