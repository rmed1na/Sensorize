import { 
    AccordionItem, 
    AccordionButton,
    Flex,
    Heading,
    AccordionIcon,
    AccordionPanel,
    FormControl,
    FormLabel,
    Input
} from "@chakra-ui/react";

export default function General({
    device,
    setDevice
}) {
    const handleNameChange = (e) => setDevice({ ...device, name: e.target.value });

    return (
        <>
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
        </>
    );
}