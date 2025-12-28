import React from "react";
import '../card.css';

const Card = ({ title, value, icon }) => {
  return (
    <div className="card">
      {icon && <div className="icon">{icon}</div>}
      <div>
        <p className="title">{title}</p>
        <p className="value">{value}</p>
      </div>
    </div>
  );
};

const Cards = ({ cards = [] }) => {
  return (
    <div className="cards-container">
      {cards.map((card, i) => (
        <Card key={i} {...card} />
      ))}
    </div>
  );
};

export default Cards;
