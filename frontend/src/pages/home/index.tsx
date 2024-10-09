import ReviewBox from '../../components/ReviewBox';
import './index.less';

const Home = () => {
    return(
        <>
        <div className='container'>
        <ReviewBox menuItem="TRITON BURGER"/>
        </div>
        <div className='container'>
        <ReviewBox menuItem="RANDOM BURGER"/>
        </div>
        </>
    )
}

export default Home;