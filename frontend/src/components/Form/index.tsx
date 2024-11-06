import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef,
} from "react";
import Dropdown from "../Dropdown";
import { diningHallGroup, meal, diningHallGroupMapping } from '../../metadata/data';
import "./index.less";
import axios from "axios";

interface DiningHall {
  id: string;
  name: string;
}

const Form: React.FC = () => {
  const [selectedDHG, setSelectedDHG] = useState<string>("");
  const [selectedDH, setSelectedDH] = useState<string>("");
  const [selectedMeal, setMeal] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [imageKey, setImageKey] = useState("");
  const [menuItem, setMenuItem] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [selectedDHItems, setSelectedDHItems] = useState<DiningHall[]>([]);
  const [id, setId] = useState<number>(0);


  useEffect(() => {
    if (selectedDHG) {
      setSelectedDHItems(diningHallGroupMapping[selectedDHG]);
      setSelectedDH("Select");
      setId(generateHash(selectedDHG + selectedDH + selectedMeal + menuItem));
    }
  }, [selectedDHG]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); // Prevent page reload
    setId(generateHash(selectedDHG + selectedDH + selectedMeal + menuItem));
    const review = {
      image: imageKey,
      comments: comment,
    };
    const payload = {
      group: selectedDHG,
      restaurant: selectedDH,
      category: selectedMeal,
      subcategory: "",
      item: menuItem,
      reviews: review,
      id: id,
    };

    console.log("payload in form: ", payload);

    axios
      .get(`http://localhost:3000/api/getItem/${id}`)
      .then((res) => {
        console.log("res.data.item from /api/getItem in form: ", res.data.item);

        if (res.data.item !== null) {
          console.log("item alr exist");

          axios
            .put(`http://localhost:3000/api/addReview/${id}`, review)
            .then((res) => {
              console.log("res for addReview in handleSubmit in form: ", res);
            })
            .catch((err) => console.log("err 1 in form: ", err));
        } else {
          console.log("item thread doesnt exist yet");
          axios
            .post("http://localhost:3000/api/post", payload)
            .then((res) => {
              console.log(
                "res for post new item in handleSubmit in form: ",
                res
              );
              console.log(res.data.status);

              setSelectedDHG("")
              setSelectedDH("")
              setMeal("")
              setFile(null)
              setUploadResult(null)
              setImageKey("")
              setImageKey("")
              setMenuItem("")
              setComment("")
              setSelectedDHItems([])
              setId(0)
    
            })
            .catch((err) => console.log("err 2 in form: ", err));
        }
      })
      .catch((err) => console.log("err 3 in form: ", err));
  };

  function generateHash(str: string): number {
    console.log(str);
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0; // Convert to an unsigned 32-bit integer
  }

  // Handle file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);
      setUploadResult(result.fileKey);
      console.log("result.fileKey: ", result.fileKey);
      setImageKey(result.fileKey); // Extract the key from the URL

      //   if (result) {
      //     const response2 = await fetch(
      //       `http://localhost:3000/api/addReview/${id}`,
      //       {
      //         method: "PUT",
      //         headers: {
      //           "Content-Type": "application/json",
      //         },
      //         body: JSON.stringify({
      //           review: {
      //             image: result.fileKey,
      //             commentary: comment,
      //           },
      //         }),
      //       }
      //     );
      //     const result2 = await response2.json();
      //     console.log(result2);
      // }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Upload a Foodie Photo 📷</h2>
        <label>Dining Hall Group: </label>
        <Dropdown id={"1"} data={diningHallGroup} onSelect={setSelectedDHG} />
        <br />
        <label>Dining Hall: </label>
        <Dropdown
          id={"2"}
          data={selectedDHItems}
          onSelect={setSelectedDH}
          title={
            selectedDHItems.find((item) => item.id === selectedDH)?.name ||
            "Select"
          }
        />
        <br />
        <label>Meal Type: </label>
        <Dropdown id={"3"} data={meal} onSelect={setMeal} />
        <br />
        <label>Menu Item: </label> <br />
        <input
          type="text"
          className="TextInput"
          onChange={(e) => setMenuItem(e.target.value)}
        />
        <br />
        <br />
        <label>Photo: </label> <br />
        <div>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} className="upload-btn">
            Upload
          </button>
        </div>
        <br />
        {uploadResult && (
          <div>
            <h3>Upload Result:</h3>
            <p>File URL: {uploadResult}</p>
          </div>
        )}
        <br />
        <label>Commentary: </label> <br />
        <textarea
          className="TextInput"
          placeholder="image includes omelette and matcha :)"
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <br />
        <br />
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
