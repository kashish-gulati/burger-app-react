import React from 'react';
import styles from './Burger.module.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const Burger = (props) => {
    let transformdIngredients = Object.keys(props.ingredients).map(igKey => {
        return[...Array(props.ingredients[igKey])].map((_,i) => {
            return <BurgerIngredient key={igKey+i} type={igKey}/>;
        });
    }).reduce((arr,el) => {
        return arr.concat(el);
    },[]);
    console.log(transformdIngredients);

    if(transformdIngredients.length===0){
        transformdIngredients = <p>Please add ingredients</p>;
    }

    return (
        <div className = {styles.Burger}>
            <BurgerIngredient type = 'bread-top'/>
            {transformdIngredients}
            <BurgerIngredient type = 'bread-bottom'/>
        </div>
    );
};

export default Burger;