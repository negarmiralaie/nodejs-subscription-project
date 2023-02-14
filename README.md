# nodejs-subscription-project
## Description
### This is a subscription system which allows customers to register and subscribe to existing services. It is implemented using expressjs.

## Project Setup
1. Run below command to start db
```bash
docker-compose up
```
> In case port was in use, run below commands:
```bash
sudo ss -lptn 'sport = :5432'
sudo kill <pid>
```

2. Run below command to start the project
```bash
npm i
npm run dev
```