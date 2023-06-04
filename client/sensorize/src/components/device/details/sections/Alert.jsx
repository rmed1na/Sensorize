import { useState, useEffect } from 'react';
import { 
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Flex,
    Heading,
    FormControl,
    FormLabel,
    Switch,
    Radio,
    RadioGroup,
    Stack,
    Slider,
    SliderMark,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb
} from "@chakra-ui/react"
import { Select as ChakraSelect, chakraComponents } from 'chakra-react-select';
import api from '../../../../api/api';

export default function Alert({
    device,
    setDevice
}) {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        loadGroups();
    }, []);

    async function loadGroups() {
        const groups = await api.resources.notification.group.getAll();
        setGroups(groups);
    }

    const handleAlertGroupChange = (e) => setDevice({ ...device, notificationGroupId: e.value });
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
            case 'on':
                setDevice({ ...device, alertOn: e });
                break;
            default:
                break;
        }
    }

    const alertTypeDetails = () => {
        let component;
        let groupsOptions = groups.map(g => {
            return {
                value: g.id,
                label: g.name
            }
        });
        
        switch (device?.measureTypeCode) {
            case 1: // Volume
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
            case 3: // Binary
                component = (<>
                    <RadioGroup onChange={e => handleAlertLevel(e, 'on')} value={device?.alertOn}>
                        <Stack direction='column'>
                            <Radio size='sm' value="true">Cuando el valor es cierto</Radio>
                            <Radio size='sm' value="false">Cuando el valor es falso</Radio>
                        </Stack>
                    </RadioGroup>
                    <FormControl py={2}>
                        <FormLabel>Grupo</FormLabel>
                        <ChakraSelect
                            menuPosition='fixed'
                            placeholder='Seleccione un grupo'
                            colorScheme='brand'
                            options={groupsOptions}
                            onChange={e => handleAlertGroupChange(e)}
                            value={groupsOptions.find(g => g.value == device.notificationGroupId)} />
                    </FormControl>
                </>);
                break;
            default:
                break;
        }

        return component;
    }

    return (
        <>
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
        </>
    )
}