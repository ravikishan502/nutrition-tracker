/* =========================================
   NUTRITRACK - SCRIPT.JS
   PART 1
========================================= */

let appData = JSON.parse(
    localStorage.getItem("nutriTrackData")
) || {
    profile: {
        name: "",
        age: "",
        gender: "",
        height: "",
        currentWeight: "",
        targetWeight: "",
        goal: "loss",
        activityLevel: 1.2
    },

    foods: [],

    water: 0,

    weights: [],

    activity: {
        steps: 0,
        walking: 0,
        workout: 0
    }
};


/* =========================================
   OLD DATA MIGRATION
========================================= */

if (!appData.profile) {
    appData.profile = {
        name: "",
        age: "",
        gender: "",
        height: "",
        currentWeight: "",
        targetWeight: "",
        goal: "loss",
        activityLevel: 1.2
    };
}

if (appData.profile.gender === undefined) {
    appData.profile.gender = "";
}

if (appData.profile.currentWeight === undefined) {
    appData.profile.currentWeight = "";
}

if (appData.profile.activityLevel === undefined) {
    appData.profile.activityLevel = 1.2;
}

if (!Array.isArray(appData.foods)) {
    appData.foods = [];
}

if (!Array.isArray(appData.weights)) {
    appData.weights = [];
}

if (!appData.activity) {
    appData.activity = {
        steps: 0,
        walking: 0,
        workout: 0
    };
}


/* =========================================
   SAVE DATA
========================================= */

function saveData() {

    localStorage.setItem(
        "nutriTrackData",
        JSON.stringify(appData)
    );
}


/* =========================================
   DATE
========================================= */

function updateDate() {

    const date = new Date();

    const dateElement =
        document.getElementById("currentDate");

    if (!dateElement) return;

    dateElement.textContent =
        date.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        });
}


/* =========================================
   PROFILE
========================================= */

function loadProfile() {

    const profile = appData.profile;

    document.getElementById("userName").value =
        profile.name || "";

    document.getElementById("age").value =
        profile.age || "";

    document.getElementById("gender").value =
        profile.gender || "";

    document.getElementById("height").value =
        profile.height || "";

    document.getElementById("currentWeight").value =
        profile.currentWeight || "";

    document.getElementById("weightGoal").value =
        profile.targetWeight || "";

    document.getElementById("goal").value =
        profile.goal || "loss";

    const activityLevel =
        document.getElementById("activityLevel");

    if (activityLevel) {

        activityLevel.value =
            String(
                profile.activityLevel || 1.2
            );
    }

    const calculatorActivity =
        document.getElementById(
            "calculatorActivity"
        );

    if (calculatorActivity) {

        calculatorActivity.value =
            String(
                profile.activityLevel || 1.2
            );
    }

    calculateHealthMetrics();
}


/* =========================================
   SAVE PROFILE
========================================= */

function saveProfile() {

    const userName =
        document.getElementById("userName");

    const age =
        document.getElementById("age");

    const gender =
        document.getElementById("gender");

    const height =
        document.getElementById("height");

    const currentWeight =
        document.getElementById("currentWeight");

    const weightGoal =
        document.getElementById("weightGoal");

    const goal =
        document.getElementById("goal");

    appData.profile.name =
        userName ? userName.value.trim() : "";

    appData.profile.age =
        age ? Number(age.value) || 0 : 0;

    appData.profile.gender =
        gender
            ? gender.value.toLowerCase()
            : "";

    appData.profile.height =
        height ? Number(height.value) || 0 : 0;

    appData.profile.currentWeight =
        currentWeight
            ? Number(currentWeight.value) || 0
            : 0;

    appData.profile.targetWeight =
        weightGoal
            ? Number(weightGoal.value) || 0
            : 0;

    appData.profile.goal =
        goal ? goal.value : "loss";


    /* Activity Level */
    const activityLevel =
        document.getElementById(
            "activityLevel"
        );

    if (activityLevel) {

        appData.profile.activityLevel =
            Number(activityLevel.value) || 1.2;

    } else {

        appData.profile.activityLevel = 1.2;
    }


    /* Starting Weight */
    if (
        appData.profile.currentWeight > 0 &&
        !localStorage.getItem(
            "nutriStartingWeight"
        )
    ) {

        localStorage.setItem(
            "nutriStartingWeight",
            appData.profile.currentWeight
        );
    }


    /* Save */
    saveData();


    /* Update everything */
    calculateHealthMetrics();

    updateGoal();

    updateNutrition();


    alert(
        "Profile saved successfully!"
    );
}




