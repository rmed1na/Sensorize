import { 
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Flex,
    Heading,
    FormControl,
    FormLabel,
    Icon,
    Input
 } from "@chakra-ui/react"
 import { Select as ChakraSelect, chakraComponents } from 'chakra-react-select';
 // Icons
import {
    MdScience,
    MdDeviceThermostat,
    MdPowerSettingsNew
} from 'react-icons/md';

export default function MeasureType({
    device,
    setDevice
}) {
    const measureOptions = [
        {
            value: 1,
            label: "Volumen",
            icon: <Icon as={MdScience} mr={2} color="brand.600" />
        },
        {
            value: 2,
            label: "Temperatura",
            icon: <Icon as={MdDeviceThermostat} mr={2} color="brand.600" />
        },
        {
            value: 3,
            label: "Binario",
            icon: <Icon as={MdPowerSettingsNew} mr={2} color="brand.600" />
        }
    ];

    const customComponents = {
        Option: ({ children, ...props }) => (
            <chakraComponents.Option {...props}>
                {props.data.icon} {children}
            </chakraComponents.Option>
        ),
    };

    const safePropertyValue = (code) => {
        if (!device || !device.measureProperties || device.measureProperties.length == 0)
            return '';

        let prop = device.measureProperties.find(x => x.code == code);
        if (prop) {
            return prop.value;
        }

        return '';
    };

    const handleMeasureTypeChange = (e) => setDevice({ ...device, measureTypeCode: e.value });
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
            case 3: // Binary
                component = (
                    <Flex>
                        <FormControl py={2} pr={2} isRequired>
                            <FormLabel>Etiqueta de valor cierto</FormLabel>
                            <Input type="text" value={safePropertyValue('BIN.TRUEVALUE')} onChange={e => handleMeasurePropChange('BIN.TRUEVALUE', e.target.value)} />
                        </FormControl>
                        <FormControl py={2} pr={2} isRequired>
                            <FormLabel>Etiqueta de valor falso</FormLabel>
                            <Input type="text" value={safePropertyValue('BIN.FALSEVALUE')} onChange={e => handleMeasurePropChange('BIN.FALSEVALUE', e.target.value)} />
                        </FormControl>
                    </Flex>
                );
                break;
            default: // Empty
                break;
        }

        return component;
    }

    return (
        <>
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
        </>
    )
}