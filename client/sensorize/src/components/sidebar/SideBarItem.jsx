// React
import { Link as RouterLink, useLocation } from 'react-router-dom';
// Chakra
import {
    Flex,
    Link,
    Icon,
    Text,
    useColorModeValue,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon
} from "@chakra-ui/react";

export default function SideBarItem({
    title,
    icon,
    to,
    children = []
}) {
    const location = useLocation();

    function getSideBarLink(route, titleText, linkIcon, isSelected, isChild = false) {
        return (
            <Link
                key={titleText}
                as={RouterLink}
                to={route}
                transition="all 0.2s"
                borderRadius="md"
                style={{ textDecoration: 'none' }}>
                <Flex
                    align="center"
                    p={2}
                    cursor="pointer"
                    gap={2}
                    color={isSelected ? '#fff' : 'blackAlpha.700'}
                    bg={isSelected ? 'brand.600' : 'inherit'}
                    borderRadius="md"
                    my={ isChild ? 1 : 0 }
                    height={ isChild ? '2rem' : 'initial' }
                    _hover={{ 
                        color: isSelected ? useColorModeValue('#fff') : 'inherit', 
                        bg: isSelected ? useColorModeValue('brand.600') : useColorModeValue('blackAlpha.100') 
                    }}>
                    {linkIcon && (<Icon as={linkIcon} />)}
                    <Text fontSize="0.875rem" fontWeight={500}>{titleText}</Text>
                </Flex>
            </Link>)
    }

    if (children.length <= 0) {
        return getSideBarLink(to, title, icon, location.pathname == to);
    }

    let anyChildrenSelected = children.findIndex(c => location.pathname == c.to) > -1;

    return (
        <Accordion
            allowToggle
            transition="all 0.2s"
            defaultIndex={anyChildrenSelected ? [0] : null}>
            <AccordionItem
                border="none"
                borderRadius="sm">
                <AccordionButton color="blackAlpha.700" p={2}>
                    {icon && (<Icon as={icon} />)}
                    <Flex justify="space-between" w="100%">
                        <Text ml={2} fontSize="0.875rem" fontWeight={500}>{title}</Text>
                        <AccordionIcon />
                    </Flex>
                </AccordionButton>
                <AccordionPanel>
                    {children.map(c => {
                        return getSideBarLink(c.to, c.title, c.icon, location.pathname == c.to, true)
                    })}
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    );
}