/* =========================================
   BMI
========================================= */

function calculateBMI(
    height,
    weight
) {

    if (
        !height ||
        !weight ||
        height <= 0 ||
        weight <= 0
    ) {

        return null;
    }

    const heightInMeters =
        height / 100;

    return (
        weight /
        (
            heightInMeters *
            heightInMeters
        )
    );
}


/* =========================================
   BMI CATEGORY
========================================= */

function getBMICategory(bmi) {

    if (bmi === null) {

        return "Enter height and weight";
    }

    if (bmi < 18.5) {

        return "Underweight";
    }

    if (bmi < 25) {

        return "Normal range";
    }

    if (bmi < 30) {

        return "Overweight";
    }

    return "Obesity range";
}


/* =========================================
   BMR
   Mifflin-St Jeor Equation
========================================= */

function calculateBMR(
    age,
    height,
    weight,
    gender
) {

    if (
        !age ||
        !height ||
        !weight ||
        !gender
    ) {

        return null;
    }

    if (
        age <= 0 ||
        height <= 0 ||
        weight <= 0
    ) {

        return null;
    }


    let bmr;


    if (gender === "male") {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) +
            5;

    }

    else if (gender === "female") {

        bmr =
            (10 * weight) +
            (6.25 * height) -
            (5 * age) -
            161;

    }

    else {

        return null;
    }


    return bmr;
}


/* =========================================
   BMI + BMR + TDEE
========================================= */

function calculateHealthMetrics() {

    const age =
        Number(
            document.getElementById(
                "age"
            ).value
        );

    const height =
        Number(
            document.getElementById(
                "height"
            ).value
        );

    const weight =
        Number(
            document.getElementById(
                "currentWeight"
            ).value
        );

    const gender =
        document.getElementById(
            "gender"
        ).value;


    const calculatorActivity =
        document.getElementById(
            "calculatorActivity"
        );

    const activity =
        calculatorActivity
            ? Number(
                calculatorActivity.value
              )
            : 1.2;


    /* BMI */

    const bmi =
        calculateBMI(
            height,
            weight
        );


    const bmiValue =
        document.getElementById(
            "bmiValue"
        );

    const bmiCategory =
        document.getElementById(
            "bmiCategory"
        );


    if (bmi !== null) {

        bmiValue.textContent =
            bmi.toFixed(1);

        bmiCategory.textContent =
            getBMICategory(bmi);

    }

    else {

        bmiValue.textContent =
            "--";

        bmiCategory.textContent =
            "Enter height and weight";
    }


    /* BMR */

    const bmr =
        calculateBMR(
            age,
            height,
            weight,
            gender
        );


    const bmrValue =
        document.getElementById(
            "bmrValue"
        );

    const calculatorBMR =
        document.getElementById(
            "calculatorBMR"
        );


    if (bmr !== null) {

        const roundedBMR =
            Math.round(bmr);

        bmrValue.textContent =
            roundedBMR;

        calculatorBMR.textContent =
            roundedBMR +
            " kcal";

    }

    else {

        bmrValue.textContent =
            "--";

        calculatorBMR.textContent =
            "-- kcal";
    }


    /* TDEE */

    const tdeeValue =
        document.getElementById(
            "tdeeValue"
        );

    const calculatorTDEE =
        document.getElementById(
            "calculatorTDEE"
        );

    const activityMultiplier =
        document.getElementById(
            "activityMultiplier"
        );


    if (
        bmr !== null &&
        activity > 0
    ) {

        const tdee =
            bmr * activity;

        const roundedTDEE =
            Math.round(tdee);


        tdeeValue.textContent =
            roundedTDEE;

        calculatorTDEE.textContent =
            roundedTDEE +
            " kcal";

        activityMultiplier.textContent =
            activity.toFixed(3);


        updateCalorieTarget(
            roundedTDEE
        );

    }

    else {

        tdeeValue.textContent =
            "--";

        calculatorTDEE.textContent =
            "-- kcal";

        activityMultiplier.textContent =
            "--";
    }
}


/* =========================================
   CALORIE TARGET
========================================= */

