const fs = require('fs');

const lineReader = require('readline').createInterface({
	input: fs.createReadStream('input/Crimes.csv')
});
var temp = true, arrInd = [], index = [];
var jsonFile = {}, 
fs.writeFile('output/sample.json', '[ \n');
lineReader.on('line', (line) => {
	
	if(temp) {
		temp = false;
		arrInd = line.split(/,/g);
		index.push(arrInd.indexOf('ID'));
		index.push(arrInd.indexOf('Primary Type'));
		index.push(arrInd.indexOf('Description'));
		index.push(arrInd.indexOf('Arrest'));
		index.push(arrInd.indexOf('Year'));
	}
	var over_500 = [], under_500 = [];

	/(?:^|\W)THEFT(?:$|\W)/g.test(line) ? (/^.*?(?:\b|_)(OVER \$500)(?:\b|_).*?(?:\b|_)(200[1-9]|201[0-6])|(^200[1-9]$|^201[0-6]$)(?:\b|_).*?(?:\b|_)(OVER \$500)(?:\b|_).*?$/.test(line) ? over_500.push(line) : '' ) : '';
 	/(?:^|\W)THEFT(?:$|\W)/g.test(line) ? (/^.*?(?:\b|_)(500\$ AND UNDER)(?:\b|_).*?(?:\b|_)(200[1-9]|201[0-6])|(^200[1-9]$|^201[0-6]$)(?:\b|_).*?(?:\b|_)(500\$ AND UNDER)(?:\b|_).*?$/.test(line) ? under_500.push(line) : '') : '';

 		over_500.map((over) => {
			var over_500_1 = over.split(/,/g);
			jsonFile[arrInd[index[0]]] = over_500_1[index[0]];
			jsonFile[arrInd[index[1]]] = over_500_1[index[1]];
			jsonFile[arrInd[index[2]]] = over_500_1[index[2]];
			jsonFile[arrInd[index[3]]] = over_500_1[index[3]];
			jsonFile[arrInd[index[4]]] = over_500_1[index[4]];
			
			fs.appendFile('output/over.json', JSON.stringify(jsonFile)+',\n');
		});

		under_500.map((under) => {
			var under_500_1 = under.split(/,/g);
			var jsonFile = {};
			jsonFile[arrInd[index[0]]] = under_500_1[index[0]];
			jsonFile[arrInd[index[1]]] = under_500_1[index[1]];
			jsonFile[arrInd[index[2]]] = under_500_1[index[2]];
			jsonFile[arrInd[index[3]]] = under_500_1[index[3]];
			jsonFile[arrInd[index[4]]] = under_500_1[index[4]];
			
			fs.appendFile('output/sample.json', JSON.stringify(jsonFile)+',\n');
		});
});

lineReader.on('close', () => {
	fs.appendFile('output/sample.json', ']');
});