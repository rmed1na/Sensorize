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
    SimpleGrid,
    TableContainer,
    Table,
    Thead,
    Tr,
    Td,
    Th,
    Tbody,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Card,
    CardBody,
    CardHeader
} from "@chakra-ui/react";
// Icons
import { BiChip } from 'react-icons/bi';
import { CgDanger } from 'react-icons/cg';
import { MdOutlineSync } from 'react-icons/md';
// CC
import SensorStateCard from '../sensor/SensorStateCard';
import api from '../../api/api';
import dateUtil from '../../utils/dateUtil';

export default function Dashboard() {
    const [lastUpdateDate, setLastUpdateDate] = useState('-');
    const [sensors, setSensors] = useState([]);
    const [sensorStates, setSensorStates] = useState([]);
    const sensorStatesRef = useRef(sensorStates);

    async function loadSensors() {
        const sensors = await api.getSensors();
        setSensors(sensors);
    }

    useEffect(() => {
        loadSensors();

        const eventSource = api.getStatusEventSource();
        
        eventSource.onmessage = (e) => {
            let data = {
                ...JSON.parse(e.data),
                lastUpdate: new Date().toLocaleDateString()
            };
            
            let updatedSensorStates = sensorStatesRef.current
                .filter(x => x.sensor.sensorId !== data.sensor.sensorId)
                .concat(data);

            sensorStatesRef.current = updatedSensorStates;
            setSensorStates(updatedSensorStates);
        }

        return () => {
            eventSource.close();
        }
    }, []);

    useEffect(() => {
        let date = new Date();
        setLastUpdateDate(dateUtil.toReadableString(date));
    }, [sensorStates]);

    return (
        <>
            <Box mx={10} mt={5}>
                <Flex justify="space-around" color="blackAlpha.700">
                    <Flex gap={2} align="center">
                        <Icon as={BiChip} boxSize={8} />
                        <Box>
                            <Heading>{sensors?.length}</Heading>
                            <Text>Sensores</Text>
                        </Box>
                    </Flex>
                    <Box w="1px" bg="brand.100" mx="2" />
                    <Flex gap={2} align="center">
                        <Icon as={CgDanger} boxSize={8} />
                        <Box>
                            <Heading>{sensorStates?.filter(ds => ds.isOnAlert == true).length}</Heading>
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
                    {sensors && sensors.map(d => {
                        let status = sensorStates.find(s => s.sensor.sensorId == d.sensorId);
                        return <SensorStateCard 
                                    key={d.sensorId} 
                                    name={d.name}
                                    lastUpdate={status?.timeSpanDescription}
                                    isOnAlert={status?.isOnAlert}
                                    stateDescription={status?.description} />
                    })}
                </SimpleGrid>

                {/* <Card bg='blackAlpha.50'>
                    <CardHeader pb={0} pt={4} px={4}>
                        <Text fontSize='0.875rem' fontWeight={600}>Device name</Text>
                    </CardHeader>
                    <CardBody px={4} pt={2} pb={2}>
                        <Accordion allowMultiple>
                            <AccordionItem borderColor='blackAlpha.100' border='none'>
                                <AccordionButton>
                                    <Text flex='1' textAlign='left' fontSize='0.875rem'>Sensor 1</Text>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>Lorem ipsum</AccordionPanel>
                            </AccordionItem>
                            <AccordionItem borderColor='blackAlpha.100' border='none'>
                                <AccordionButton>
                                    <Text flex='1' textAlign='left' fontSize='0.875rem'>Sensor 2</Text>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel>Lorem ipsum</AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </CardBody>
                </Card> */}
            </Box>
        </>
    )
}