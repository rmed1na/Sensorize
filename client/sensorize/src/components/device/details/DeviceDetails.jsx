// React
import { useEffect } from "react";
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

export default function DeviceDetails({
    device,
    setDevice,
    onDataSave
}) {
    const toast = useToast();

    async function upsert() {
        // New device
        if (!device || !device.deviceId || device.deviceId == 0) {
            let response = await api.createDevice(
                device,
                function () {
                    toast({
                        title: 'Dispositivo guardado',
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

            setDevice(response);
        }

        // Update device
        if (device && device.deviceId > 0) {
            let response = await api.resources.device.update(device, function () {
                toast({
                    title: 'Dispositivo actualizado',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });

                onDataSave();
            });

            setDevice(response);
        }
    }

    useEffect(() => {
        // Default values
        if (!device) {
            setDevice({
                name: '',
                topic: '',
                channel: '',
                measureProperties: []
            });
        }
    }, []);

    return (
        <Box fontSize="0.875rem" fontWeight={500}>
            <Flex direction="column" gap={4} mb={5}>
                <Flex>
                    <Text w="12rem" color="blackAlpha.700">Id:</Text>
                    <Text>{device?.deviceId}</Text>
                </Flex>
                <Flex>
                    <Text w="12rem" color="blackAlpha.700">Creación:</Text>
                    <Text>{device?.createdDate ? dateUtil.toReadableString(device.createdDate) : null}</Text>
                </Flex>
                <Flex>
                    <Text w="12rem" color="blackAlpha.700">Última actualización:</Text>
                    <Text>{device?.updatedDate ? dateUtil.toReadableString(device.updatedDate) : null}</Text>
                </Flex>
            </Flex>
            <Accordion allowToggle defaultIndex={[0]} position="relative">
                <GeneralSection device={device} setDevice={setDevice} />
                <MessageBrokerSection device={device} setDevice={setDevice} />
                <MeasureTypeSection device={device} setDevice={setDevice} />
                <AlertSection device={device} setDevice={setDevice} />
            </Accordion>
            <Flex gap={2} justify="flex-end" my={5}>
                <Button size="sm" onClick={upsert}>Guardar</Button>
            </Flex>
        </Box>
    )
}