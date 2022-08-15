const fs = require('fs')
const data = fs.readFileSync('duty.json', 'utf8');
const dataJson =JSON.parse(data);

const duties = []

dataJson.forEach(element => {
    duties.push(element._duty)
});

console.log(duties);
