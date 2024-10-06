import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';

export const GlobalContext = createContext(null);

export default function GlobalState({ children }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [favoritesList, setFavoritesList] = useState(() => {
    // Load favorites from localStorage on initialization
    const savedFavorites = localStorage.getItem('favoritesList');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true); // Start loading
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`
      );

      const data = await res.json();
      if (data?.data?.recipes) {
        setRecipeList(data?.data?.recipes);
        setLoading(false);
        setSearchParam("");
        navigate('/');
      }
    } catch (e) {
      console.log(e);
      setLoading(false);
      setSearchParam("");
    }
  }

  function handleAddToFavorite(getCurrentItem) {
    console.log(getCurrentItem);
    let cpyFavoritesList = [...favoritesList];
    const index = cpyFavoritesList.findIndex(item => item.id === getCurrentItem.id);

    if (index === -1) {
      // Add the item if it's not already in the favorites list
      cpyFavoritesList.push(getCurrentItem);
    } else {
      // Remove the item if it is already in the favorites list
      cpyFavoritesList.splice(index, 1);
    }

    // Update the state
    setFavoritesList(cpyFavoritesList);

    // Save the updated favorites list to localStorage
    localStorage.setItem('favoritesList', JSON.stringify(cpyFavoritesList));
  }

  // Log the favorites list
  useEffect(() => {
    console.log(favoritesList, 'favoritesList');
  }, [favoritesList]);

  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        loading,
        recipeList,
        setSearchParam,
        handleSubmit,
        recipeDetailsData,
        setRecipeDetailsData,
        handleAddToFavorite,
        favoritesList
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
