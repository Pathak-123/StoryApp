import React, { useState } from "react";
import "../Style/FilterCardsStyle.css";
import AllImage from "../assets/All.png";
import Education from "../assets/Education.jpg";
import FruitsImage from "../assets/Fruits.png";
import MovieImage from "../assets/Movies.png";
import WorldImage from "../assets/World.png";
import MedicalImage from "../assets/Medical.png";

function FilterCards({ onCategoryChange }) {
  const categories = [
    { id: 1, label: "All", imageUrl: AllImage },
    { id: 2, label: "Education", imageUrl: Education },
    { id: 3, label: "Food", imageUrl: FruitsImage },
    { id: 4, label: "Health and fitness", imageUrl: MedicalImage },
    { id: 5, label: "Movies", imageUrl: MovieImage },
    { id: 6, label: "Travel", imageUrl: WorldImage },
  ];
  const [activeCategory, setActiveCategory] = useState(1);

  const handleCardClick = (categoryId, label) => {
    setActiveCategory(categoryId);
    onCategoryChange(label,categoryId);
  };
  return (
    <div className="filter-cards-container">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`filter-card ${
            activeCategory === category.id ? "active" : ""
          }`}
          style={{
            backgroundImage: `url(${category.imageUrl})`,
            backgroundSize: "cover",
          }}
          onClick={() => handleCardClick(category.id, category.label)}
        >
          <div className="overlay"></div>

          <p className="filter-card-text">{category.label}</p>
        </div>
      ))}
    </div>
  );
}

export default FilterCards;
