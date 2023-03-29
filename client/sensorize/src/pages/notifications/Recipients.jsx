// Chakra
import { 
    Badge,
    Box, 
    Button, 
    Divider, 
    Flex, 
    FormControl, 
    FormLabel, 
    Heading, 
    HStack, 
    Input, 
    Modal, 
    ModalBody, 
    ModalCloseButton, 
    ModalContent, 
    ModalFooter, 
    ModalHeader, 
    ModalOverlay, 
    Table, 
    TableContainer, 
    Tbody, 
    Td, 
    Th, 
    Thead, 
    Tooltip, 
    Tr, 
    useDisclosure, 
    useToast } from "@chakra-ui/react";
// Chakra select
import { Select as ChakraSelect } from 'chakra-react-select';
import { useState, useEffect } from "react";
// Icons
import {
    MdAdd,
    MdEdit,
    MdDelete
} from 'react-icons/md'
// CC
import Navbar from "../../components/Navbar";
import SideBar from "../../components/sidebar/SideBar";
import api from '../../api/api';
import dateUtil from '../../utils/dateUtil';

export default function Recipients() {
    const toast = useToast();
    const [groups, setGroups] = useState([]);
    const [groupOptions, setGroupOptions] = useState([]);
    const [recipients, setRecipients] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState({});
    const {
        isOpen: isModalOpen,
        onOpen: onModalOpen,
        onClose: onModalClose
    } = useDisclosure();

    function handleNewRecipientClick() {
        setSelectedRecipient({});
        onModalOpen();
    }

    const handleFirstNameChange = (e) => setSelectedRecipient({ ...selectedRecipient, firstName: e });
    const handleLastNameChange = (e) => setSelectedRecipient({ ...selectedRecipient, lastName: e });
    const handleEmailChange = (e) => setSelectedRecipient({ ...selectedRecipient, email: e });
    const handleGroupChange = (e) => setSelectedRecipient({ ...selectedRecipient, groupId: e.value });
    
    const handleRecipientSelection = (recipient) => {
        setSelectedRecipient(recipient);
        onModalOpen();
    }

    async function handleRecipientDeletion(recipient) {
        await api.resources.notification.recipient.delete(
            recipient,
            function () {
                toast({
                    title: 'Destinatario eliminado satisfactoriamente',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });
            },
            function (errorMessage = '') {
                toast({
                    title: 'Error',
                    status: 'error',
                    description: errorMessage,
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });
            }
        );

        loadRecipients();
    }

    async function loadGroups() {
        const groups = await api.resources.notification.group.getAll();
        const options = groups.map(g => {
            return {
                value: g.id,
                label: g.name
            }
        });
        setGroups(groups);
        setGroupOptions(options);
    }

    async function loadRecipients() {
        const recipients = await api.resources.notification.recipient.getAll();
        setRecipients(recipients);
    }

    async function saveRecipient() {
        let isNew = selectedRecipient?.id && selectedRecipient?.id > 0 ? false : true;
        let successCallback = function () {
            toast({
                title: `Destinatario ${isNew ? 'guardado' : 'actualizado'} satisfactoriamente`,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        };
        let errorCallback = function (errorMessage = '') {
            toast({
                title: 'Error',
                status: 'error',
                description: errorMessage,
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        };
        
        let recipientResource = api.resources.notification.recipient;
        let action = isNew ? recipientResource.create : recipientResource.update;

        await action(selectedRecipient, successCallback, errorCallback);
        onModalClose();
        loadRecipients();
    }

    useEffect(() => {
        loadGroups();
        loadRecipients();
    }, []);

    return (
        <Box>
            <Flex h="100vh">
                <SideBar />
                <Flex flexGrow={1} direction="column">
                    <Navbar title="Destinatarios de notificaciones" />
                    <Flex
                        m={5}
                        px={3}
                        justify="space-between"
                        align="center">
                        <Heading as="h3" color="brand.500">{recipients.length} destinatarios</Heading>
                        <Box>
                            <Button
                                leftIcon={<MdAdd />}
                                boxShadow="none"
                                size="sm"
                                onClick={handleNewRecipientClick}>
                                Agregar nuevo
                            </Button>
                            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Crear nuevo destinatario</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <FormControl>
                                            <FormLabel>Nombre</FormLabel>
                                            <Input 
                                                type="text" 
                                                placeholder="Nombre del destinatario"
                                                onChange={e => handleFirstNameChange(e.target.value)}
                                                value={selectedRecipient?.firstName ?? ''} />
                                        </FormControl>
                                        <FormControl my={4}>
                                            <FormLabel>Apellido</FormLabel>
                                            <Input 
                                                type="text" 
                                                placeholder="Apellido del destinatario"
                                                onChange={e => handleLastNameChange(e.target.value)}
                                                value={selectedRecipient?.lastName ?? ''} />
                                        </FormControl>
                                        <FormControl isRequired my={4}>
                                            <FormLabel>Correo electrónico</FormLabel>
                                            <Input 
                                                type="email" 
                                                placeholder="Correo electrónico del destinatario"
                                                onChange={e => handleEmailChange(e.target.value)}
                                                value={selectedRecipient?.email ?? ''} />
                                        </FormControl>
                                        <FormControl my={4} isRequired>
                                            <FormLabel>Grupo</FormLabel>
                                            <ChakraSelect 
                                                placeholder="Seleccione un grupo"
                                                colorScheme="brand"
                                                options={groupOptions}
                                                onChange={e => handleGroupChange(e)}
                                                value={groupOptions.find(g => g.value == selectedRecipient?.groupId)}></ChakraSelect>
                                        </FormControl>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button mr={3} onClick={saveRecipient}>Guardar</Button>
                                        <Button variant="ghost" onClick={onModalClose}>Cancelar</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
                        </Box>
                    </Flex>
                    <Box mx={6}>
                        <Divider mb={6} />
                        <TableContainer>
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Nombre</Th>
                                        <Th>Correo electrónico</Th>
                                        <Th>Estatus</Th>
                                        <Th>Grupo</Th>
                                        <Th>Fecha de creación</Th>
                                        <Th>Última actualización</Th>
                                        <Th>Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    { recipients && recipients.map((r, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{r.firstName} {r.lastName}</Td>
                                                <Td>{r.email}</Td>
                                                <Td>{r.isActive ? <Badge colorScheme="green">Activo</Badge> : <Badge colorScheme="red">Inactivo</Badge>}</Td>
                                                <Td><Badge colorScheme="brand">{r.groupName}</Badge></Td>
                                                <Td>{dateUtil.toReadableString(r.createdDate)}</Td>
                                                <Td>{dateUtil.toReadableString(r.updatedDate)}</Td>
                                                <Td>
                                                { r.isActive &&
                                                    <HStack>
                                                        <Tooltip label="Editar">
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost" 
                                                                boxShadow="none"
                                                                onClick={() => handleRecipientSelection(r)}>
                                                                <MdEdit />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip label="Eliminar">
                                                            <Button 
                                                                size="sm" 
                                                                boxShadow="none"
                                                                variant="ghost" 
                                                                color="red.600"
                                                                onClick={() => handleRecipientDeletion(r)}>
                                                                <MdDelete />
                                                            </Button>
                                                        </Tooltip>
                                                    </HStack>
                                                }
                                                </Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Flex>
            </Flex>
        </Box>
    )
}