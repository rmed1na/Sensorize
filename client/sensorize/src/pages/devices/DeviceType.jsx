import { Box, Divider, Flex, FormControl, FormLabel, Heading, HStack, Input, Select, Stack, Tag, Text } from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import SideBar from "../../components/sidebar/SideBar";

export default function DeviceType() {
    return (
        <Box>
            <Flex h="100vh">
                <SideBar />
                <Flex flexGrow={1} direction="column">
                    <Navbar title="Tipos de dispositivos" />
                    <Flex direction="row" mx={10} mt={5} gap={4}>
                        <Box flexGrow={1}>
                            <Heading as="h3" color="brand.500" p={1}># tipos</Heading>
                            <Divider />
                        </Box>
                        <Box flexGrow={1.5}>
                            <Heading as="h3" color="brand.500" p={1}>Detalles</Heading>
                            <Divider />

                            <Box m={5}>
                                <Stack fontSize="0.875rem" fontWeight={500}>
                                    <Flex direction="row" align="center" gap={4} mb={4}>
                                        <Flex align="center" gap={1}>
                                            <Text>Id:</Text>
                                            <Tag></Tag>
                                        </Flex>
                                        <Flex align="center" gap={1}>
                                            <Text>Creado:</Text>
                                            <Tag></Tag>
                                        </Flex>
                                    </Flex>
                                    <FormControl>
                                        <FormLabel>Nombre</FormLabel>
                                        <Input size="sm" placeholder="Nombre del tipo de dispositivo (ej: tanque, termómetro, etc.)" type="text" />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Medida</FormLabel>
                                        <Select size='sm'>
                                            {/* TODO: get this options from the API */}
                                            <option value=''></option>
                                            <option value='1'>Volumen</option>
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}