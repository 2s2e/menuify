import './index.less';

const Review = ({comment}: {comment: string}) => {

    return(
        <div className="review-post">
            <p>{comment}</p>
            <img
                src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
                style={{ width: "200px", height: "200px" }}
            />
        </div>
    )

}

export default Review;