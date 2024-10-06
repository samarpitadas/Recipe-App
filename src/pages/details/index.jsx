import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdArrowForward } from 'react-icons/md';

export default function Details() {
  const { id } = useParams();
  console.log(useParams())
  const {
    recipeDetailsData,
    setRecipeDetailsData,
    favoritesList,
    handleAddToFavorite,
  } = useContext(GlobalContext);

  useEffect(() => {
    async function getRecipeDetails() {
      const response = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
      );
      const data = await response.json();

      console.log(data);
      if (data?.data) {
        setRecipeDetailsData(data?.data);
      }
    }

    getRecipeDetails();
  }, []);

  console.log(recipeDetailsData, "recipeDetailsData");

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="row-start-2 lg:row-start-auto">
        <div className="h-96 overflow-hidden rounded-xl group">
          <img
            src={recipeDetailsData?.recipe?.image_url}
            className="w-full h-full object-cover block group-hover:scale-105 duration-300"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-sm text-cyan-700 font-medium">
          {recipeDetailsData?.recipe?.publisher}
        </span>
        <span className="font-bold text-2xl truncate text-black flex justify-between items-center">
          {recipeDetailsData?.recipe?.title}
          <button
            onClick={() => handleAddToFavorite(recipeDetailsData?.recipe)}
            className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block text-gray-800 transition-transform duration-300 hover:scale-105 flex items-center"
          >
            {favoritesList && favoritesList.length > 0 && favoritesList.findIndex(
              (item) => item.id === recipeDetailsData?.recipe?.id
            ) !== -1 ? (
              <>
                <FaHeart className="mr-2 text-pink-500 text-3xl" />
              </>
            ) : (
              <>
                <FaRegHeart className="mr-2 text-gray-800 text-3xl" />
              </>
            )}
          </button>
        </span>
        <div>
          Cooking Time: {recipeDetailsData?.recipe?.cooking_time} min |
          Servings: {recipeDetailsData?.recipe?.servings}
        </div>
        <div className="mt-5">
          <span className="text-2xl font-semibold text-black">
            Ingredients:
          </span>
          <ul className="flex flex-col gap-3 mt-3">
            {recipeDetailsData?.recipe?.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center text-lg text-black">
                <span className="mr-2 text-xl font-medium">
                  ~ {ingredient.quantity} {ingredient.unit}
                </span>
                <span className="text-xl font-medium"> {ingredient.description}</span>
              </li>
            ))}
          </ul>
        </div>
        <h4 className="text-lg font-semibold text-gray-800 mb-4 items-center">
          You can check cooking instructions from
          <span className="font-bold text-pink-500">
            {` ${recipeDetailsData?.recipe?.publisher}`}
          </span>'s website:
          <a
            href={recipeDetailsData?.recipe?.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition"
          >
            Directions
            <MdArrowForward className="ml-2" /> {/* React Icon */}
          </a>
        </h4>
      </div>
    </div>
  );
}
