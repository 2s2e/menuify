import { useEffect, useState } from "react";
import Review from "../Review";
import "./index.less";
import axios from "axios";

const ReviewBox = ({ id }: { id: number }) => {
  const arr = [
    "meat was very dry",
    "very little portion",
    "decent",
    "not bad",
    "get smth else",
    "they forgot my lettuce",
    "waited like an hour for this :<",
  ];

  interface Review {
    comments: string;
    image: string;
  }

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    //fetch the review for the item with the given id

    axios.get(`http://localhost:3000/api/getItem/${String(id)}`).then((res) => {
      console.log("res.data.item from /api/getItem in form: ", res.data.item);
      setReviews(res.data.item.reviews);
    });
  }, [id]);

  return (
    <div>
      {/* import the scrollable component */}

      <div className="scrollableReviews">
        {reviews.map((a) => (
          <Review comment={a.comments} image={a.image} />
        ))}
      </div>
    </div>
  );
};

export default ReviewBox;
