import { Link as RouterLink } from 'react-router-dom';

// Chakra
import { Icon, Box, Flex, useColorModeValue, Button, Link, Heading } from '@chakra-ui/react';

// Icons
import { RiLogoutCircleRLine } from 'react-icons/ri';

export default function Navbar({
    title
}) {
    return (
        <>
            <Flex 
                w="100%" 
                h="3rem"
                borderBottom="1px"
                borderBottomColor={useColorModeValue('gray.300', 'gray.700')}
                align="center"
                justify="space-between"
                px={5}>
                    <Heading as="h3" color="brand.700">{title}</Heading>
                    <Link as={RouterLink} to='/login'>
                        <Box display="flex" alignItems="center">
                            <Icon as={RiLogoutCircleRLine} boxSize={5} color={useColorModeValue('brand.600')} />
                        </Box>
                    </Link>
            </Flex>
        </>
    )
}