import Header from '../components/Header';
import Footer from '../components/Footer';

function Home() {
    return (
        <div>
            <Header />
            <div>
                <p className="text-blue-600">Hello, World!</p>
            </div>
            <Footer />
        </div>
    );
}

export default Home;
