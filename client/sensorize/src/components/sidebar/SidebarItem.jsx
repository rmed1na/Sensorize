import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Flex,
    Link,
    Icon,
    Text,
    useColorModeValue } from "@chakra-ui/react";

export default function NavItem({
    title,
    icon,
    to
}) {
    const location = useLocation();
    const isSelected = location.pathname === to;
    
    return (
        <Link 
            as={RouterLink}
            to={to}
            transition="all 0.2s"
            style={{ textDecoration: 'none' }}
            borderRadius="sm"
            bg={isSelected ? 'brand.600' : 'inherit'}
            _hover={{ bg: useColorModeValue('brand.100')}}>
            <Flex
                align="center"
                p={2}
                cursor="pointer"
                gap={2}
                color={isSelected ? '#fff' : 'blackAlpha.700'}
                _hover={{ color: (isSelected ? useColorModeValue('brand.700') : 'inherit') }}>
                {icon && (<Icon as={icon} />)}
                <Text fontSize="0.875rem" fontWeight={500}>{title}</Text>
            </Flex>
        </Link>
    )
}