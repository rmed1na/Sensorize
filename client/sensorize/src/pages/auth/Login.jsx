import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
// Chakra
import { 
    Flex, 
    Box, 
    Button, 
    Text, 
    Heading, 
    Center, 
    FormControl, 
    FormLabel, 
    Input, 
    InputGroup, 
    InputLeftAddon } from '@chakra-ui/react';
// Assets
import background from '../../assets/images/landing-network.jpg'
import { AtSignIcon, LockIcon } from '@chakra-ui/icons';

export default function Login() {
    const navigation = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function onLoginClick() {
        //TODO: Add backend implementation for this auth process

        if (email == "admin@company.com" && password == "Password@123")
            navigation('/home');
        else
            alert('Invalid credentials');
    }

    return (
        <>
            <Flex h="100vh" w="100vw">
                <Box flexGrow="2" bg={`url(${background})`} bgSize="cover"></Box>
                <Box flexGrow="1" shadow="-1px 0px 6px 0px rgba(0,0,0,0.54)">
                    <Center h="100vh">
                        <Flex direction="column">
                            <Heading
                                as="h2"
                                color="brand.600"
                                fontWeight='600'
                                borderBottom="3px solid #4b5f68"
                                my="0.5rem">sensorize</Heading>

                            <Text pb="2rem" color="blackAlpha.700" fontSize="sm">Bienvenido. Por favor, ingrese sus credenciales</Text>
                            <form>
                                <Flex direction="column">
                                    <FormControl mb="5">
                                        <FormLabel mb="1">Correo electrónico</FormLabel>
                                        <InputGroup>
                                            <InputLeftAddon children={<AtSignIcon />} color="brand.600" />
                                            <Input type="email" onChange={e => setEmail(e.target.value)} />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel mb="1">Contraseña</FormLabel>
                                        <InputGroup>
                                            <InputLeftAddon children={<LockIcon />} color="brand.600" />
                                            <Input type="password" onChange={e => setPassword(e.target.value)} />
                                        </InputGroup>
                                    </FormControl>
                                    <Button mt="10" boxShadow="md" onClick={onLoginClick}>Iniciar sesión</Button>
                                </Flex>
                            </form>
                        </Flex>
                    </Center>
                </Box>
            </Flex>
        </>
    );
}