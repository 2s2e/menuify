import axios from "axios";
import { useEffect, useState } from "react";
import { diningHallGroup, meal, diningHallGroupMapping } from '../../metadata/data';


interface Review {
  comments: string;
}

interface Item {
  id: number;
  group: string;
  category: string;
  restaurant: string;
  item: string;
}


const ItemList = () => {
  //list of items in the database
  const [items, setItems] = useState<Item[]>([]);
  //on page loading, fetch all items from the database

  useEffect(() => {
    // Fetch all items from the database
    axios.get(`http://localhost:3000/api/getAllItems/`).then((res) => {
      console.log("res.data.item from /api/getItem in form: ", res.data);
      //new array of Items
      const newItems: Item[] = res.data.items.map((item: any) => ({
        id: item.id,
        group: item.group,
        category: item.category,
        restaurant: item.restaurant,
        item: item.item,
      }));
      setItems(newItems);
      console.log("newItems: ", newItems);
    });
  }, []);

  return (
    <div style={{ padding: "5vh 5vw"}}>
      <h1>Item List</h1>

      <div style={{ listStyleType: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "1rem"}}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "20vw",
              height: "35vh",
              backgroundColor: "#b5e2ff" ,
              position: "relative"
            }}
          >
            <p>
              <strong>Dining Hall Group:</strong> {diningHallGroup.find(hall => hall.id === item.group)?.name}
            </p>
            <p>
              <strong>Restaurant:</strong> {diningHallGroupMapping[item.group as keyof typeof diningHallGroupMapping].find(i => i.id === item.restaurant)?.name}
            </p>
            <p>
              <strong>Category:</strong> {meal.find( m => m.id === item.category)?.name}
            </p>
            <p>
              <strong>Item:</strong> {item.item}
            </p>

            <button
              onClick={() => {
                window.location.href = `/item/${item.id}`;
              }}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                position: "absolute",
                bottom: "10px"
              }}
            >
              View Reviews
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ItemList;
