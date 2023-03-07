import { Box, Container, Flex } from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import SideBar from "../../components/sidebar/SideBar";

export default function DeviceConfig() {
    return (
        <Box>
            <Flex h="100vh">
                <SideBar />
                <Flex flexGrow={1} direction="column">
                    <Navbar title="Dispositivos"/>
                    <Flex direction="row" mx={10} mt={5}>
                        <Box>List of devices</Box>
                        <Box>details</Box>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}