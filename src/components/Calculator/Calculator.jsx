import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculatorPublic } from '../redux/foodSlice'; // Asigură-te că acest path este corect
import { getIsLoggedIn } from '../redux/selectors';
import styles from './Calculator.module.css';
import { IoReturnDownBack } from 'react-icons/io5';

function Calculator({ onStartLosingWeight }) {
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [desiredWeight, setDesiredWeight] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [calorieIntake, setCalorieIntake] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);
  const { forbiddenFoods } = useSelector(state => state.food);

  const handleSubmit = e => {
    e.preventDefault();

    const result = Math.round((10 * desiredWeight) + (6.25 * height) - (5 * age) + 5);
    setCalorieIntake(result);

    dispatch(calculatorPublic({
      height,
      age,
      desiredWeight,
      bloodType
    })).then(action => {
      if (action.type === 'food/calculatorPublic/fulfilled') {
        setFormSubmitted(true);

        if (isLoggedIn) {
          // Handling for logged-in users (if needed)
        } else if (onStartLosingWeight) {
          onStartLosingWeight(result);
        }
      } else if (action.type === 'food/calculatorPublic/rejected') {
        console.error('Failed to fetch calculator data:', action.payload);
      }
    });
  };

  const handleReset = () => {
    setHeight('');
    setAge('');
    setCurrentWeight('');
    setDesiredWeight('');
    setBloodType('');
    setCalorieIntake(null);
    setFormSubmitted(false);
  };

  return (
    <div className={styles.calculatorContainer}>
      {!formSubmitted && (
        <div className={styles.calculatorComponent}>
          <span>
            <h2>Calculate your daily calorie intake right now</h2>
          </span>
          <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <div className={styles.formRow}>
                <label>Height *</label>
                <input
                  type="number"
                  placeholder="In cm"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Fill your Age"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Current weight *</label>
                <input
                  type="number"
                  placeholder="In kg"
                  value={currentWeight}
                  onChange={e => setCurrentWeight(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Desired weight *</label>
                <input
                  type="number"
                  placeholder="In kg"
                  value={desiredWeight}
                  onChange={e => setDesiredWeight(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <label>Blood type:</label>
                <div className={styles.radioGroup}>
                  {['O', 'A', 'B', 'AB'].map(type => (
                    <label className={styles.radioOption} key={type}>
                      <input
                        type="radio"
                        name="bloodType"
                        value={type}
                        onChange={(e) => setBloodType(e.target.value)}
                      />
                      <span className={styles.customRadio}></span> {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <button type="submit" className={styles.buttonCalculator}>
                Start losing weight
              </button>
            </div>
          </form>
        </div>
      )}

      {formSubmitted && (
        <div>
          <div className={styles.backContainer}>
            <IoReturnDownBack
              onClick={handleReset}
              className={styles.returnIcon}
            />
          </div>
          <div className={styles.resultContainer}>
            <div className={styles.resultTitle}>
              <h3>Your recommended daily calorie intake is:</h3>
            </div>

            <div className={styles.resultValue}>
              {calorieIntake !== null ? calorieIntake : 'N/A'} <span>kcal</span>
            </div>

            <div className={styles.resultLine}></div>

            <div className={styles.resultTitle}>
              <h3>Forbidden foods for your blood type:</h3>
            </div>

            <ul>
              {forbiddenFoods.length > 0 ? (
                forbiddenFoods.slice(0, 5).map((food, index) => (
                  <li key={food._id}>{food.title}</li>
                ))
              ) : (
                <li>No forbidden foods found</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;
