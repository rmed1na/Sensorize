// Chakra
import { 
    Box, 
    Flex, 
    Heading, 
    Stack,
    useColorModeValue } from '@chakra-ui/react';

// Icons
import { VscRadioTower } from 'react-icons/vsc';
import { BiChip } from 'react-icons/bi';
import { RxDashboard } from 'react-icons/rx';

// CC
import NavItem from './SidebarItem';
import { useState } from 'react';

export default function Sidebar() {
    const [navItems, setNavItems] = useState([
        {
            title: 'Monitoreo',
            to: '/home',
            icon: RxDashboard
        },
        {
            title: 'Dispositivos',
            to: '/device',
            icon: BiChip
        }
    ]);

    return (
        <>
            <Box
                w="15rem"
                borderRight="1px"
                borderRightColor={useColorModeValue('gray.300', 'gray.700')}>
                <Flex h="100vh" direction="column">
                    <Heading
                        as="h3"
                        color="brand.500"
                        fontWeight='600'
                        borderBottom="1px"
                        borderBottomColor={useColorModeValue('brand.500')}
                        mt="1rem"
                        mx="1rem"
                        mb="4rem">sensorize</Heading>

                    <Stack mx="0.25rem">
                        {navItems.map((i) => {
                            return <NavItem 
                                        key={i.title} 
                                        title={i.title} 
                                        to={i.to} 
                                        icon={i.icon} />
                        })}
                    </Stack>
                </Flex>
            </Box>
        </>
    )
}