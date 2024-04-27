import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default LandingPage;