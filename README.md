### To run both frontend and backend:
- `npm i`
- `npm run dev`


### Good to Know: 
- `/reviews/` route is currently the page containing reviews (hard-coded data)
- Commet out the `<div>...<Form /> ...</div>` section in `App.tsx` if you want to see the original frontend we had


### Stuff to work on:
- Think about if we want to add number into db ie. 24 correspond to Cayon Vista or if we want to convert number to specific restaurants first before storing them to DB
- be able to post by calling `/api/post` from frontend
- figure out image with amazon s3

- how to add a collection as a field to another collection (add Post schema as a field to Menus)
- how to change mongdb uri so that it goes to Menuify database and the Menu collection
- sync Menu schema
- add search bar functionality
