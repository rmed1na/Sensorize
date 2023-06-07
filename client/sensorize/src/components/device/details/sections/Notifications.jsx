import { useState, useEffect } from 'react';

import { 
    AccordionButton, 
    AccordionIcon, 
    AccordionItem, 
    AccordionPanel, 
    Flex, 
    FormControl, 
    FormLabel, 
    Heading, 
    Input, 
    Switch,
    Box,
    Select
} from "@chakra-ui/react";

export default function Notifications({
    device,
    setDevice,
    notificationGroups
}) {
    const [notifyState, setNotifyState] = useState(false);
    const handleNotificationGroupChange = (e) => setDevice({ ...device, notificationGroupId: e.target.value });
    const handleStateNotificationFrequencyChange = (e) => setDevice({ ...device, stateNotificationFrequency: e.target.value });
    const handleHasStateNotificationChange = (e) => {
        let checked = e.target.checked;
        setNotifyState(checked);

        if (!checked) {
            setDevice({ ...device, stateNotificationFrequency: null });
        }
    };

    useEffect(() => {
        setNotifyState(device?.stateNotificationFrequency ? true : false);
    }, [device]);

    return (
        <AccordionItem>
            <AccordionButton>
                <Flex justify='space-between' w='full'>
                    <Heading as='h4' fontWeight={500}>Notificaciones</Heading>
                    <AccordionIcon />
                </Flex>
            </AccordionButton>
            <AccordionPanel>
                <FormControl py={2}>
                    <FormLabel>Grupo</FormLabel>
                    <Select 
                        size='sm' 
                        placeholder='Selecciona un grupo'
                        value={device?.notificationGroupId}
                        onChange={e => handleNotificationGroupChange(e)}>
                        { notificationGroups && notificationGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>) }
                    </Select>
                </FormControl>
                <FormControl py={2} display='flex'>
                    <FormLabel>Notificar estado?</FormLabel>
                    <Switch onChange={e => handleHasStateNotificationChange(e)} isChecked={notifyState}/>
                </FormControl>
                {notifyState && 
                <Box>
                    <FormControl py={2}>
                        <FormLabel>Minutos de frecuencia</FormLabel>
                        <Input 
                            type='number' 
                            value={device?.stateNotificationFrequency ?? ''}
                            onChange={e => handleStateNotificationFrequencyChange(e)} />
                    </FormControl>
                </Box>
                }
            </AccordionPanel>
        </AccordionItem>
    )
}