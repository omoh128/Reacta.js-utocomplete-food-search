import React from "react";

import "./style.scss";
import Popup from "./popup";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          foods: [],
        };
      }
      //Async keyword for working with Promises.
      async fetchData() {
        //Use ES6 fetch function to get json 
        const foods = await fetch("/resources/food.json").catch(err => {
          this.setError("Cannot Load Food Data from Server!");
        });
        //Set foods in the state
        this.setState({ foods: (await foods.json()).foods });
      }
      
      //Fetch data when the component is firstly mounted 
      componentDidMount() {
        //Fetch & hold data on the state
        this.fetchData();
      }
      searchFood(keyword) {
        //Get foods array list 
        const { foods } = this.state;
        //Make sure to safely Escape keyword since it is coming from user's input
        keyword = RegExp.escape(keyword.toLowerCase());
        /*We generate a Regular Expression from the input keyword.
          The Regex allows for having at least one character matched from the actual food name.
          This way we can add autocomplete functionality.
        */
        const pattern = `[[a-zA-Z\]*${keyword}[[a-zA-Z\]*`;
        //Generate a Regex instance from string pattern
        const matchRegex = new RegExp(pattern);
        //Filter found foods that matches the current Regex
        const foundFoods = foods.filter(item =>
          matchRegex.test(item.name.toLowerCase())
        );
        //Set found foods on the state.
        this.setState({ foundFoods });
      }

      onInputChange(e) {
        const keyword = e.target.value;
        this.searchFood(keyword);
      }
      
      onInput(e) {
        if (e.target.value !== "") this.showPopup();
        else this.hidePopup();
      }
      
      showPopup() {
        this.setState({ isPopupOpen: true });
      }
      
      hidePopup() {
        this.setState({ isPopupOpen: false });
      }
      setError(msg) {
        this.setState(prevState => ({
          errors: [...prevState.errors, msg],
          isError: true
        }));
      }
      
      clearAllErrors() {
        this.setState({ errors: [], isError: false });
      }
      render() {
        const { isPopupOpen, foundFoods } = this.state;
        return (
          <div className="search">
            <div className="search-container">
              <div className="title">Type Food Name</div>
              <div className="content">
                <input
                  type="text"
                  placeholder="Food"
                  onInput={this.onInput.bind(this)}
                  onChange={this.onInputChange.bind(this)}
                />
                <Popup isOpen={isPopupOpen} items={foundFoods} />
              </div>
            </div>
          </div>
        );
      }
    }    