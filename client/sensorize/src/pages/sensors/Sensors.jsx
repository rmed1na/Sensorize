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
import SensorDetails from "../../components/sensor/details/SensorDetails";
import SensorListItem from "../../components/sensor/SensorListItem";
import Navbar from "../../components/Navbar";
import SideBar from "../../components/sidebar/SideBar";
import api from "../../api/api";

export default function Sensors() {
    const emptySensor = {
        name: '',
        topic: '',
        channel: '',
        measureProperties: []
    }
    const [sensors, setSensors] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState();

    async function getSensors() {
        const sensors = await api.getSensors();
        setSensors(sensors);
    }

    useEffect(() => {
        getSensors();
    }, []);

    const onSensorDataChange = () => getSensors();
    const onSensorItemClick = (sensor) => {
        setSensors(sensors.map((d) => {
            let isSelected = d.sensorId == sensor.sensorId;
            return {...d, isSelected: isSelected};
        }));
        setSelectedSensor(sensor);
    };

    return (
        <Box>
            <Flex h="100vh">
                <SideBar />
                <Flex flexGrow={1} direction="column">
                    <Navbar title="Sensores"/>
                    <Flex direction="row" mx={10} mt={5} gap={4}>
                        <Box w="40%">
                            <Heading as="h3" color="brand.500" p={1}>{sensors.length} sensores</Heading>
                            <Divider mb={3} />

                            <Box maxH={750} sx={{ overflowY: 'auto', cursor: 'pointer' }}>
                                <SensorListItem 
                                    isNewPlaceholder={true} 
                                    sensor={emptySensor} 
                                    onClick={() => onSensorItemClick(emptySensor)} />

                                {sensors && sensors.map(s => {
                                    return <SensorListItem
                                                isSelected={s.isSelected} 
                                                key={s.sensorId} 
                                                sensor={s} 
                                                onClick={() => onSensorItemClick(s)} />
                                })}
                            </Box>
                        </Box>
                        <Box w="60%">
                            <Heading as="h3" color="brand.500" p={1}>Detalles del sensor { selectedSensor ? `${selectedSensor.name}` : '' }</Heading>
                            <Divider />
                            <Box m={5}>
                                <SensorDetails 
                                    onDataSave={onSensorDataChange}
                                    sensor={selectedSensor}
                                    setSensor={setSelectedSensor} />
                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}