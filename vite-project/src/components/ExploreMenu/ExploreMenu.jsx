import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

/**
 * ExploreMenu component
 *
 * @param {object} props - Component props
 * @param {string} props.category - Current category
 * @param {function} props.setCategory - Function to set category
 * @returns {JSX.Element} ExploreMenu component
 */
const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of
        dishes crafted with the finest ingredients and culinary
        expertise. Our mission is to satisfy your cravings and elevate
        your dining experience, one delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item) => (
          <div
            onClick={() =>
              setCategory((prev) => (prev === item.menu_name ? "All" : item.menu_name))
            }
            key={item.menu_name}
            className="explore-menu-list-item"
          >
            <img
              className={category === item.menu_name ? "active" : ""}
              src={item.menu_image}
              alt={item.menu_name}
            />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;