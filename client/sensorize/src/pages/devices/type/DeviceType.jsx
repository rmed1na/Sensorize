// React
import { useState } from "react";
// Chakra
import {
    Box,
    Divider,
    Flex,
    Heading    
} from "@chakra-ui/react";
// CC
import Navbar from "../../../components/Navbar";
import SideBar from "../../../components/sidebar/SideBar";
import DeviceTypeListItem from "../../../components/device/DeviceTypeListItem";
import DeviceTypeDetails from "../../../components/device/DeviceTypeDetails";

export default function DeviceType() {
    const [detailsHidden, setDetailsHidden] = useState(true);

    return (
        <Box>
            <Flex h="100vh">
                <SideBar />
                <Flex flexGrow={1} direction="column">
                    <Navbar title="Tipos de dispositivos" />
                    <Flex direction="row" mx={10} mt={5} gap={4}>
                        <Box w="40%">
                            <Heading as="h3" color="brand.500" p={1}># tipos</Heading>
                            <Divider mb={5} />

                            <Box maxH={750} sx={{ overflowY: 'auto', cursor: 'pointer' }}>
                                <DeviceTypeListItem name="Tanque" measure="Volumen" isNewPlaceholder={true} />
                            </Box>
                        </Box>
                        <Box w="60%">
                            <Heading as="h3" color="brand.500" p={1}>Detalles</Heading>
                            <Divider />

                            <Box m={5}>
                                <DeviceTypeDetails />
                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}