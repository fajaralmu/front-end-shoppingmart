import { React , Component} from 'react';


export default class BaseComponent extends Component {
    constructor(props){
        super(props);
        this.parentApp = props.app; 

        this.startLoading = (withProgress) => {
            this.parentApp.startLoading(withProgress);
        }

        this.endLoading = () => {
            this.parentApp.endLoading();
        }
    }
}
