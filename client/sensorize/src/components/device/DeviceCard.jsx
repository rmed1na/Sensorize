import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    Text,
    Box
} from '@chakra-ui/react';

export default function DeviceCard({
    name,
    lastUpdate,
    isOnAlert,
    stateDescription,
    iconClassName
}) {
    let alertClass = isOnAlert == true ? "card--alert" : "";

    return (
        <>
            <Card maxW="sm">
                <CardHeader pb={0} color="brand.700">
                    <Heading as="h4">{name}</Heading>
                </CardHeader>
                <CardBody py={2}>
                    <Text fontSize="0.8125rem">Última actualización: {lastUpdate ? lastUpdate : '-'}</Text>
                </CardBody>
                <CardFooter borderBottomRadius="md" bg="blackAlpha.100" py={3} fontWeight={500} color="blackAlpha.700">
                    <Text>{stateDescription}</Text>
                </CardFooter>
            </Card>
        </>
    )
}