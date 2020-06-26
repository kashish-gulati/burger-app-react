import React, {Component} from 'react';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';



const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 2,
    bacon: 0.8
}

class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        axios.get('/Ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data})
            })
            .catch( error =>{this.setState({error: true})} );
    }

    updatePurchaseState = (ingredients) =>{
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        })
        .reduce((sum,el) => {
            return sum + el;
        },0);
        this.setState({purchasable: sum>0});
    }
    
    addIngredientHandler = (type) => {
        const updatedCount = this.state.ingredients[type]+1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({ingredients:updatedIngredients,totalPrice:newPrice});
        this.updatePurchaseState(updatedIngredients);
    };

    removeIngredientHandler = (type) => {
        const updatedCount = this.state.ingredients[type]-1;
        if(updatedCount < 0) return;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
        this.setState({ingredients:updatedIngredients,totalPrice:newPrice});
        this.updatePurchaseState(updatedIngredients);
    };

    purchaseHandler = () => {
        this.setState({purchasing:true});
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing:false});
    }
    purchaseContinueHandler = () => {
        //alert('Your Order Will Be Placed');
        this.setState({loading: true})
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Kashish Gulati',
                address:{
                    street:'Teststreet',
                    zipCode: '231233',
                    country: 'India'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json',order)
            .then(response => {
                this.setState({loading:false,purchasing:false});
            })
            .catch(error => {
                this.setState({loading:false,purchasing:false})
            })
    }

    render(){
        const disableInfo = {
            ...this.state.ingredients
        };
        for(let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0;
        }
        

        let burger = this.state.error?<p>Ingredients can't be loaded</p>:<Spinner />;
        let orderSummary = null;
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls
                        ingredientAdded = {this.addIngredientHandler}
                        ingredientRemoved = {this.removeIngredientHandler}
                        disabled = {disableInfo}
                        purchasable = {this.state.purchasable}
                        price = {this.state.totalPrice}
                        ordered = {this.purchaseHandler}
                    />
                </Aux>
            );
            orderSummary =  (
                <OrderSummary 
                    ingredients = {this.state.ingredients}
                    purchaseCancelled = {this.purchaseCancelHandler}
                    purchaseContinued = {this.purchaseContinueHandler}
                    price = {this.state.totalPrice}
                />
            );
        }
        
        if(this.state.loading){
            orderSummary = <Spinner />;
        }

        return (
            <Aux>    
                <Modal 
                    show = {this.state.purchasing}
                    modalClosed = {this.purchaseCancelHandler}    
                >
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder,axios);