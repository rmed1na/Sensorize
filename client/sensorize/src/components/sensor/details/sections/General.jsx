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
    sensor,
    setSensor
}) {
    const handleNameChange = (e) => setSensor({ ...sensor, name: e.target.value });

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
                        placeholder="Nombre del sensor (temperatura, presión, lógico, etc.)"
                        type="text"
                        onChange={e => handleNameChange(e)}
                        value={sensor?.name ?? ''} />
                </FormControl>
            </AccordionPanel>
        </AccordionItem>
        </>
    );
}