// React
import { useState } from 'react';
// Chakra
import {
    Box,
    Flex,
    Heading,
    Stack,
    useColorModeValue
} from '@chakra-ui/react';
// Icons
import { BiChip } from 'react-icons/bi';
import { RxDashboard } from 'react-icons/rx';
import {
    MdNotificationsNone,
    MdOutlineGroup,
    MdOutlineRecordVoiceOver,
    MdOutlineMonitorHeart,
    MdSensors
} from 'react-icons/md';
// CC
import SideBarItem from './SideBarItem';

export default function SideBar() {
    const [navItems] = useState([
        {
            title: 'Monitoreo',
            to: '/home',
            icon: RxDashboard
        },
        {
            title: 'Dispositivos',
            icon: BiChip,
            children: [
                {
                    title: 'Sensores',
                    icon: MdSensors,
                    to: '/sensor'
                }
            ]
        },
        {
            title: 'Notificaciones',
            icon: MdNotificationsNone,
            children: [
                {
                    title: 'Grupos',
                    icon: MdOutlineGroup,
                    to: '/notification/group'
                },
                {
                    title: 'Destinatarios',
                    icon: MdOutlineRecordVoiceOver,
                    to: '/notification/recipient'
                }
            ]
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
                            return <SideBarItem
                                key={i.title}
                                title={i.title}
                                to={i.to}
                                icon={i.icon}
                                children={i.children} />
                        })}
                    </Stack>
                </Flex>
            </Box>
        </>
    )
}