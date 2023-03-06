// Chakra
import { 
    Box, 
    HStack, 
    StackDivider, 
    Flex,
    Icon,
    Heading,
    Text,
    Divider,
    SimpleGrid
} from "@chakra-ui/react";

// CC
import DeviceCard from '../../components/DeviceCard';

// Icons
import { BiChip } from 'react-icons/bi';
import { CgDanger } from 'react-icons/cg';
import { MdOutlineSync } from 'react-icons/md';

export default function Dashboard() {
    return (
        <>
            <Box mx={10} mt={5}>
                <Flex justify="space-around" color="blackAlpha.700">
                    <Flex gap={2} align="center">
                        <Icon as={BiChip} boxSize={8} />
                        <Box>
                            <Heading>0</Heading>
                            <Text>Dispositivos</Text>
                        </Box>
                    </Flex>
                    <Box w="1px" bg="brand.100" mx="2" />
                    <Flex gap={2} align="center">
                        <Icon as={CgDanger} boxSize={8} />
                        <Box>
                            <Heading>0</Heading>
                            <Text>Alertas</Text>
                        </Box>
                    </Flex>
                    <Box w="1px" bg="brand.100" mx="2" />
                    <Flex gap={2} align="center">
                        <Icon as={MdOutlineSync} boxSize={8} />
                        <Box>
                            <Heading>-</Heading>
                            <Text>Última actualización</Text>
                        </Box>
                    </Flex>
                </Flex>

                <Divider my={5} borderColor="brand.100" />

                <SimpleGrid columns={5} spacing={2}>
                    <DeviceCard name="Puerta 1" stateDescription="Abierta" lastUpdate={new Date().toLocaleTimeString()} />
                    <DeviceCard name="Puerta 2" stateDescription="Cerrada" lastUpdate={new Date().toLocaleTimeString()} />
                    <DeviceCard name="Puerta 3" stateDescription="Abierta" lastUpdate={new Date().toLocaleTimeString()} />
                </SimpleGrid>
            </Box>
        </>
    )
}