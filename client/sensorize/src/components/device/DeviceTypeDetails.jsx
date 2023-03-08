// React
import { useState } from "react";
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
    Icon
} from "@chakra-ui/react";
// Chakra select
import { Select, chakraComponents } from 'chakra-react-select';
// Icons
import {
    MdScience,
    MdDeviceThermostat
} from 'react-icons/md';

export default function DeviceTypeDetails({
    id,
    createdDate,
    updatedDate,
    name,
    measureCode
}) {
    const [deviceType, setDeviceType] = useState({
        id: id,
        createdDate: createdDate,
        updatedDate: updatedDate,
        name: name,
        measureCode: measureCode
    });

    let measureOptions = [
        {
            value: '1',
            label: <Text fontSize="0.875rem">Volumen</Text>,
            icon: <Icon as={MdScience} mr={2} color="brand.600" />
        },
        {
            value: '2',
            label: <Text fontSize="0.875rem">Temperatura</Text>,
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

    function handleMeasureChange(e) {
        setDeviceType({...deviceType, measureCode: e.value});
    }

    function handleNameChange(e) {
        setDeviceType({...deviceType, name: e.target.value});
    }

    return (
        <Box>
            <Stack fontSize="0.875rem" fontWeight={500}>
                <Flex direction="column" gap={4} mb={5}>
                    <Flex>
                        <Text w="12rem" color="blackAlpha.700">Id:</Text>
                        <Text>{id}</Text>
                    </Flex>
                    <Flex>
                        <Text w="12rem" color="blackAlpha.700">Creación:</Text>
                        <Text>{createdDate}</Text>
                    </Flex>
                    <Flex>
                        <Text w="12rem" color="blackAlpha.700">Última actualización:</Text>
                        <Text>{updatedDate}</Text>
                    </Flex>
                </Flex>
                <FormControl py={2} isRequired>
                    <FormLabel>Nombre</FormLabel>
                    <Input 
                        placeholder="Nombre del tipo de dispositivo (ej: tanque, termómetro, etc.)" 
                        type="text" 
                        value={deviceType.name}
                        onChange={e => handleNameChange(e)} />
                </FormControl>
                <FormControl py={2} isRequired>
                    <FormLabel>Medida</FormLabel>
                    <Select
                        name="measureType"
                        options={measureOptions}
                        placeholder="Selecccione un tipo de medida"
                        components={customComponents}
                        onChange={e => handleMeasureChange(e)}
                        colorScheme="brand"
                        defaultValue={measureOptions.findIndex(x => x.value == measureCode)} />
                </FormControl>
            </Stack>
            <Flex gap={2} justify="flex-end" my={5}>
                <Button size="sm">Guardar</Button>
            </Flex>
        </Box>
    )
}