function getCalorieTarget(tdee) {

    if (
        !tdee ||
        tdee <= 0
    ) {

        return 2200;
    }


    const goal =
        document.getElementById(
            "goal"
        ).value;


    if (goal === "loss") {

        return Math.max(
            1200,
            Math.round(
                tdee - 500
            )
        );
    }


    if (goal === "gain") {

        return Math.round(
            tdee + 250
        );
    }


    return Math.round(tdee);
}


/* =========================================
   UPDATE CALORIE TARGET
========================================= */

function updateCalorieTarget(tdee) {

    const target =
        getCalorieTarget(tdee);


    const targetElement =
        document.getElementById(
            "calorieTarget"
        );


    if (targetElement) {

        targetElement.textContent =
            target;
    }


    const total =
        calculateNutrition();


    updateProgress(
        "calorieProgress",
        total.calories,
        target
    );
}


/* =========================================
   ADD FOOD
========================================= */

function addFood() {

    const name =
        document.getElementById(
            "foodName"
        ).value.trim();


    const meal =
        document.getElementById(
            "mealType"
        ).value;


    const quantity =
        Number(
            document.getElementById(
                "foodQuantity"
            ).value
        ) || 0;


    const calories =
        Number(
            document.getElementById(
                "foodCalories"
            ).value
        ) || 0;


    const protein =
        Number(
            document.getElementById(
                "foodProtein"
            ).value
        ) || 0;


    const carbs =
        Number(
            document.getElementById(
                "foodCarbs"
            ).value
        ) || 0;


    const fat =
        Number(
            document.getElementById(
                "foodFat"
            ).value
        ) || 0;


    const fiber =
        Number(
            document.getElementById(
                "foodFiber"
            ).value
        ) || 0;


    if (!name) {

        alert(
            "Please enter food name."
        );

        return;
    }


    const food = {

        id: Date.now(),

        name: name,

        meal: meal,

        quantity: quantity,

        calories: calories,

        protein: protein,

        carbs: carbs,

        fat: fat,

        fiber: fiber
    };


    appData.foods.push(food);


    saveData();

    clearFoodForm();

    renderFoods();

    updateNutrition();
}


/* =========================================
   CLEAR FOOD FORM
========================================= */

function clearFoodForm() {

    document.getElementById(
        "foodName"
    ).value = "";


    document.getElementById(
        "foodQuantity"
    ).value = "";


    document.getElementById(
        "foodCalories"
    ).value = "";


    document.getElementById(
        "foodProtein"
    ).value = "";


    document.getElementById(
        "foodCarbs"
    ).value = "";


    document.getElementById(
        "foodFat"
    ).value = "";


    document.getElementById(
        "foodFiber"
    ).value = "";
}


/* =========================================
   RENDER FOODS
========================================= */

function renderFoods() {

    const mealIds = {

        "Breakfast": "Breakfast",

        "Morning Snack": "MorningSnack",

        "Lunch": "Lunch",

        "Pre Workout": "PreWorkout",

        "Post Workout": "PostWorkout",

        "Evening Snack": "EveningSnack",

        "Dinner": "Dinner"
    };


    Object.values(mealIds).forEach(
        id => {

            const element =
                document.getElementById(id);

            if (element) {

                element.innerHTML =
                    '<p class="food-info">No food added yet.</p>';
            }
        }
    );


    const grouped = {};


    appData.foods.forEach(
        food => {

            if (!grouped[food.meal]) {

                grouped[food.meal] = [];
            }

            grouped[food.meal].push(food);
        }
    );


    Object.keys(grouped).forEach(
        meal => {

            const container =
                document.getElementById(
                    mealIds[meal]
                );


            if (!container) return;


            container.innerHTML = "";


            grouped[meal].forEach(
                food => {

                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "food-item";


                    item.innerHTML = `

                        <div>

                            <strong>
                                ${escapeHTML(food.name)}
                            </strong>

                            <span class="food-info">

                                ${food.quantity}g/ml •

                                ${food.calories} kcal •

                                Protein ${food.protein}g •

                                Carbs ${food.carbs}g •

                                Fat ${food.fat}g •

                                Fiber ${food.fiber}g

                            </span>

                        </div>


                        <button
                            class="delete-food"
                            onclick="deleteFood(${food.id})">

                            Delete

                        </button>
                    `;


                    container.appendChild(item);
                }
            );
        }
    );
}


