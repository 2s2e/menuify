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
  });

  return (
    <div>
      <h1>Item List</h1>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <p>{item.group}</p>
            <p>{item.restaurant}</p>
            <p>{item.category}</p>
            <p>{item.item}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ItemList;
