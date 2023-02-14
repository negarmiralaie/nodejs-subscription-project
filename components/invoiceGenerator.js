const db = require('../models');

const GenerateInvoice = async () => {
    const customers = await db.Customer.findAll();
    for(let i=0;i<customers.length;i++){
      console.log('*********************************************************************', 'customers[i].dataValues.id', customers[i].dataValues.id,'********************************************');
      const customer_id = customers[i].dataValues.id;
      const subscriptions = await db.Subscription.findAll({ where: {customer_id} });
      for (let i=0; i<subscriptions.length ;i++){
      console.log('----------------------------------------------------------------------------', 'subscriptions[i].dataValues.price', subscriptions[i].dataValues.price,'----------------------------------------------------------------------------');
        // Now if subscription is active, create an invoice for this particular subscription..
        subscriptions[i].dataValues.isActive ? await db.Invoice.create({ name: 'sampleInvoiceName', price: subscriptions[i].dataValues.price, isActive: true}) : '';
        console.log('customers[i].dataValues.username', customers[i].dataValues.username);
        console.log('subscriptions[i].dataValues.price', subscriptions[i].dataValues.price);
        // Now decrease user's credit
        customers[i].credit = customers[i].creadit - subscriptions[i].price;
        await customers[i].save();
      }
    }
}

module.exports = GenerateInvoice;