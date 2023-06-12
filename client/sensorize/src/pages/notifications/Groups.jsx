// React
import { useEffect, useState } from "react";
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
    useToast
} from "@chakra-ui/react";
// Icons
import {
    MdAdd,
    MdEdit,
    MdDelete
} from 'react-icons/md';
import Navbar from "../../components/Navbar";
// CC
import SideBar from "../../components/sidebar/SideBar";
import api from '../../api/api';
import dateUtil from '../../utils/dateUtil';

export default function Groups() {
    const toast = useToast();
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState({});
    const {
        isOpen: isModalOpen,
        onOpen: onModalOpen,
        onClose: onModalClose
    } = useDisclosure();

    function handleGroupNameChange(e) {
        setSelectedGroup({ ...selectedGroup, name: e });
    }

    async function saveGroup() {
        let isNew = selectedGroup?.id && selectedGroup?.id > 0 ? false : true;
        let successCallback = function () {
            toast({
                title: `Grupo ${isNew ? 'guardado' : 'actualizado'} satisfactoriamente`,
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

        if (isNew)
            await api.resources.notification.group.create(selectedGroup, successCallback, errorCallback);
        else
            await api.resources.notification.group.update(selectedGroup, successCallback, errorCallback);
        
        onModalClose();
        loadGroups();
    }

    async function loadGroups() {
        const groups = await api.resources.notification.group.getAll();
        setGroups(groups);
    }

    function handleNewGroupClick() {
        setSelectedGroup({});
        onModalOpen();
    }

    function handleGroupSelection(group) {
        setSelectedGroup(group);
        onModalOpen();
    }

    async function handleGroupDeletion(group) {
        await api.resources.notification.group.delete(
            group,
            function () {
                toast({
                    title: 'Grupo eliminado satisfactoriamente',
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

        loadGroups();
    }

    useEffect(() => {
        loadGroups();
    }, []);

    return (
        <Box>
            <Flex h="100vh">
                <SideBar />
                <Flex flexGrow={1} direction="column">
                    <Navbar title="Grupos de notificationes" />
                    <Flex
                        m={5}
                        px={3}
                        justify='space-between' 
                        align='center'>
                        <Heading as='h3' color="brand.500">{groups.length} grupos de alerta</Heading>
                        <Box>
                            <Button
                                leftIcon={<MdAdd />}
                                boxShadow="none"
                                size="sm"
                                onClick={handleNewGroupClick}
                            >Agregar nuevo
                            </Button>
                            <Modal isOpen={isModalOpen} onClose={onModalClose}>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Crear nuevo grupo</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody>
                                        <FormControl>
                                            <FormLabel>Nombre</FormLabel>
                                            <Input 
                                                type="text" 
                                                placeholder="Nombre del grupo" 
                                                onChange={e => handleGroupNameChange(e.target.value)}
                                                value={selectedGroup?.name ?? ''} />
                                        </FormControl>
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button mr={3} onClick={saveGroup}>
                                            Guardar
                                        </Button>
                                        <Button variant='ghost' onClick={onModalClose}>Cancelar</Button>
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
                                        <Th>Grupo</Th>
                                        <Th>Estatus</Th>
                                        <Th>Fecha de creación</Th>
                                        <Th>Última actualización</Th>
                                        <Th>Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {groups && groups.map((group, index) => {
                                        return (
                                            <Tr key={index}>
                                                <Td>{group.name}</Td>
                                                <Td>{group.isActive ? <Badge colorScheme="green">Activo</Badge> : <Badge colorScheme="red">Inactivo</Badge>}</Td>
                                                <Td>{dateUtil.toReadableString(group.createdDate)}</Td>
                                                <Td>{dateUtil.toReadableString(group.updatedDate)}</Td>
                                                <Td>
                                                { group.isActive && 
                                                    <HStack>
                                                        <Tooltip label="Editar">
                                                            <Button 
                                                                size="sm" 
                                                                boxShadow="none" 
                                                                variant="ghost" 
                                                                onClick={() => handleGroupSelection(group)}>
                                                                <MdEdit />
                                                            </Button>
                                                        </Tooltip>
                                                        <Tooltip label="Eliminar">
                                                            <Button 
                                                                size="sm" 
                                                                boxShadow="none" 
                                                                variant="ghost" 
                                                                color="red.600" 
                                                                onClick={() => handleGroupDeletion(group)}>
                                                                <MdDelete />
                                                            </Button>
                                                        </Tooltip> 
                                                    </HStack> 
                                                }
                                                </Td>
                                            </Tr>);
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