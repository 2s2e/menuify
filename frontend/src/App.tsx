import "./App.css";
import React, { ChangeEvent, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useParams,
} from "react-router-dom";

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
  const [imageKey, setImageKey] = useState("");
  const [retrievedImage, setRetrievedImage] = useState<string | null>(null);
  // Find the menu item by ID
  const menuItem = data
    .flatMap((group) => group.diningHalls)
    .flatMap((hall) => hall.menuGroups)
    .flatMap((group) => group.menuItems)
    .find((item) => item.id === id);

  if (!menuItem) {
    return <div>Menu Item not found</div>;
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
      setUploadResult(result.fileUrl);
      setImageKey(result.fileUrl.split("/").pop()); // Extract the key from the URL
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Handle image retrieval
  const handleRetrieve = async () => {
    if (!imageKey) {
      alert("Please enter an image key first!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/image/${imageKey}`);
      const data = await response.json();

      if (data.url) {
        const imageResponse = await fetch(data.url, { mode: "cors" });
        const blob = await imageResponse.blob();
        const imageUrl = URL.createObjectURL(blob);
        setRetrievedImage(imageUrl);
      } else {
        alert("Failed to retrieve image");
      }
    } catch (error) {
      console.error("Error retrieving image:", error);
    }
  };

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

      <h2>Retrieve Image</h2>
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
            style={{ width: "200px", height: "200px" }}
          />
        </span>
      )}
    </div>
  );
}

function DiningHallMenu() {
  return (
    <div className="container">
      {data.map((group, i) => (
        <div key={i}>
          <h2>{group.diningHallGroup}</h2>
          {group.diningHalls.map((hall, j) => (
            <div key={j} style={{ marginLeft: "20px" }}>
              <h3>{hall.name}</h3>
              {hall.menuGroups.map((menuGroup, k) => (
                <div key={k} style={{ marginLeft: "40px" }}>
                  <h4>{menuGroup.name}</h4>
                  <ul>
                    {menuGroup.menuItems.map((item, l) => (
                      <li key={l}>
                        <Link to={`/menu-item/${item.id}`}>{item.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
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
