// Chakra
import { 
    Box, 
    Flex 
} from '@chakra-ui/react';

// CC
import SideBar from '../../components/sidebar/SideBar';
import Dashboard from '../../components/dashboard/Dashboard';
import Navbar from '../../components/Navbar'

export default function Home() {
    return (
        <Box>
            <Flex h="100vh">
                <SideBar />
                <Flex flexGrow="1" direction="column">
                    <Navbar />
                    <Dashboard title="Dashboard" />
                </Flex>
            </Flex>
        </Box>
    );
}