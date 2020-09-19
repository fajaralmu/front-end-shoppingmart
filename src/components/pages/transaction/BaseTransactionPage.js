import React, { Component } from 'react'

class BaseTransactionPage extends Component {


    constructor(props) {
        super(props);
        this.formFieldIds = [];
    } 

    addFormFieldId(id) {
        if (this.formFieldIds.indexOf(id) >= 0) {

        } else {
            this.formFieldIds.push(id);
        }
    }

    emptyFormValues(){
        for (let i = 0; i < this.formFieldIds.length; i++) {
            const id = this.formFieldIds[i];
            try {
                document.getElementById(id).value = null;
            } catch (e) { }
        }
    }

}

export default BaseTransactionPage;