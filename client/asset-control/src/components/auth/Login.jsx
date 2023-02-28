import { useState } from 'react'
import './Login.scss'
import background from '../../assets/images/landing-network.jpg'
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigation = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function onLoginClick() {
        //TODO: Add backend implementation for this auth process
        
        if (email == "admin@company.com" && password == "Password@123")
            navigation('/home');
    }

    return (
        <div className="login">
            <div className='login__section login__section--left' style={{ backgroundImage: `url(${background})` }}>
            </div>
            <div className='login__section login__section--right'>
                <div className="login__item login__item--title">
                    <h1>
                        <i className="fa-brands fa-watchman-monitoring"></i>
                        <span>Asset Control</span>
                    </h1>
                    <span>Bienvenido. Por favor, ingrese sus credenciales</span>
                </div>
                <div className="login__item">
                    <label>Email</label>
                    <input type="email" placeholder="Ingrese su correo electrónico" onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="login__item">
                    <label>Contraseña</label>
                    <input type="password" placeholder='Ingrese su contraseña' onChange={e => setPassword(e.target.value)} />
                </div>
                <div className="login__item">
                    <button onClick={onLoginClick}>Iniciar sesión</button>
                </div>
            </div>
        </div>
    );
}