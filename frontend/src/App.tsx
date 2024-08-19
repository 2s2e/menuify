import "./App.css";
import React from "react";
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
  // Find the menu item by ID
  const menuItem = data
    .flatMap((group) => group.diningHalls)
    .flatMap((hall) => hall.menuGroups)
    .flatMap((group) => group.menuItems)
    .find((item) => item.id === id);

  if (!menuItem) {
    return <div>Menu Item not found</div>;
  }

  return (
    <div>
      <h1>{menuItem.name}</h1>
      {/* You can add more details here */}
      <p>This is the detail page for {menuItem.name}.</p>
    </div>
  );
}

function DiningHallMenu() {
  return (
    <div>
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