/* =========================================
   DELETE FOOD
========================================= */

function deleteFood(id) {

    appData.foods =
        appData.foods.filter(
            food => food.id !== id
        );


    saveData();

    renderFoods();

    updateNutrition();
}


/* =========================================
   CALCULATE NUTRITION
========================================= */

function calculateNutrition() {

    let calories = 0;

    let protein = 0;

    let carbs = 0;

    let fat = 0;

    let fiber = 0;


    appData.foods.forEach(
        food => {

            calories +=
                Number(
                    food.calories
                ) || 0;

            protein +=
                Number(
                    food.protein
                ) || 0;

            carbs +=
                Number(
                    food.carbs
                ) || 0;

            fat +=
                Number(
                    food.fat
                ) || 0;

            fiber +=
                Number(
                    food.fiber
                ) || 0;
        }
    );


    return {

        calories,

        protein,

        carbs,

        fat,

        fiber
    };
}


/* =========================================
   UPDATE NUTRITION
========================================= */

function updateNutrition() {

    const total =
        calculateNutrition();


    document.getElementById(
        "totalCalories"
    ).textContent =
        Math.round(
            total.calories
        );


    document.getElementById(
        "totalProtein"
    ).textContent =
        total.protein.toFixed(1);


    document.getElementById(
        "totalCarbs"
    ).textContent =
        total.carbs.toFixed(1);


    document.getElementById(
        "totalFat"
    ).textContent =
        total.fat.toFixed(1);


    document.getElementById(
        "totalFiber"
    ).textContent =
        total.fiber.toFixed(1);


    let calorieTarget = 2200;


    const age =
        Number(
            appData.profile.age
        );

    const height =
        Number(
            appData.profile.height
        );

    const weight =
        Number(
            appData.profile.currentWeight
        );

    const gender =
        appData.profile.gender;

    const activity =
        Number(
            appData.profile.activityLevel
        );


    const bmr =
        calculateBMR(
            age,
            height,
            weight,
            gender
        );


    if (bmr !== null) {

        const tdee =
            bmr * activity;

        calorieTarget =
            getCalorieTarget(
                tdee
            );
    }


    document.getElementById(
        "calorieTarget"
    ).textContent =
        calorieTarget;


    updateProgress(
        "calorieProgress",
        total.calories,
        calorieTarget
    );


    updateProgress(
        "proteinProgress",
        total.protein,
        120
    );


    updateProgress(
        "carbProgress",
        total.carbs,
        250
    );


    updateProgress(
        "fatProgress",
        total.fat,
        70
    );


    updateProgress(
        "fiberProgress",
        total.fiber,
        30
    );


    document.getElementById(
        "reportCalories"
    ).textContent =
        Math.round(
            total.calories
        ) +
        " kcal";


    document.getElementById(
        "reportProtein"
    ).textContent =
        total.protein.toFixed(1) +
        " g";


    document.getElementById(
        "reportCarbs"
    ).textContent =
        total.carbs.toFixed(1) +
        " g";


    document.getElementById(
        "reportFat"
    ).textContent =
        total.fat.toFixed(1) +
        " g";
}


/* =========================================
   PART 1 ENDS HERE
   PART 2 KO ISKE JUST BAAD PASTE KARNA
========================================= */
/* =========================================
   NUTRITRACK - SCRIPT.JS
   PART 2
========================================= */


/* =========================================
   PROGRESS
========================================= */

function updateProgress(
    id,
    value,
    target
) {

    const element =
        document.getElementById(id);

    if (!element || !target) {
        return;
    }

    let percentage =
        (value / target) * 100;

    percentage =
        Math.min(
            Math.max(
                percentage,
                0
            ),
            100
        );

    element.style.width =
        percentage + "%";
}


/* =========================================
   WATER
========================================= */

function addWater(amount) {

    appData.water += amount;

    if (appData.water > 10000) {

        appData.water = 10000;
    }

    saveData();

    updateWater();
}


function resetWater() {

    appData.water = 0;

    saveData();

    updateWater();
}


