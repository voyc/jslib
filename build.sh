# build icon

# compile the js files with google closure compiler
python compilejs.py $1 >min.js

# prepare index.php for production use
cp index.html index.php
sed -i -e 's/<!--<remove>//g' index.php
sed -i -e 's/<remove>-->//g' index.php
