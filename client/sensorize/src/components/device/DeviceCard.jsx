import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    Text,
    Box,
    Flex
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
                    <Flex fontSize="0.8125rem" direction="column">
                        <Text>Última actualización hace:</Text>
                        <Text color="blackAlpha.700" fontWeight={600}>{lastUpdate}</Text>
                    </Flex>
                </CardBody>
                <CardFooter borderBottomRadius="md" bg="blackAlpha.100" py={3} fontWeight={500} color="blackAlpha.700">
                    <Text w="full" textAlign="center">{stateDescription ? stateDescription : <span>&nbsp;</span>}</Text>
                </CardFooter>
            </Card>
        </>
    )
}