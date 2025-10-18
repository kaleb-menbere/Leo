import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";

function MyDishes() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const fetchMyDishes = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/dishes/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setDishes(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDishes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 style={{ color: "#FF7A00", textAlign: "center" }}>My Dishes</h2>
      {loading ? <Loader text="Loading dishes" /> : null}
      <div className="dish-list" style={{ marginTop: 12 }}>
        {dishes.map((dish) => (
          <div key={dish.id} className="dish-card">
            <h4>{dish.name}</h4>
            <p>${dish.price}</p>
            {dish.video_url && (
              <video width="240" controls src={dish.video_url} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyDishes;
