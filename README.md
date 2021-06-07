Food Delivery Application :-
In this project, I will try to create an online food delivery application where users can find food and there publisher. The user can order from more than one restaurant at a time.The orders can be cancelled at any time. It uses mongodb database to search restaurants around. 
 
User Section:
A search box will accept your the food item and when you press enter, it will filter out food  
data accordingly. It is doing all this using Mongodb database which returns information about places using HTTP requests. It returns multiple things like publishername, price ,product name and a order now button. If the user is not logedIn the user can serach for the items but when he /she will try to add any item to the cart it will alert him and show a message that theyou need to login to add item to the cart. the login/signup page are also connected to the mongodb database .The password in the signup form will be encrypted using salts and during the login process it will be checked for verification. If the password and useremail is correct the user will be redireced to homepage with his/her profile and if the information is incorrect it will alert the user and show a message of incorrect password or username . Same is for the signup process after successfully saving th data to the database it will show a message that your data is saved to the database. If there are no such food item the user search in the searchbar  it will show the message no item found currently not available,Come back later. When user select a particular food item the website would show a message like item added to your cart . When the user head to the cart page it will be redirected to the cart setion where he/she can see all the items added to the cart with quantity and prices on the left and on the right all information about the bill will be shown. 
 
Language/Tech Used :-
● JavaScript 
● NodeJs
● HTML 
● CSS 
● Handlebars
● Heroku 
 
Features included in this project -
● Log in/Sign up 
● Search Menu 
● Add to cart 
● Remove from cart

LOGIN: 
The app consists of a login feature which uses username and password to login. If the user is new, he has to register with his email address first. After the user is logged in, he can search the food item.

SEARCH RESTAURANT:
The data from the products collection in mongodb will be filtered accordingly after the event of searchbar and the specific item will be shown on the website.

Cart:
When the user clicks on any one of the food items add to cart buttons the specific item will be added to his cart and he can see it through the cart page where he/she can remove them as per his/her wish.

ORDER:
Users can create orders only after they are logged in. Without logged in they would be directed to the login page.