function updateWater() {

    const waterAmount =
        document.getElementById(
            "waterAmount"
        );

    if (!waterAmount) {
        return;
    }


    waterAmount.textContent =
        appData.water;


    updateProgress(
        "waterProgress",
        appData.water,
        3000
    );


    const reportWater =
        document.getElementById(
            "reportWater"
        );

    if (reportWater) {

        reportWater.textContent =
            appData.water +
            " ml";
    }
}


/* =========================================
   WEIGHT
========================================= */

function addWeight() {

    const value =
        Number(
            document.getElementById(
                "weightInput"
            ).value
        );


    const time =
        document.getElementById(
            "weightTime"
        ).value;


    if (!value || value <= 0) {

        alert(
            "Please enter a valid weight."
        );

        return;
    }


    const entry = {

        id: Date.now(),

        date:
            new Date().toLocaleDateString(
                "en-IN"
            ),

        time: time,

        weight: value
    };


    appData.weights.push(
        entry
    );


    if (
        !appData.profile.currentWeight ||
        appData.profile.currentWeight <= 0
    ) {

        appData.profile.currentWeight =
            value;


        const currentWeight =
            document.getElementById(
                "currentWeight"
            );


        if (currentWeight) {

            currentWeight.value =
                value;
        }
    }


    saveData();


    document.getElementById(
        "weightInput"
    ).value = "";


    renderWeights();

    updateGoal();

    calculateHealthMetrics();

    updateNutrition();
}


/* =========================================
   RENDER WEIGHTS
========================================= */

function renderWeights() {

    const history =
        document.getElementById(
            "weightHistory"
        );


    if (!history) {
        return;
    }


    if (
        appData.weights.length === 0
    ) {

        history.innerHTML =
            "<p class='food-info'>No weight records yet.</p>";


        const morningWeight =
            document.getElementById(
                "morningWeight"
            );


        const eveningWeight =
            document.getElementById(
                "eveningWeight"
            );


        const latestWeight =
            document.getElementById(
                "latestWeight"
            );


        if (morningWeight) {
            morningWeight.textContent =
                "--";
        }


        if (eveningWeight) {
            eveningWeight.textContent =
                "--";
        }


        if (latestWeight) {
            latestWeight.textContent =
                "--";
        }


        return;
    }


    const today =
        new Date().toLocaleDateString(
            "en-IN"
        );


    const todayWeights =
        appData.weights.filter(
            item =>
                item.date === today
        );


    const morning =
        todayWeights.find(
            item =>
                item.time === "Morning"
        );


    const evening =
        todayWeights.find(
            item =>
                item.time === "Evening"
        );


    const morningWeight =
        document.getElementById(
            "morningWeight"
        );


    const eveningWeight =
        document.getElementById(
            "eveningWeight"
        );


    if (morningWeight) {

        morningWeight.textContent =
            morning
                ? morning.weight + " kg"
                : "--";
    }


    if (eveningWeight) {

        eveningWeight.textContent =
            evening
                ? evening.weight + " kg"
                : "--";
    }


    const latest =
        appData.weights[
            appData.weights.length - 1
        ];


    const latestWeight =
        document.getElementById(
            "latestWeight"
        );


    if (latestWeight) {

        latestWeight.textContent =
            latest.weight +
            " kg";
    }


    history.innerHTML = `

        <div class="weight-row">

            <strong>
                Date
            </strong>

            <strong>
                Time
            </strong>

            <strong>
                Weight
            </strong>

            <strong>
                Action
            </strong>

        </div>

    `;


    [
        ...appData.weights
    ]
        .reverse()
        .forEach(
            item => {

                history.innerHTML += `

                    <div class="weight-row">

                        <span>
                            ${item.date}
                        </span>

                        <span>
                            ${item.time}
                        </span>

                        <span>
                            ${item.weight} kg
                        </span>


                        <button
                            class="delete-food"
                            onclick="deleteWeight(${item.id})">

                            Delete

                        </button>

                    </div>

                `;
            }
        );
}


/* =========================================
   DELETE WEIGHT
========================================= */

function deleteWeight(id) {

    appData.weights =
        appData.weights.filter(
            item =>
                item.id !== id
        );


    saveData();

    renderWeights();

    updateGoal();
}


/* =========================================
   GOAL PROGRESS
========================================= */

