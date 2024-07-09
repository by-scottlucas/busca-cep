import './Modal.css';

export default function Modal({ show, children }) {

    if (!show) {
        return null;
    }

    return (

        <div className="modal-overlay">

            <div className="modal-box">

                <div className="modal-content">

                    {children}
                    
                </div>

            </div>

        </div>

    );

}