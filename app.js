/* var budgetController = (function () {//IIFE-an anonymous function wrapped in parenthesis 
    var x = 23;
    var add = function (a) {
        return x + a;
    }

    return {
        publicTest: function (b) {//publicTest is object. we added a method for it. Then it can be called publicTest method
            //Which is the one that we exposed to the public 
            return (add(b));

        }
    }
})();//add parentheses--is because to immidealy-involed the function 
// Module patter--all the variable and function can NOT be accessed outside the IIFE function
/*tThe secret of module patter is it return an object containning all of the functions that we want 
be public. So the fucntion we want to give the outside scope access to.
*/
/**
 * budgetController.add(5) ERROR: budgetController.add is not a function
 * budgetController.publicTest(5) // 28
 * 
 * 说明 return 了publicTest 是一个出口 可以公共用 
 */


/*var UIController = (function () {

})();





var controller = (function (budgetCtrl, UICtrl) {//we pass other two modules as arguments, so this controller can connect them 
    var z = budgetCtrl.publicTest(5);
    return {
        anotherPublic: function(){
            console.log(z);
        }
    }                           

})(budgetController,UIController);
//when we call this function we can pass our arguemnt into the function 
//we want our "budgetController" be assigned to the "budgetCtrl"
*/

/************************************************************************ */
//BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {//for function constructor, capital letter for variable so that to distinguish with other function
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;// not defied so just set to -1
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }

    var Income = function (id, description, value) {//for function constructor, capital letter for variable so that to distinguish with other function
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calcuateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {//forEach method accept a callback function 
            sum = sum + cur.value;// "cur" either effect "income" or expenses's value
        });
        data.totals[type] = sum;

    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    };

    return {
        addItem: function (type, des, val) {

            var newItem, ID;
            //[1, 2, 3, 4, 5], next ID = 6
            //[1, 2, 4, 6, 8], next ID  = 9
            //ID = last ID + 1;

            //Create new ID
            if (data.allItems[type].length > 0) {

                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;

            } else {

                ID = 0;
            }

            //Create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            //Push it into our data structure
            data.allItems[type].push(newItem);

            //Return the new element
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;
            // id = 3
            //data.allItems[type][id];
            //ids = [1 2 4 6 8];
            //index = 3
            var ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);//ex, indexOf(6), 位置就是3

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {

            //calculate total income and expenses
            calcuateTotal('exp');
            calcuateTotal('inc');

            // calculate the budget: income - expense 减
            data.budget = data.totals.inc - data.totals.exp;//还剩多少钱

            //calculate the percentage of income that we expect 
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);//四舍五入，只留小数点后两位
            } else {
                data.percentage = -1;
            }

            // Expenses = 100 and income 200, spent 50% = 100/200 = 0.5 * 100

        },

        calculatePercentages: function () {
            /**
             * a=20
             * b=10
             * c=40
             * income = 100
             * a = 20/100 =20%
             * b = 10/100 = 10%
             * c = 40/100 = 40%
             * 
             */

            data.allItems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            })
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage,
            }
        },

        testing: function () {
            console.log(data);
        }
    };
})();


//UI Controller
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLable: '.budget__title--month',
    };
    var formatNumber = function (num, type) {
        var numSplit, int, dec;
        /**
         * + or -
         * exactly 2 deciaml points
         * comma separating the thousands
         * 
         */

        num = Math.abs(num);
        num = num.toFixed(2);//四舍五入 包流两位
        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);//input: 23510, output: 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,//Will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)//Convert string to decimals: 10.50
            };
        },
        addListItem: function (obj, type) {
            var html, newHtml;
            //Create HTML String with placeholder text 
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            };

            // Replace the placeholder text some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);//Convert a list to array

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsArr[0].focus();//set the cursor back to "description" field
        },

        deleteListItem: function (selectorID) {

            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        displayBudget: function (obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else if (obj.percentage < 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

            nodeListForEach(fields, function (current, index) {
                //Do stuff
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';

                } else {
                    current.textContent = '---';
                }

            });
        },

        displayMonth: function () {
            var year, now, month, months;
            now = new Date();
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            month = now.getMonth();

            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLable).textContent = months[month] + ', ' + year;
        },
        changedType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );
            nodeListForEach(fields,function(cur){
                cur.classList.toggle('red-focus');
            });
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();


//Global APP Controller
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {//some older borswer use "which" as property of "keyCode"
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };



    var updateBudget = function () {
        //1. Calculate the budget 
        budgetCtrl.calculateBudget();

        //2. return the budget 
        var budget = budgetCtrl.getBudget();

        //3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        //1, calculate percentage
        budgetCtrl.calculatePercentages();
        //2, Read percentage from the budget controller
        var percentages = budgetCtrl.getPercentages();
        //3, Update the UI with the new percentage
        UICtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function () {
        var input, newItem;

        //1. Get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller 
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI 
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields
            UICtrl.clearFields();

            //5. Calculate and update budget
            updateBudget();

            //6, Calculate the update percentages
            updatePercentages();

        } else {
            alert("please enter valid info");
        }


    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            //inc-1 ------>变为['inc', '1'] 
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1, Delete the item from data structure
            budgetController.deleteItem(type, ID);

            //2, Delete the item from UI
            UICtrl.deleteListItem(itemID);

            //3, Update and show the new budget
            updateBudget();

            //4, Calculate the update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            console.log('Application has started!');
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            UICtrl.displayMonth();
        }
    };

})(budgetController, UIController);

controller.init();