function updateGoal() {

    const target =
        Number(
            appData.profile.targetWeight
        );


    let current =
        Number(
            appData.profile.currentWeight
        );


    if (
        appData.weights.length > 0
    ) {

        current =
            Number(
                appData.weights[
                    appData.weights.length - 1
                ].weight
            );
    }


    const goalTargetWeight =
        document.getElementById(
            "goalTargetWeight"
        );


    const goalCurrentWeight =
        document.getElementById(
            "goalCurrentWeight"
        );


    if (goalTargetWeight) {

        goalTargetWeight.textContent =
            target > 0
                ? target + " kg"
                : "--";
    }


    if (goalCurrentWeight) {

        goalCurrentWeight.textContent =
            current > 0
                ? current + " kg"
                : "--";
    }


    if (
        !current ||
        !target ||
        current <= 0 ||
        target <= 0
    ) {

        const goalProgressText =
            document.getElementById(
                "goalProgressText"
            );


        const goalProgress =
            document.getElementById(
                "goalProgress"
            );


        if (goalProgressText) {

            goalProgressText.textContent =
                "0%";
        }


        if (goalProgress) {

            goalProgress.style.width =
                "0%";
        }


        return;
    }


    let starting =
        Number(
            localStorage.getItem(
                "nutriStartingWeight"
            )
        );


    if (
        !starting ||
        starting <= 0
    ) {

        starting =
            current;


        localStorage.setItem(
            "nutriStartingWeight",
            starting
        );
    }


    let percentage = 0;


    if (
        starting > target
    ) {

        const totalDistance =
            starting - target;


        const completed =
            starting - current;


        percentage =
            (
                completed /
                totalDistance
            ) * 100;

    }


    else if (
        starting < target
    ) {

        const totalDistance =
            target - starting;


        const completed =
            current - starting;


        percentage =
            (
                completed /
                totalDistance
            ) * 100;

    }


    else {

        percentage = 100;
    }


    percentage =
        Math.min(
            Math.max(
                percentage,
                0
            ),
            100
        );


    const goalProgressText =
        document.getElementById(
            "goalProgressText"
        );


    const goalProgress =
        document.getElementById(
            "goalProgress"
        );


    if (goalProgressText) {

        goalProgressText.textContent =
            Math.round(
                percentage
            ) +
            "%";
    }


    if (goalProgress) {

        goalProgress.style.width =
            percentage +
            "%";
    }
}


/* =========================================
   ACTIVITY
========================================= */

function saveActivity() {

    appData.activity.steps =
        Number(
            document.getElementById(
                "steps"
            ).value
        ) || 0;


    appData.activity.walking =
        Number(
            document.getElementById(
                "walking"
            ).value
        ) || 0;


    appData.activity.workout =
        Number(
            document.getElementById(
                "workout"
            ).value
        ) || 0;


    saveData();

    updateActivity();


    alert(
        "Activity saved successfully!"
    );
}


/* =========================================
   UPDATE ACTIVITY
========================================= */

function updateActivity() {

    const steps =
        document.getElementById(
            "steps"
        );


    const walking =
        document.getElementById(
            "walking"
        );


    const workout =
        document.getElementById(
            "workout"
        );


    if (steps) {

        steps.value =
            appData.activity.steps || "";
    }


    if (walking) {

        walking.value =
            appData.activity.walking || "";
    }


    if (workout) {

        workout.value =
            appData.activity.workout || "";
    }


    const reportSteps =
        document.getElementById(
            "reportSteps"
        );


    if (reportSteps) {

        reportSteps.textContent =
            appData.activity.steps || 0;
    }
}


/* =========================================
   RESET TODAY
========================================= */

function resetToday() {

    const confirmReset =
        confirm(
            "Are you sure you want to delete today's food, water and activity data?"
        );


    if (!confirmReset) {

        return;
    }


    appData.foods = [];


    appData.water = 0;


    appData.activity = {

        steps: 0,

        walking: 0,

        workout: 0
    };


    saveData();


    renderFoods();

    updateNutrition();

    updateWater();

    updateActivity();


    alert(
        "Today's nutrition and activity data has been reset."
    );
}


/* =========================================
   SECURITY
========================================= */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


/* =========================================
   START APP
========================================= */

function initializeApp() {

    updateDate();

    loadProfile();

    renderFoods();

    updateNutrition();

    updateWater();

    renderWeights();

    updateActivity();

    updateGoal();

    calculateHealthMetrics();
}


/* =========================================
   RUN APP
========================================= */

initializeApp();
