import { Box, Container, Flex } from "@chakra-ui/react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";

export default function DeviceConfig() {
    return (
        <Box>
            <Flex h="100vh">
                <Sidebar />
                <Flex flexGrow={1} direction="column">
                    <Navbar title="Dispositivos"/>
                    <Box mx={10} mt={5}>
                        
                    </Box>
                </Flex>
            </Flex>
        </Box>
    )
}