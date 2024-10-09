import Review from '../Review';
import './index.less';

const ReviewBox = ({menuItem}: {menuItem: string}) => {

    const arr = [
        'meat was very dry',
        'very little portion',
        'decent',
        'not bad',
        'get smth else',
        'they forgot my lettuce',
        'waited like an hour for this :<'
    ]
    return(
        <div>
            <h1>{menuItem}</h1>

            {/* import the scrollable component */}

            <div className="scrollableReviews">
                 {arr.map( a => 
                        <Review comment={a}/>
                 )}
            </div>
            
        </div>
    )
}

export default ReviewBox