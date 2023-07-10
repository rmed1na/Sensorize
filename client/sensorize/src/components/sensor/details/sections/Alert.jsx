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

export default function Alert({
    sensor,
    setSensor
}) {
    const handleHasAlertChange = (e) => {
        if (!sensor?.measureTypeCode) {
            toast({
                title: 'Missing sensor type',
                description: 'Please select a sensor type so that alert properties can be properly choosen',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        setSensor({ ...sensor, hasAlert: e.target.checked })
    };

    const handleAlertLevel = (e, bound) => {
        switch (bound) {
            case 'min':
                setSensor({ ...sensor, alertMinLevel: e });
                break;
            case 'max':
                setSensor({ ...sensor, alertMaxLevel: e });
                break;
            case 'on':
                setSensor({ ...sensor, alertOn: e });
                break;
            default:
                break;
        }
    }

    const alertTypeDetails = () => {
        let component;
        
        switch (sensor?.measureTypeCode) {
            case 1: // Volume
                component = (
                    <>
                        <FormControl py={2}>
                            <FormLabel>Nivel de alerta: {sensor?.alertMinLevel ?? '0'}%</FormLabel>
                            <Slider
                                defaultValue={sensor?.alertMinLevel ?? 0}
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
                    </>);
                break;
            case 2: // Temperature
                break;
            case 3: // Binary
                component = (<>
                    <RadioGroup onChange={e => handleAlertLevel(e, 'on')} value={sensor?.alertOn}>
                        <Stack direction='column'>
                            <Radio size='sm' value="true">Cuando el valor es cierto</Radio>
                            <Radio size='sm' value="false">Cuando el valor es falso</Radio>
                        </Stack>
                    </RadioGroup>
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
                            <Switch onChange={e => handleHasAlertChange(e)} isChecked={sensor?.hasAlert} />
                        </FormControl>
                        {sensor?.hasAlert && alertTypeDetails()}
                    </AccordionPanel>
                </AccordionItem>
        </>
    )
}