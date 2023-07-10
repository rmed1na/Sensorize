// React
import { useEffect, useState } from "react";
// Chakra
import {
    Accordion,
    Box,
    Button,
    Flex,
    Text,
    useToast,
} from "@chakra-ui/react";
// CC
import api from '../../../api/api';
import dateUtil from '../../../utils/dateUtil';
import GeneralSection from "./sections/General";
import MessageBrokerSection from "./sections/MessageBroker";
import MeasureTypeSection from './sections/MeasureType';
import AlertSection from './sections/Alert';
import NotificationsSection from './sections/Notifications';

export default function SensorDetails({
    sensor,
    setSensor,
    onDataSave
}) {
    const toast = useToast();
    const [notificationGroups, setNotificationGroups] = useState([]);

    async function loadGroups() {
        const groups = await api.resources.notification.group.getAll();
        setNotificationGroups(groups);
    }

    async function upsert() {
        // New sensor
        if (!sensor || !sensor.sensorId || sensor.sensorId == 0) {
            let response = await api.resources.sensor.create(
                sensor,
                function () {
                    toast({
                        title: 'Sensor guardado',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                        position: 'top'
                    });

                    onDataSave();
                },
                function (errorMessage = '') {
                    toast({
                        title: 'Error',
                        status: 'error',
                        description: errorMessage,
                        duration: 5000,
                        isClosable: true,
                        position: 'top'
                    })
                });

            setSensor(response);
        }

        // Update sensor
        if (sensor && sensor.sensorId > 0) {
            let response = await api.resources.sensor.update(sensor, function () {
                toast({
                    title: 'Sensor actualizado',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });

                onDataSave();
            });

            setSensor(response);
        }
    }

    useEffect(() => {
        // Default values
        if (!sensor) {
            setSensor({
                name: '',
                topic: '',
                channel: '',
                measureProperties: []
            });
        }

        loadGroups();
    }, []);

    return (
        <Box fontSize="0.875rem" fontWeight={500}>
            <Flex direction="column" gap={4} mb={5}>
                <Flex>
                    <Text w="12rem" color="blackAlpha.700">Id:</Text>
                    <Text>{sensor?.sensorId}</Text>
                </Flex>
                <Flex>
                    <Text w="12rem" color="blackAlpha.700">Creación:</Text>
                    <Text>{sensor?.createdDate ? dateUtil.toReadableString(sensor.createdDate) : null}</Text>
                </Flex>
                <Flex>
                    <Text w="12rem" color="blackAlpha.700">Última actualización:</Text>
                    <Text>{sensor?.updatedDate ? dateUtil.toReadableString(sensor.updatedDate) : null}</Text>
                </Flex>
            </Flex>
            <Accordion allowToggle defaultIndex={[0]} position="relative">
                <GeneralSection sensor={sensor} setSensor={setSensor} />
                <MessageBrokerSection sensor={sensor} setSensor={setSensor} />
                <MeasureTypeSection sensor={sensor} setSensor={setSensor} />
                <NotificationsSection sensor={sensor} setSensor={setSensor} notificationGroups={notificationGroups} />
                <AlertSection sensor={sensor} setSensor={setSensor} />
            </Accordion>
            <Flex gap={2} justify="flex-end" my={5}>
                <Button size="sm" onClick={upsert}>Guardar</Button>
            </Flex>
        </Box>
    )
}