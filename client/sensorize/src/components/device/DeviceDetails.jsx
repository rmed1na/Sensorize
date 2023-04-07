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
    Text,
    Icon,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Heading,
    useToast,
    Slider,
    SliderMark,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Switch
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
    const [groups, setGroups] = useState([]);
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

    const handleMeasureTypeChange = (e) => setDevice({ ...device, measureTypeCode: e.value });
    const handleTopicChange = (e) => setDevice({ ...device, topic: e.target.value });
    const handleChannelChange = (e) => setDevice({ ...device, channel: e.target.value });
    const handleNameChange = (e) => setDevice({ ...device, name: e.target.value });
    const handleHasAlertChange = (e) => {
        if (!device?.measureTypeCode) {
            toast({
                title: 'Missing device type',
                description: 'Please select a device type so that alert properties can be properly choosen',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        setDevice({ ...device, hasAlert: e.target.checked })
    };
    const handleAlertLevel = (e, bound) => {
        switch (bound) {
            case 'min':
                setDevice({ ...device, alertMinLevel: e });
                break;
            case 'max':
                setDevice({ ...device, alertMaxLevel: e });
                break;
            default:
                break;
        }
    }
    const handleMeasurePropChange = (code, value) => {
        let exists = false;
        let updatedProps = device?.measureProperties?.map(p => {
            if (p.code == code) {
                exists = true;
                return { ...p, value: value };
            }
            return p;
        });

        if (!exists) {
            updatedProps.push({ code: code, value: value });
        }

        setDevice({ ...device, measureProperties: updatedProps });
    }
    const handleAlertGroupChange = (e) => setDevice({ ...device, notificationGroupId: e.value });

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

    async function loadGroups() {
        const groups = await api.resources.notification.group.getAll();
        setGroups(groups);
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

        loadGroups();
    }, []);

    const safePropertyValue = (code) => {
        if (!device || !device.measureProperties || device.measureProperties.length == 0)
            return '';

        let prop = device.measureProperties.find(x => x.code == code);
        if (prop) {
            return prop.value;
        }

        return '';
    };

    const measureTypeDetails = () => {
        let component;
        switch (device?.measureTypeCode) {
            case 1: // Volume
                component = (
                    <Flex>
                        <FormControl py={2} pr={2} isRequired>
                            <FormLabel>Capacidad máxima (litros)</FormLabel>
                            <Input type="number" value={safePropertyValue('VOL.MAXCAP')} onChange={e => handleMeasurePropChange('VOL.MAXCAP', e.target.value)} />
                        </FormControl>
                        <FormControl py={2} pr={2} isRequired>
                            <FormLabel>Valor mínimo de lectura</FormLabel>
                            <Input type="number" value={safePropertyValue('VOL.MINVALUE')} onChange={e => handleMeasurePropChange('VOL.MINVALUE', e.target.value)} />
                        </FormControl>
                        <FormControl py={2} isRequired>
                            <FormLabel>Valor máximo de lectura</FormLabel>
                            <Input type="number" value={safePropertyValue('VOL.MAXVALUE')} onChange={e => handleMeasurePropChange('VOL.MAXVALUE', e.target.value)} />
                        </FormControl>
                    </Flex>);
                break;
            case 2: // Temperature
                break;
            default: // Empty
                break;
        }

        return component;
    }

    const alertTypeDetails = () => {
        let component;
        switch (device?.measureTypeCode) {
            case 1: // Volume
                let groupsOptions = groups.map(g => {
                    return {
                        value: g.id,
                        label: g.name
                    }
                });

                component = (
                    <>
                        <FormControl py={2}>
                            <FormLabel>Nivel de alerta: {device?.alertMinLevel ?? '0'}%</FormLabel>
                            <Slider
                                defaultValue={device?.alertMinLevel ?? 0}
                                min={0}
                                max={100}
                                step={1}
                                onChange={e => handleAlertLevel(e, 'min')}>
                                <SliderMark mt={1} ml='-2.5' value={10}>10%</SliderMark>
                                <SliderMark mt={1} ml='-2.5' value={25}>25%</SliderMark>
                                <SliderMark mt={1} ml='-2.5' value={50}>50%</SliderMark>
                                <SliderMark mt={1} ml='-2.5' value={75}>75%</SliderMark>
                                <SliderMark></SliderMark>
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        </FormControl>
                        <FormControl py={2}>
                            <FormLabel>Grupo</FormLabel>
                            <ChakraSelect
                                menuPosition="fixed"
                                placeholder="Seleccione un grupo"
                                colorScheme="brand"
                                options={groupsOptions}
                                onChange={e => handleAlertGroupChange(e)}
                                value={groupsOptions.find(g => g.value == device.notificationGroupId)} />
                        </FormControl>
                    </>);
                break;
            case 2: // Temperature
                break;
            default:
                break;
        }

        return component;
    }

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
                        <FormControl py={2} isRequired>
                            <FormLabel>Nombre</FormLabel>
                            <Input
                                placeholder="Nombre del dispositivo (tanque, planta, etc.)"
                                type="text"
                                onChange={e => handleNameChange(e)}
                                value={device?.name ?? ''} />
                        </FormControl>
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
                        <FormControl py={2}>
                            <FormLabel>Tópico</FormLabel>
                            <Input
                                placeholder="Tópico de comunicación en MQTT"
                                type="text"
                                onChange={e => handleTopicChange(e)}
                                value={device ? device?.topic : ''} />
                        </FormControl>
                        <FormControl py={2}>
                            <FormLabel>Canal</FormLabel>
                            <Input
                                placeholder="Canal para lectura del dato"
                                type="text"
                                onChange={e => handleChannelChange(e)}
                                value={device ? device?.channel : ''} />
                        </FormControl>
                    </AccordionPanel>
                </AccordionItem>

                {/* Measure type */}
                <AccordionItem>
                    <AccordionButton>
                        <Flex justify="space-between" w="full">
                            <Heading as="h4" fontWeight={500}>Medición</Heading>
                            <AccordionIcon />
                        </Flex>
                    </AccordionButton>
                    <AccordionPanel>
                        <FormControl py={2} isRequired>
                            <FormLabel>Tipo de medida</FormLabel>
                            <ChakraSelect
                                menuPosition="fixed"
                                name="measureType"
                                options={measureOptions}
                                placeholder="Selecccione un tipo de medida"
                                components={customComponents}
                                onChange={e => handleMeasureTypeChange(e)}
                                colorScheme="brand"
                                value={measureOptions.find(m => m.value == device?.measureTypeCode)} />
                        </FormControl>
                        {measureTypeDetails()}
                    </AccordionPanel>
                </AccordionItem>

                {/* Alert */}
                <AccordionItem>
                    <AccordionButton>
                        <Flex justify="space-between" w="full">
                            <Heading as="h4" fontWeight={500}>Alerta</Heading>
                            <AccordionIcon />
                        </Flex>
                    </AccordionButton>
                    <AccordionPanel>
                        <FormControl py={2} display='flex'>
                            <FormLabel>Tiene alerta?</FormLabel>
                            <Switch onChange={e => handleHasAlertChange(e)} isChecked={device?.hasAlert} />
                        </FormControl>
                        {device?.hasAlert && alertTypeDetails()}
                    </AccordionPanel>
                </AccordionItem>

            </Accordion>
            <Flex gap={2} justify="flex-end" my={5}>
                <Button size="sm" onClick={upsert}>Guardar</Button>
            </Flex>
        </Box>
    )
}