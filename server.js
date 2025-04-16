const express = require('express')
const path = require('path')
const typeSchema = require('./models/typeSchema')
const itemSchema =require('./models/itemSchema')
const app = express()
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine' , 'ejs')
app.set('views', path.join(__dirname, 'views'));


app.use(express.json())
app.use(express.urlencoded({extended:true}))




//route for the index page 

app.get('/' ,async(req,res)=>{
  
    let itemType = await typeSchema.find().sort({ _id: -1 });

    res.render('index', { itemType });
})
app.get('/about' ,async(req,res)=>{
  
    

    res.render('about')
})


//for item creation

app.post('/add-itemType' , async(req,res)=>{
    let {itemName} = req.body;
  
    await typeSchema.create({
        itemType :itemName,
        
    })
    res.redirect('/')
})
 
//get req for showing all items on that specific type


app.get('/items/:type' ,async(req,res)=>{
    let type = req.params.type; 
    let item= await itemSchema.find({ itemType: type }); 
    res.render('itemDashboard' ,{type , item});
   
   
 
    
})


// post request for adding items to each specifc items 

app.post('/add-items/:type' , async(req,res)=>{
    let type = req.params.type;
    let {itemName , price_oneitem , numberOfItem} =req.body;
    let numberOfItemUsed_tot = 0;
    await itemSchema.create({
      itemType: type,
      itemName,
      amount: Number(price_oneitem),
      numberOfItem: Number(numberOfItem),
      numberOfItemUsed_tot :Number(numberOfItemUsed_tot)
  })
    res.redirect(`/items/${type}`);

   
   
})

//edit item
app.post('/edit-itemType/:id' ,async(req,res)=>{
    let id =req.params.id  ;
    console.log(id);
    let itemType = req.body.newItemType;
    
    await typeSchema.findByIdAndUpdate( id ,{
     itemType
    })

    res.redirect('/')
  
  })

//delete item type 
app.post('/delete-itemType/:id' ,async(req,res)=>{
  let id =req.params.id  
  await typeSchema.findOneAndDelete(id) 
 
  res.redirect('/')

})


//edit item

app.post('/edit-item/:id' ,async(req,res)=>{
    let id = req.params.id
    
    let { itemName, price_oneitem , numberOfItem_used ,numberOfItem_Added } =req.body
    console.log(req.body)
    let item = await itemSchema.findOne({ _id: id });
    let totalnubmer = parseInt(item.numberOfItemUsed_tot) || 0;
    let type=item.itemType;
    let numberOfItem_Addeds = parseInt(numberOfItem_Added) || 0;
    let numberOfItems = parseInt(item.numberOfItem) || 0;
    let numberOfItem_useds = parseInt(numberOfItem_used) || 0;
  
    let numberOfItem = numberOfItems - numberOfItem_useds + numberOfItem_Addeds;
    let numberOfItemUsed_tot
    if( numberOfItem < -1){
      let diff = numberOfItem_useds + (numberOfItems - numberOfItem_useds);
      numberOfItemUsed_tot = totalnubmer + diff
      console.log("diff" + diff);
    }else{
      numberOfItemUsed_tot = totalnubmer + numberOfItem_useds;
    };
   
    console.log(numberOfItemUsed_tot);
    if(numberOfItem < -1){
     numberOfItem =0;
    };
   
    await itemSchema.findByIdAndUpdate( id ,{
        itemName,
        amount:price_oneitem ? price_oneitem : item.amount,
        numberOfItem,
        numberOfItemUsed_tot
    })
    res.redirect(`/items/${type}`)

})
app.post('/delete-item/:id', async(req, res) => {
  try {
    let id = req.params.id
    let item = await itemSchema.findOne({ _id: id });
    
    if (!item) {
      return res.status(404).send('Item not found');
    }
    
    let type = item.itemType;
    let deleted = await itemSchema.findOneAndDelete({ _id: id })
    console.log(deleted)
    res.redirect(`/items/${type}`)
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).send('Error deleting item');
  }
})

// chart

app.get('/chart', async(req, res) => {
  let type_chart = await typeSchema.find();
  let item_chart = [];
  
  for (const val of type_chart) {
    let items = await itemSchema.find({itemType: val.itemType});
    item_chart.push(items);
  }
  
  ;
});

 app.listen(3000 , ()=>{
     console.log('server started')
 })
