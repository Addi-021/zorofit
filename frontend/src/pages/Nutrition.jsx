import { useState } from "react";

function Nutrition() {
  const [food, setFood] = useState("");
  const [quantity, setQuantity] = useState("");
  const [meal, setMeal] = useState("Breakfast");

  const [foods, setFoods] = useState([
    {
      id: 1,
      name: "Oats",
      quantity: 50,
      meal: "Breakfast",
      calories: 190,
      protein: 6,
      carbs: 32,
      fat: 3.5,
    },
    {
      id: 2,
      name: "Greek Yogurt",
      quantity: 200,
      meal: "Breakfast",
      calories: 146,
      protein: 20,
      carbs: 7,
      fat: 4,
    },
  ]);

  const addFood = () => {
    if (!food || !quantity) return;

    const newFood = {
      id: Date.now(),
      name: food,
      quantity: Number(quantity),
      meal,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };

    setFoods([...foods, newFood]);

    setFood("");
    setQuantity("");
  };

  const totalCalories = foods.reduce(
    (total, item) => total + item.calories,
    0
  );

  const totalProtein = foods.reduce(
    (total, item) => total + item.protein,
    0
  );

  const totalCarbs = foods.reduce(
    (total, item) => total + item.carbs,
    0
  );

  const totalFat = foods.reduce(
    (total, item) => total + item.fat,
    0
  );

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Nutrition</h1>
          <p>Track your daily nutrition and meals.</p>
        </div>
      </div>

      {/* Daily Summary */}
      <div className="nutrition-summary">

        <div className="nutrition-card">
          <span>Calories</span>
          <strong>{totalCalories}</strong>
          <small>kcal</small>
        </div>

        <div className="nutrition-card">
          <span>Protein</span>
          <strong>{totalProtein}g</strong>
        </div>

        <div className="nutrition-card">
          <span>Carbs</span>
          <strong>{totalCarbs}g</strong>
        </div>

        <div className="nutrition-card">
          <span>Fat</span>
          <strong>{totalFat}g</strong>
        </div>

      </div>

      {/* Add Food */}
      <div className="nutrition-section">

        <h2>Add Food</h2>

        <div className="nutrition-form">

          <input
            type="text"
            placeholder="Search food..."
            value={food}
            onChange={(e) => setFood(e.target.value)}
          />

          <input
            type="number"
            placeholder="Quantity (g)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <select
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
          >
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>

          <button onClick={addFood}>
            Add Food
          </button>

        </div>

      </div>

      {/* Food Log */}
      <div className="nutrition-section">

        <h2>Today's Food</h2>

        <div className="food-list">

          {foods.map((item) => (
            <div className="food-item" key={item.id}>

              <div>
                <h3>{item.name}</h3>
                <p>
                  {item.quantity}g · {item.meal}
                </p>
              </div>

              <div className="food-nutrients">
                <span>{item.calories} kcal</span>
                <span>{item.protein}g protein</span>
                <span>{item.carbs}g carbs</span>
                <span>{item.fat}g fat</span>
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Nutrition;
