import "./App.css";
import React, { ChangeEvent, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";

import Form from './components/Form'

// Dummy data
const data = [
  {
    diningHallGroup: "North Campus Dining",
    diningHalls: [
      {
        name: "Main Dining Hall",
        menuGroups: [
          {
            name: "Breakfast",
            menuItems: [
              { name: "Pancakes", id: 1 },
              { name: "Omelette", id: 2 },
            ],
          },
          {
            name: "Lunch",
            menuItems: [
              { name: "Grilled Chicken", id: 3 },
              { name: "Caesar Salad", id: 4 },
            ],
          },
        ],
      },
      {
        name: "West Dining Hall",
        menuGroups: [
          {
            name: "Dinner",
            menuItems: [
              { name: "Steak", id: 5 },
              { name: "Mashed Potatoes", id: 6 },
            ],
          },
        ],
      },
    ],
  },
  {
    diningHallGroup: "South Campus Dining",
    diningHalls: [
      {
        name: "East Dining Hall",
        menuGroups: [
          {
            name: "Brunch",
            menuItems: [
              { name: "French Toast", id: 7 },
              { name: "Fruit Salad", id: 8 },
            ],
          },
        ],
      },
    ],
  },
];

// Menu Item Page Component
function MenuItemPage({ id }: { id: number }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [myImageKey, setImageKey] = useState("");
  //const [retrievedImage, setRetrievedImage] = useState<string | null>(null);
  const [retrievedImages, setRetrievedImages] = useState<string[] | null>(null);
  const [gottenImages, setGottenImages] = useState<string[] | null>(null);
  // Find the menu item by ID
  const menuItem = data
    .flatMap((group) => group.diningHalls)
    .flatMap((hall) => hall.menuGroups)
    .flatMap((group) => group.menuItems)
    .find((item) => item.id === id);

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
      alert("Please select a file first!");
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
      setImageKey(result.fileKey); // Extract the key from the URL

      if (result) {
        const response2 = await fetch(
          `http://localhost:3000/api/addImage/${menuItem.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: result.fileKey,
            }),
          }
        );
        const result2 = await response2.json();
        console.log(result2);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleNewEntry = async () => {
    //first see if the entry with proper id already exists
    const response = await fetch(
      `http://localhost:3000/api/getItem/${menuItem?.id}`
    );
    console.log(menuItem?.id);

    const result = await response.json();
    console.log("handle new entry", result);
    if (result.item !== null) {
      console.log("Entry already exists");
      return;
    } else {
      console.log("Entry does not exist, creating new entry");
      const response = await fetch("http://localhost:3000/api/post", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          group: "temp",
          restaurant: "temp",
          category: "temp",
          subcategory: "temp",
          item: menuItem?.name,
          image: [],
          id: menuItem?.id,
        }),
      });

      const result = await response.json();
      console.log("handle new entry", result);
    }
  };

  // Handle image retrieval
  const handleRetrieve = async (myImageKey: string) => {
    try {
      const response = await fetch(`http://localhost:3000/image/${myImageKey}`);
      const data = await response.json();

      if (data.url) {
        return data.url; // Return the image URL
      } else {
        console.error("Failed to retrieve image URL");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving image:", error);
      return null;
    }
  };

  const handleRetrieveAll = async () => {
    if (!menuItem) {
      return;
    }

    // First, get the list of image keys
    const imageKeyList = await getImageKeyList();

    // Then, fetch all the images based on those keys
    const imageListPromises = imageKeyList.map((imageKey: string) =>
      handleRetrieve(imageKey)
    );

    // Wait for all the image URLs to be resolved
    const imageList = await Promise.all(imageListPromises);

    // Filter out any null values in case any fetch failed
    const validImages = imageList.filter((image) => image !== null) as string[];

    setGottenImages(validImages);
  };

  const getImageKeyList = async () => {
    console.log(menuItem?.name);
    const response = await fetch(
      `http://localhost:3000/api/getItem/${menuItem?.name}`
    );
    const data = await response.json();
    console.log("get image key list", data);
    if (data.success) {
      const imageKeyList = data.item.image;
      setRetrievedImages(imageKeyList);
      return imageKeyList;
    } else {
      alert("Failed to retrieve image urls");
    }
  };

  useEffect(() => {
    if (menuItem) {
      handleNewEntry().then(() => {
        handleRetrieveAll();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!menuItem) {
    return <div>Menu Item not found</div>;
  }

  return (
    <div>
      <h1>{menuItem.name}</h1>
      {/* You can add more details here */}
      <p>This is the detail page for {menuItem.name}.</p>
      <img
        src="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg"
        style={{ width: "200px", height: "200px" }}
      />
      <h1>Upload Image to S3</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {uploadResult && (
        <div>
          <h3>Upload Result:</h3>
          <p>File URL: {uploadResult}</p>
        </div>
      )}

      {/* <h2>Retrieve Image</h2>
      <input
        type="text"
        value={imageKey}
        onChange={(e) => setImageKey(e.target.value)}
        placeholder="Enter image key"
      />
      <button onClick={handleRetrieve}>Retrieve Image</button>

      {retrievedImage && (
        <span>
          <h3>Retrieved Image:</h3>
          <img
            src={retrievedImage}
            alt="Retrieved"
            style={{ width: "200px" }}
          />
        </span>
      )} */}

      {gottenImages && (
        <div>
          <h2>Retrieved Images:</h2>
          {gottenImages.map((imageKey, index) => (
            <img
              key={index}
              src={imageKey}
              alt={`Retrieved ${index}`}
              style={{ width: "200px", margin: "10px" }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DiningHallMenu() {
  return (

    <div className="container">

      <Form />
    </div>

    // <div className="container">
    //   {data.map((group, i) => (
    //     <div key={i}>
    //       <h2>{group.diningHallGroup}</h2>
    //       {group.diningHalls.map((hall, j) => (
    //         <div key={j} style={{ marginLeft: "20px" }}>
    //           <h3>{hall.name}</h3>
    //           {hall.menuGroups.map((menuGroup, k) => (
    //             <div key={k} style={{ marginLeft: "40px" }}>
    //               <h4>{menuGroup.name}</h4>
    //               <ul>
    //                 {menuGroup.menuItems.map((item, l) => (
    //                   <li key={l}>
    //                     <Link to={`/menu-item/${item.id}`}>{item.name}</Link>
    //                   </li>
    //                 ))}
    //               </ul>
    //             </div>
    //           ))}
    //         </div>
    //       ))}
    //     </div>
    //   ))}
    // </div>
  );
}
// App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DiningHallMenu />} />
        <Route path="/menu-item/:id" element={<MenuItemPageWrapper />} />
      </Routes>
    </Router>
  );
}

// Wrapper for using useParams hook inside MenuItemPage
function MenuItemPageWrapper() {
  const { id } = useParams();
  return <MenuItemPage id={Number(id)} />;
}

export default App;
