// React
import { useEffect, useState } from "react";
// Chakra
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Text,
    Icon,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Heading,
    useToast
} from "@chakra-ui/react";
// Chakra select
import { Select as ChakraSelect, chakraComponents } from 'chakra-react-select';
// Icons
import {
    MdScience,
    MdDeviceThermostat
} from 'react-icons/md';
// CC
import api from '../../api/api';
import dateUtil from '../../utils/dateUtil';

export default function DeviceDetails({
    device,
    setDevice,
    onDataSave
}) {
    const toast = useToast();
    let measureOptions = [
        {
            value: 1,
            label: "Volumen",
            icon: <Icon as={MdScience} mr={2} color="brand.600" />
        },
        {
            value: 2,
            label: "Temperatura",
            icon: <Icon as={MdDeviceThermostat} mr={2} color="brand.600" />
        }
    ];

    const customComponents = {
        Option: ({ children, ...props }) => (
            <chakraComponents.Option {...props}>
                {props.data.icon} {children}
            </chakraComponents.Option>
        ),
    };

    const handleMeasureChange = (e) => setDevice({ ...device, measureCode: e.value });
    const handleChannelChange = (e) => setDevice({ ...device, channel: e.target.value});
    const handleNameChange = (e) => setDevice({...device, name: e.target.value});

    async function save() {
        // New device
        if (!device || !device.deviceId || device.deviceId == 0) {
            let response = await api.createDevice(device, function() {
                toast({
                    title: 'Dispositivo guardado',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });
    
                onDataSave();
            });
    
            setDevice(response);
        }

        // Update device
        if (device && device.deviceId > 0) {
            let response = await api.updateDevice(device, function() {
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
        if (!device) {
            setDevice({
                name: '',
                channel: ''
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

                {/* General */}
                <AccordionItem>
                    <AccordionButton>
                        <Flex justify="space-between" w="full">
                            <Heading as="h4" fontWeight={500}>General</Heading>
                            <AccordionIcon />
                        </Flex>
                    </AccordionButton>
                    <AccordionPanel>
                        <Stack>
                            <FormControl py={2} isRequired>
                                <FormLabel>Nombre</FormLabel>
                                <Input
                                    placeholder="Nombre del dispositivo (tanque, planta, etc.)"
                                    type="text"
                                    onChange={e => handleNameChange(e)}
                                    value={device ? device.name : ''} />
                            </FormControl>
                            <FormControl py={2} isRequired>
                                <FormLabel>Medida</FormLabel>
                                <ChakraSelect
                                    menuPosition="fixed"
                                    name="measureType"
                                    options={measureOptions}
                                    placeholder="Selecccione un tipo de medida"
                                    components={customComponents}
                                    onChange={e => handleMeasureChange(e)}
                                    colorScheme="brand"
                                    value={measureOptions.find(m => m.value == device?.measureTypeCode)}
                                    ></ChakraSelect>
                            </FormControl>
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
                
                {/* MQTT */}
                <AccordionItem>
                    <AccordionButton>
                        <Flex justify="space-between" w="full">
                            <Heading as="h4" fontWeight={500}>MQTT</Heading>
                            <AccordionIcon />
                        </Flex>
                    </AccordionButton>
                    <AccordionPanel>
                        <Stack>
                            <FormControl py={2}>
                                <FormLabel>Canal</FormLabel>
                                <Input 
                                    placeholder="Canal de comunicación de datos en MQTT"
                                    type="text"
                                    onChange={e => handleChannelChange(e)}
                                    value={device ? device.channel : ''} />
                            </FormControl>
                        </Stack>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
            <Flex gap={2} justify="flex-end" my={5}>
                <Button size="sm" onClick={save}>Guardar</Button>
            </Flex>
        </Box>
    )
}