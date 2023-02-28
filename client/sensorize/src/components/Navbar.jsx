import './Navbar.scss'

export default function Navbar() {
    return (
        <div className='navbar'>
            <div className='navbar__logo'>
                <i className="fa-brands fa-watchman-monitoring"></i>
                <span>Asset Control</span>
            </div>
            <div className='navbar__exit'>
                <a href="/login">
                    <span>Salir</span>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                </a>
            </div>
        </div>
    )
}