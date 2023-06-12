import {
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Flex,
    Heading,
    FormControl,
    FormLabel,
    Input
} from "@chakra-ui/react";

export default function MessageBroker({
    device,
    setDevice
}) {
    const handleTopicChange = (e) => setDevice({ ...device, topic: e.target.value });
    const handleChannelChange = (e) => setDevice({ ...device, channel: e.target.value });

    return (
        <>
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
        </>
    )
}