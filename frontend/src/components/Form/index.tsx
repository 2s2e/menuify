import React, {useState, useEffect, useRef} from 'react';
import classNames from "classnames";
import Dropdown from '../Dropdown';
import diningHallGroupMapping from '../../data/diningHallGroupMapping'
import './index.less';

interface DiningHall {
  id: string,
  name: string
}

const Form: React.FC = () => {

  const [selectedDHG, setSelectedDHG] = useState<String>("")
  const [selectedDH, setSelectedDH] = useState<String>("")
  const [selectedMeal, setMeal] = useState<String>("")
  const [file, setFile] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [imageKey, setImageKey] = useState("");
  const [menuItem, setMenuItem] = useState<String>("");
  const [comment, setComment] = useState<String>("")
  const [selectedDHItems,setSelectedDHItems] = useState<DiningHall[]>([])
  const prevSelectedDHRef = useRef<DiningHall[]>([]);

  const diningHallGroup = [
    {id: '64', name: '64 Degree'},
    {id: '18', name: 'Ventanas'},
    {id: '24', name: 'Canyon Vista'},
    {id: '15', name: 'Club Med'},
    {id: '11', name: 'Foodworx'},
    {id: '05', name: 'Oceanview'},
    {id: '01', name: 'Pines'},
    {id: '37', name: 'Sixth College'},
    {id: '27', name: 'The Bistro'},
    {id: '21', name: 'Northside Deli at Seventh Market'},
    {id: '32', name: 'Roots'}
  ]

  const meal = [
    {id: "1", name: "Breakfast"},
    {id: "2", name: "Brunch"},
    {id: "3", name: "Lunch"},
    {id: "4", name: "Dinner"},
    {id: "5", name: "Dessert"},
  ]  
  
  
  useEffect( () => {
    if( selectedDHG ){
      setSelectedDHItems(diningHallGroupMapping[selectedDHG])
      setSelectedDH("Select")

    }    
  }
  ,[selectedDHG])




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

  return (
    <div>
      <form>

        <h2>Upload a Foodie Photo 📷</h2>


          <label>Dining Hall Group: </label>  
          <Dropdown id={"1"} data={diningHallGroup} onSelect={setSelectedDHG}/>

          <br/>

          <label>Dining Hall: </label>  
          <Dropdown id={"2"} data={selectedDHItems} onSelect={setSelectedDH} title={selectedDHItems.find((item) => item.id === selectedDH)?.name || "Select" } />

          <br/>

          <label>Meal Type: </label>  
          <Dropdown id={"3"} data={meal} />

          <br/>

          <label>Menu Item: </label>  <br/>
          <input type="text" className="TextInput" onChange={()=>setMenuItem()} />

          <br/><br/>

          <label>Photo: </label>  <br/>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload}>Upload</button>

          <br/>

          {uploadResult && (
            <div>
              <h3>Upload Result:</h3>
              <p>File URL: {uploadResult}</p>
            </div>
          )}



          <br/>

          <label>Commentary: </label>  <br/>
          {/* <input type="paragraph" className="TextInput" onChange={()=>setComment()} /> */}
          <textarea className="TextInput" placeholder="image includes omelette and matcha :)" onChange={()=>setComment()}></textarea>



          


          
          {/* <input type="text" id="fname" name="fname" autocomplete="off"/> */}
        </form>
    </div>
  );
};

export default Form;