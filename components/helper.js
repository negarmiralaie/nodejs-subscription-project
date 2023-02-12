const bcrypt = require('bcrypt');

const Helper = {
    Hash: async (password) => { //^ For hashing passwords
      console.log(password);
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    },

    paginate: async (base, page, args, limit) => {
        page = Number(page);
        page = !page || page < 1 ? null : page;
        limit = limit || Number(process.env.PER_PAGE_ITEM || 20);
        let datas = {};
        console.log('args', args)
        if ('page',page) {
          const { rows, count } = await base.findAndCountAll({
            ...args,
            limit: limit,
            offset: limit * (page - 1),
          });

          console.log('rows', rows)
          console.log('count', count)

          datas = {
            total: count,
            pages: Math.ceil(count / limit),
            docs: rows,
          };

          datas = await base.paginate({
            page,
            paginate: limit,
            ...args,
          });

        } else {
          try {
            datas = await base.findAll({
              ...args,
            });
          }catch (err) {
            console.log(err);
          }
        }
        console.log('datas', datas)
        return datas;
    },

    Compare: async (password, Hash) => {
      console.log('password', password);
      console.log('Hash', Hash);
      return await bcrypt.compare(password, Hash);
    },
}

module.exports = { Helper };