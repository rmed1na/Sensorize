import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    Text,
    Flex
} from '@chakra-ui/react';

export default function SensorStateCard({
    name,
    lastUpdate,
    isOnAlert,
    stateDescription
}) {
    return (
        <>
            <Card 
                maxW="sm" 
                border={ isOnAlert ? '1px solid' : 'inherit' } 
                borderColor={ isOnAlert ? 'red.500' : 'inherit' }>
                <CardHeader pb={0} color="brand.700">
                    <Heading as="h4">{name}</Heading>
                </CardHeader>
                <CardBody py={2}>
                    <Flex fontSize="0.8125rem" direction="column">
                        <Text>Última actualización hace:</Text>
                        <Text color="blackAlpha.700" fontWeight={600}>{lastUpdate}</Text>
                    </Flex>
                </CardBody>
                <CardFooter 
                    borderBottomRadius="md" 
                    bg={ isOnAlert ? 'red.500' : 'blackAlpha.100' }
                    py={3} 
                    fontWeight={500} 
                    color="blackAlpha.700">
                    <Text 
                        w="full" 
                        textAlign="center"
                        color={ isOnAlert ? 'white' : 'inherit' }>{stateDescription ? stateDescription : <span>&nbsp;</span>}</Text>
                </CardFooter>
            </Card>
        </>
    )
}