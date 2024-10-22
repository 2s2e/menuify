import axios from "axios";
import { useEffect, useState } from "react";

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
    <div>
      <h1>Item List</h1>

      <ul style={{ listStyleType: "none", padding: 0 }}>
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Group:</strong> {item.group}
            </p>
            <p>
              <strong>Restaurant:</strong> {item.restaurant}
            </p>
            <p>
              <strong>Category:</strong> {item.category}
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
              }}
            >
              Reviews
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ItemList;
