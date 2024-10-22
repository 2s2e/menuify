import { useEffect, useState } from "react";
import "./index.less";
import axios from "axios";

const Review = ({ comment, image }: { comment: string; image?: string }) => {
  const [myImage, setMyImage] = useState<string>(
    "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
  );

  useEffect(() => {
    if (image) {
      const s = image;
      axios.get(`http://localhost:3000/image/${s}`).then((res) => {
        //get rid of the .jpg at the end
        setMyImage(res.data.url);
      });
    }
  }, [image]);

  return (
    <div className="review-post">
      <p>{comment}</p>
      <img src={myImage} style={{ width: "200px", height: "200px" }} />
    </div>
  );
};

export default Review;
