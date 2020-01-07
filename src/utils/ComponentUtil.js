export const clearFields = (...ignore) => {
    let inputs = document.getElementsByTagName("input");
    let withIgnore = ignore != null;
    loop: for (let i = 0; i < inputs.length; i++) {
        if (withIgnore)
            for (let y = 0; y < ignore.length; y++)
                if (inputs[i].id == ignore[y]) continue loop;

        if (inputs[i].type == "text") inputs[i].value = "";
        if (inputs[i].type == "number") inputs[i].value = 0;
    }
}

export const createNavButtons = (totalButton) => {
    let buttonData = [];
    for (let index = 0; index < totalButton; index++) {
        buttonData.push({
            text: index + 1,
            value: index
        });
    }
    return buttonData;
}

export const getCurrentMMYY = () => {
    return [new Date().getMonth(), new Date().getFullYear()];
}

export const getDropdownOptionsMonth = () => {
    let options = [];
    for (let i = 1; i <= 12; i++) {
        options.push({value:i, text:i});
    }
    return options;
}
export const getDropdownOptionsYear = (from , to) => {
    let options = [];
    for (let i = from; i <= to; i++) {
        options.push({value:i, text:i});
    }
    return options;
}