# Recommending resources to NGOs with a web app

<p align="center">
  <a href="#"><img src="./resources/sponsors.png" width="250" title="sponsors"></a>
</p>


## :dart: Description & objective

Solidatech is a French tech4good NGO that sells software and hardware solutions to other French NGOs at a fair price. Given the multitude of products and tutorials available on Solidatech’s website, it is easy for new associations to get lost on the platform if they do not know precisely what they want. In 2020, three CentraleSupélec students and I went on to build a resource recommender system for Solidatech based on a form to help new customers identify their needs and find ways to fill in the gaps.

In a few words:
<p align="center">
  <a href="#"><img src="./resources/objective.png" width="530" title="objective"></a>
</p>


## :bulb: Methodology
<p align="center">
  <a href="https://diagnostic-numerique.solidatech.fr/"><img src="./resources/website.jpeg" width="700" title="website"></a>
</p>

To solve our problem, we developed a **web application now deployed at https://diagnostic-numerique.solidatech.fr/ (300+ users)**. Here are the credentials of a **dummy account** for you to explore a bit more the web app:
> - **email:** ```jane.doe1982@gmail.com```
> - **password:** ```ezpassword```
As the web app is in French, I recommend using the Google Translate functionality on Google Chrome to translate the pages in English. \


:man: Typical **user journey for a client**:
1. client connects to the web app from Solidatech's website
2. client creates or connects to an account and lands on home page (=> use the credentials provided above)
3. client fills the questionaire divided in 7 sections; answers are saved throughout completion (answers are then sent to the backend of the web app to compute personalized recommendations based on a scoring algorithm and editable rules defined by Solidatech)
4. client is redirected to a dashboard gathering most relevant product & tutorial suggestions
5. client disconnects from the website; results will be still be accessible later on. \


:woman_office_worker: Typical **user journey for an admin**:
1. admin connects to the web app from Solidatech's website
2. admin connects to a special admin account and lands on home page
3. admin adds/edits/re-orders/deletes questions, adds/edits/deletes products, adds/edits/deletes tutorials, edits question-product-tutorial matchings (which trigger recommendations), visualizes overall user activity, most recommended products, average score per section,...


## :file_folder: Repository organization



## :wrench:	Techs used



## :warning: Disclaimer
