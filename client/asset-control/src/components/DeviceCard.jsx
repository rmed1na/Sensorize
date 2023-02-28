import './DeviceCard.scss'

export default function DeviceCard({
    name,
    lastUpdate,
    isOnAlert,
    stateDescription,
    iconClassName
}) {
    let alertClass = isOnAlert == true ? "card--alert" : "";

    return (
        <div className={`card ${alertClass}`}>
            <div className='card__info'>
                <div className='card__info--text'>
                    <h4>{name}</h4>
                    <label>Últ. actualización: </label>
                    <label>{lastUpdate ? lastUpdate : `-`}</label>
                </div>
                <div className='card__info--icon'>
                    <i className={iconClassName}></i>
                </div>
            </div>
            <div className='card__state'>
                <label>{stateDescription}</label>
            </div>
        </div>
    )
}