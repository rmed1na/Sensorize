import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";

export default function DeviceListItem({
    device,
    onClick,
    isNewPlaceholder = false
}) {
    if (isNewPlaceholder) {
        return (
            <Card
                mx={3} 
                my={2} 
                variant="outline" 
                align="center" 
                border="1px dashed" 
                borderColor="blackAlpha.400" size="sm"
                onClick={() => onClick(device)}>
                <CardBody>
                    <Text 
                        color="blackAlpha.600" 
                        fontWeight={500}
                        fontSize="0.875rem">Crear nuevo</Text>
                </CardBody>
            </Card>
        )
    }

    return (
        <Card 
            mx={3} 
            my={2} 
            bg="blackAlpha.100"
            onClick={() => onClick(device)}>
            <CardHeader pt={3.5} pb={0.5}>
                <Heading as="h4" color="brand.600">{device.name}</Heading>
            </CardHeader>
            <CardBody pb={3.5} pt={0.5}>
                <Text fontSize="0.875rem" color="blackAlpha.800">{device.measureType}</Text>
            </CardBody>
        </Card>
    )
}