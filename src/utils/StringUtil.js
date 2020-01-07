export function beautifyNominal(val) {
	if(val == "" || val == null) val = "0";
	let nominal = ""+val;
	let result = "";
	if (nominal.length > 3) {
		let zero = 0;
		for (let i = nominal.length - 1; i > 0; i--) {
			zero++;
			result = nominal[i] + result;
			if (zero == 3) {
				result = "." + result;
				zero = 0;
			}

		}
		result = nominal[0] + result;
	} else {
		result = val;
	}
	return result;
}